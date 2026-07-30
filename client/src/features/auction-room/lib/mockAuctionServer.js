// mockAuctionServer.js
//
// Stand-in for the real backend. In production this file disappears and
// useAuctionSocket.js talks to a real Socket.io server instead. It exists so
// the AuctionRoom page has a believable, spec-shaped authority to talk to
// during development, and so the FR-9..FR-18 contracts are visible as code,
// not just as prose.
//
// Every "room" keeps its own state + a FIFO bid queue + a server-side timer.
// The client (useAuctionSocket) never mutates this state directly — it only
// calls the methods below, which mirror what would be socket.emit() calls,
// and subscribes to events, which mirror socket.on() listeners.

const rooms = new Map();

const MIN_INCREMENT = 50;
const TICK_MS = 1000;

function nowIso() {
  return new Date().toISOString();
}

function makeRoom(seed) {
  const bus = new EventTarget();
  const state = {
    id: seed.id,
    title: seed.title,
    icon: seed.icon,
    description: seed.description,
    seller: seed.seller,
    status: seed.status, // 'upcoming' | 'active' | 'completed'
    highestBid: seed.startingBid,
    highestBidder: null,
    minIncrement: seed.minIncrement ?? MIN_INCREMENT,
    bidCount: 0,
    bidders: new Map(), // userId -> { name }
    spectators: new Map(), // userId -> { name }
    heat: 12,
    timeLeftMs: seed.durationMs,
    timeline: [
      {
        id: `evt_${Date.now()}`,
        type: "created",
        message: "Auction room created",
        meta: {},
        ts: nowIso(),
      },
    ],
    chat: [],
  };

  // FR-12: Deterministic ordering. Concurrent bid requests land in this
  // queue in arrival order at the server and are drained one at a time by
  // `draining`, regardless of each client's network latency. "Arrival order"
  // is defined by the server's receipt sequence, not client timestamps —
  // that's what makes it explainable and not a race.
  const queue = [];
  let draining = false;

  function emit(type, detail) {
    bus.dispatchEvent(new CustomEvent(type, { detail }));
  }

  function pushTimeline(type, message, meta = {}) {
    const entry = { id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, type, message, meta, ts: nowIso() };
    state.timeline = [...state.timeline, entry].slice(-200);
    emit("timeline", { entry });
  }

  function recomputeHeat() {
    // FR-16: activity metric from bid frequency, active users, spectators, chat intensity.
    const recentBids = state.timeline.filter(
      (e) => e.type === "bid" && Date.now() - new Date(e.ts).getTime() < 60_000,
    ).length;
    const recentChat = state.chat.filter((m) => Date.now() - new Date(m.ts).getTime() < 60_000).length;
    const raw =
      recentBids * 12 + state.bidders.size * 4 + state.spectators.size * 1.5 + recentChat * 2;
    state.heat = Math.max(0, Math.min(100, Math.round(raw)));
  }

  function broadcastStats() {
    // FR-15: live stats sync.
    recomputeHeat();
    emit("stats", {
      bidCount: state.bidCount,
      bidders: state.bidders.size,
      spectators: state.spectators.size,
      heat: state.heat,
      status: state.status,
    });
  }

  function snapshot() {
    return {
      ...state,
      bidders: state.bidders.size,
      spectators: state.spectators.size,
    };
  }

  // FR-10 + FR-11: validate, then apply atomically as a single synchronous
  // step (no other bid can interleave because JS is single-threaded and we
  // only advance the queue after this fully resolves).
  function processOneBid(job) {
    const { amount, userId, userName, bidId, resolve } = job;

    if (state.status !== "active") {
      resolve({ ok: false, reason: "ROOM_NOT_ACTIVE" });
      emit("bid:rejected", { bidId, reason: "ROOM_NOT_ACTIVE" });
      return;
    }
    if (!userId) {
      resolve({ ok: false, reason: "NOT_AUTHENTICATED" });
      emit("bid:rejected", { bidId, reason: "NOT_AUTHENTICATED" });
      return;
    }
    if (amount < state.highestBid + state.minIncrement) {
      resolve({ ok: false, reason: "BID_TOO_LOW" });
      emit("bid:rejected", { bidId, reason: "BID_TOO_LOW" });
      return;
    }
    if (state.highestBidder?.userId === userId) {
      resolve({ ok: false, reason: "DUPLICATE_LEADER" });
      emit("bid:rejected", { bidId, reason: "DUPLICATE_LEADER" });
      return;
    }

    // Atomic update: highest bid/bidder, bid count, timeline, then persist + broadcast.
    state.highestBid = amount;
    state.highestBidder = { userId, userName };
    state.bidCount += 1;
    // TODO(real backend): persist this row inside the same DB transaction
    // that updates the room's highest-bid columns, then commit before broadcasting.
    pushTimeline("bid", `${userName} bid $${amount.toLocaleString()}`, { userId, amount });
    broadcastStats();

    resolve({ ok: true, amount, userId, userName });
    // FR-14: propagate the accepted bid to every connected participant.
    emit("bid:accepted", { bidId, amount, userId, userName, ts: nowIso() });
  }

  function drainQueue() {
    if (draining) return;
    draining = true;
    while (queue.length) {
      processOneBid(queue.shift());
    }
    draining = false;
  }

  function submitBid({ amount, userId, userName }) {
    return new Promise((resolve) => {
      const bidId = `bid_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      queue.push({ amount, userId, userName, bidId, resolve });
      // Queued in arrival order; drained synchronously and one at a time.
      queueMicrotask(drainQueue);
    });
  }

  function joinAsBidder({ userId, userName }) {
    state.bidders.set(userId, { name: userName });
    state.spectators.delete(userId);
    broadcastStats();
    return snapshot();
  }

  function joinAsSpectator({ userId, userName }) {
    state.spectators.set(userId, { name: userName });
    broadcastStats();
    return snapshot();
  }

  function leave({ userId }) {
    state.bidders.delete(userId);
    state.spectators.delete(userId);
    broadcastStats();
  }

  function sendChat({ userId, userName, message }) {
    // FR-17: chat is a separate channel — failures here must never touch
    // bid state. We isolate it in its own try/catch so a bad message can't
    // take down the auction engine above.
    try {
      if (!message || !message.trim()) throw new Error("EMPTY_MESSAGE");
      const chatMsg = {
        id: `chat_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        userId,
        userName,
        message: message.slice(0, 500),
        ts: nowIso(),
      };
      state.chat = [...state.chat, chatMsg].slice(-100);
      emit("chat", { message: chatMsg });
      recomputeHeat();
    } catch (err) {
      emit("chat:error", { reason: err.message });
    }
  }

  // FR-18: authoritative timer lives only on the server; clients just
  // render whatever timeLeftMs they're told, they never compute it locally.
  let timer = null;
  function startTimer() {
    if (timer || state.status !== "active") return;
    timer = setInterval(() => {
      state.timeLeftMs = Math.max(0, state.timeLeftMs - TICK_MS);
      emit("tick", { timeLeftMs: state.timeLeftMs });
      if (state.timeLeftMs <= 0) {
        clearInterval(timer);
        timer = null;
        state.status = "completed";
        pushTimeline("winner", state.highestBidder ? `${state.highestBidder.userName} won at $${state.highestBid.toLocaleString()}` : "Auction closed — no bids", {});
        broadcastStats();
        emit("ended", { winner: state.highestBidder, winningBid: state.highestBid });
      }
    }, TICK_MS);
  }

  if (state.status === "active") startTimer();

  return {
    bus,
    snapshot,
    submitBid,
    joinAsBidder,
    joinAsSpectator,
    leave,
    sendChat,
  };
}

export function getRoom(seed) {
  if (!rooms.has(seed.id)) {
    rooms.set(seed.id, makeRoom(seed));
  }
  return rooms.get(seed.id);
}