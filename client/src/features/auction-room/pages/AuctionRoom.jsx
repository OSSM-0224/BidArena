import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAuctionSocket from "@/features/auction-room/hooks/useAuctionSocket";
import { getAuctionSeed } from "@/features/auction-room/lib/auctionSeeds";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import StatsBar from "@/components/statusBar";
import BidPanel from "@/components/BidPanel";
import HeatMeter from "@/components/HeatMeter";
import AuctionChat from "@/components/AuctionChat";
import TimelineLog from "@/components/TimlineLog";


// TODO: pull from real auth/session context (e.g. useSelector for the
// logged-in user, same slice `currentLoggedUser()` populates).
const CURRENT_USER = { userId: "u_flash_01", userName: "Flash" };

const statusConfig = {
  active: { label: "Live", tone: "primary" },
  upcoming: { label: "Upcoming", tone: "secondary" },
  completed: { label: "Completed", tone: "neutral" },
};

// The single destination for every "Place Bid" / "Join Auction" / "View
// Intel" / "Details" button across Dashboard and Active Bids. Whoever
// navigates here just sets location.state.initialMode; the page itself
// still re-syncs against the authoritative room state on join (FR-7)
// regardless of which mode it was opened in.
const AuctionRoom = () => {
  const { auctionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const seed = getAuctionSeed(auctionId);
  const initialMode = location.state?.initialMode ?? "spectator";

  const {
    connectionStatus,
    state,
    chat,
    timeline,
    mode,
    becomeBidder,
    becomeSpectator,
    submitBid,
    sendChat,
    lastRejection,
    clearRejection,
  } = useAuctionSocket({
    auctionId,
    seed: seed ?? {},
    user: CURRENT_USER,
    mode: initialMode,
  });

  if (!seed) {
    return (
      <div className="terminal-glass tech-border tech-border-tl tech-border-br p-10 text-center font-label-mono text-[12px] text-outline uppercase tracking-widest">
        Auction not found
        <div className="mt-4">
          <Button size="sm" variant="secondary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (connectionStatus !== "connected" || !state) {
    return (
      <div className="terminal-glass tech-border tech-border-tl tech-border-br p-10 text-center font-label-mono text-[12px] text-outline uppercase tracking-widest animate-pulse">
        Connecting to auction room...
      </div>
    );
  }

  const config = statusConfig[state.status] ?? statusConfig.active;

  return (
    <div className="space-y-6">
      {/* Header: product / seller info + status */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center border border-outline-variant text-outline shrink-0 mt-1"
            aria-label="Back"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          </button>
          <div className="w-16 h-16 bg-surface-container-low border border-outline-variant flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-outline text-[28px]">{state.icon}</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-bold text-on-surface leading-tight">{state.title}</h1>
              <Badge tone={config.tone}>{config.label}</Badge>
            </div>
            <div className="font-label-mono text-[10px] uppercase tracking-widest text-outline">
              {auctionId}
              {" · "}
              Seller: {state.seller?.name}
              {state.seller?.verified && (
                <span className="text-primary ml-1" title="Verified seller">
                  ✓
                </span>
              )}
            </div>
            <p className="text-on-surface-variant text-[13px] max-w-xl">{state.description}</p>
          </div>
        </div>

        {/* Bidder / Spectator mode toggle (FR-7 / FR-8) */}
        <div className="flex gap-2 shrink-0">
          <Button
            size="sm"
            variant={mode === "spectator" ? "primary" : "secondary"}
            onClick={becomeSpectator}
          >
            Spectate
          </Button>
          <Button
            size="sm"
            variant={mode === "bidder" ? "primary" : "secondary"}
            onClick={becomeBidder}
            disabled={state.status !== "active"}
          >
            Bid
          </Button>
        </div>
      </div>

      <StatsBar bidders={state.bidders} spectators={state.spectators} bidCount={state.bidCount} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: bidding + heat */}
        <div className="lg:col-span-2 space-y-5">
          <BidPanel
            status={state.status}
            highestBid={state.highestBid}
            highestBidder={state.highestBidder}
            minIncrement={state.minIncrement}
            timeLeftMs={state.timeLeftMs}
            mode={mode}
            onBecomeBidder={becomeBidder}
            onSubmitBid={submitBid}
            rejection={lastRejection}
            onClearRejection={clearRejection}
            currentUserId={CURRENT_USER.userId}
          />
          <div className="terminal-glass tech-border tech-border-tl tech-border-br p-5">
            <HeatMeter heat={state.heat} />
          </div>
          <TimelineLog entries={timeline} />
        </div>

        {/* Right: live chat — never blocks the auction engine if it fails */}
        <div className="lg:col-span-1">
          <AuctionChat messages={chat} onSend={sendChat} currentUserId={CURRENT_USER.userId} />
        </div>
      </div>
    </div>
  );
};

export default AuctionRoom;