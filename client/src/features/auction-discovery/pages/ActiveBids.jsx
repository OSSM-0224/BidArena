import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SegmentControl from "@/components/SegmentControl";
import AuctionCard from "@/components/AuctionCard";

const filterOptions = [
  { label: "Active", value: "active" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Completed", value: "completed" },
];

// Mock data — swap this for your real auction feed (FR-5: fetch on load).
// AuctionRoom re-syncs its own authoritative state on open, so this list
// only needs enough to render the cards.
const auctions = [
  {
    id: "IDX-4XX7XB",
    icon: "memory",
    title: "Obsidian Hardware Ledger (Ltd Ed)",
    status: "active",
    priceLabel: "Current Bid",
    price: "$12,450.00",
    targetTime: Date.now() + 42 * 60 * 1000 + 12 * 1000,
    bidders: 18,
    spectators: 64,
    actionLabel: "Join Auction",
  },
  {
    id: "IDX-9182LK",
    icon: "widgets",
    title: "Carbon-Core Neural Chip Array",
    status: "active",
    priceLabel: "Current Bid",
    price: "$6,820.00",
    targetTime: Date.now() + 8 * 60 * 1000,
    bidders: 27,
    spectators: 112,
    actionLabel: "Join Auction",
  },
  {
    id: "IDX-3729BF",
    icon: "location_city",
    title: "Neo-Kyoto Residential Tier 1",
    status: "upcoming",
    priceLabel: "Starting Bid",
    price: "$85,200.00",
    targetTime: Date.now() + 6 * 60 * 60 * 1000,
    bidders: 0,
    spectators: 9,
    actionLabel: "Notify Me",
  },
  {
    id: "IDX-5567QW",
    icon: "satellite_alt",
    title: "Orbital Relay Access Node",
    status: "upcoming",
    priceLabel: "Starting Bid",
    price: "$3,000.00",
    targetTime: Date.now() + 26 * 60 * 60 * 1000,
    bidders: 0,
    spectators: 4,
    actionLabel: "Notify Me",
  },
  {
    id: "IDX-1120ZP",
    icon: "database",
    title: "Legacy Archive Data_Set — Vol. 7",
    status: "completed",
    priceLabel: "Winning Bid",
    price: "$1,980.00",
    bidders: 9,
    spectators: 31,
    actionLabel: "View Results",
  },
];

const ActiveBids = () => {
  const [filter, setFilter] = useState("active");
  const navigate = useNavigate();

  const filtered = useMemo(() => auctions.filter((a) => a.status === filter), [filter]);

  // Live auctions open straight into bidder mode ("Join Auction"); anything
  // else opens as a spectator (upcoming: watch + get notified, completed:
  // view results). AuctionRoom itself still gates real bidding behind FR-7's
  // server sync regardless of how it was opened.
  const openRoom = (auction) => {
    navigate(`/dashboard/auction/${auction.id}`, {
      state: { initialMode: auction.status === "active" ? "bidder" : "spectator" },
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-[24px] font-bold text-on-surface">Active Bids</h1>
          <p className="text-on-surface-variant text-[13px]">
            Browse live, upcoming, and completed auctions across the network.
          </p>
        </div>
        <div className="w-full md:w-auto md:min-w-[320px]">
          <SegmentControl options={filterOptions} value={filter} onChange={setFilter} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="terminal-glass tech-border tech-border-tl tech-border-br p-10 text-center font-label-mono text-[12px] text-outline uppercase tracking-widest">
          No {filter} auctions right now
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((auction) => (
            <AuctionCard key={auction.id} {...auction} onAction={() => openRoom(auction)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveBids;