// useAuctionSocket.js
//
// Single point of contact between the UI and the auction engine.
// Today it talks to mockAuctionServer.js. In production, replace the guts
// (connect/emit/on calls) with a real `socket.io-client` instance pointed at
// your Auction Engine service — the hook's return shape (state, submitBid,
// sendChat, mode, setMode, connectionStatus) is the contract the rest of
// the app is built against, so pages don't need to change.
//
// import { io } from "socket.io-client";
// const socket = io(AUCTION_WS_URL, { auth: { token } });
// socket.emit("room:join", { auctionId, mode });
// socket.on("state:sync", ...) etc.

import { useCallback, useEffect, useRef, useState } from "react";
import { getRoom } from "@/features/auction-room/lib/mockAuctionServer";

export default function useAuctionSocket({ auctionId, seed, user, mode = "spectator" }) {
  const roomRef = useRef(null);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [currentMode, setCurrentMode] = useState(mode); // 'bidder' | 'spectator'
  const [state, setState] = useState(null);
  const [lastRejection, setLastRejection] = useState(null);
  const [chat, setChat] = useState([]);
  const [timeline, setTimeline] = useState([]);

  // Connect + join room.
  useEffect(() => {
    if (!auctionId) return undefined;
    setConnectionStatus("connecting");

    const room = getRoom({ id: auctionId, ...seed });
    roomRef.current = room;

    // FR-7 / FR-8: whichever mode we join in, the very first thing we get
    // back is the authoritative snapshot — bids can't be placed against
    // stale local state.
    const snap = currentMode === "bidder" ? room.joinAsBidder(user) : room.joinAsSpectator(user);
    setState(snap);
    setChat(snap.chat);
    setTimeline(snap.timeline);
    setConnectionStatus("connected");

    const onStats = (e) => setState((prev) => (prev ? { ...prev, ...e.detail } : prev));
    const onBidAccepted = (e) =>
      setState((prev) =>
        prev
          ? { ...prev, highestBid: e.detail.amount, highestBidder: { userId: e.detail.userId, userName: e.detail.userName } }
          : prev,
      );
    const onRejected = (e) => setLastRejection(e.detail);
    const onTick = (e) => setState((prev) => (prev ? { ...prev, timeLeftMs: e.detail.timeLeftMs } : prev));
    const onTimeline = (e) => setTimeline((prev) => [...prev, e.detail.entry].slice(-200));
    const onChat = (e) => setChat((prev) => [...prev, e.detail.message].slice(-100));
    const onEnded = (e) =>
      setState((prev) => (prev ? { ...prev, status: "completed", highestBidder: e.detail.winner, highestBid: e.detail.winningBid } : prev));

    room.bus.addEventListener("stats", onStats);
    room.bus.addEventListener("bid:accepted", onBidAccepted);
    room.bus.addEventListener("bid:rejected", onRejected);
    room.bus.addEventListener("tick", onTick);
    room.bus.addEventListener("timeline", onTimeline);
    room.bus.addEventListener("chat", onChat);
    room.bus.addEventListener("ended", onEnded);

    return () => {
      room.bus.removeEventListener("stats", onStats);
      room.bus.removeEventListener("bid:accepted", onBidAccepted);
      room.bus.removeEventListener("bid:rejected", onRejected);
      room.bus.removeEventListener("tick", onTick);
      room.bus.removeEventListener("timeline", onTimeline);
      room.bus.removeEventListener("chat", onChat);
      room.bus.removeEventListener("ended", onEnded);
      room.leave({ userId: user.userId });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auctionId, currentMode]);

  // FR-9: the client never writes to the "database" — it only ever asks the
  // server to attempt a bid, and waits to be told whether it landed.
  const submitBid = useCallback(
    async (amount) => {
      if (!roomRef.current) return { ok: false, reason: "NOT_CONNECTED" };
      if (currentMode !== "bidder") return { ok: false, reason: "SPECTATOR_MODE" };
      const result = await roomRef.current.submitBid({ amount, userId: user.userId, userName: user.userName });
      if (!result.ok) setLastRejection({ bidId: null, reason: result.reason });
      return result;
    },
    [currentMode, user],
  );

  const sendChat = useCallback(
    (message) => {
      roomRef.current?.sendChat({ userId: user.userId, userName: user.userName, message });
    },
    [user],
  );

  // FR-7: switching into bidder mode re-syncs against the authoritative
  // state before any bid can be placed (handled by the effect above re-running).
  const becomeBidder = useCallback(() => setCurrentMode("bidder"), []);
  const becomeSpectator = useCallback(() => setCurrentMode("spectator"), []);

  return {
    connectionStatus,
    state,
    chat,
    timeline,
    mode: currentMode,
    becomeBidder,
    becomeSpectator,
    submitBid,
    sendChat,
    lastRejection,
    clearRejection: () => setLastRejection(null),
  };
}