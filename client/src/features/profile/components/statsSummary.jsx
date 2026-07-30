import StatCard from "@/components/StatCard";

const StatsSummary = ({ auctionsCreated, auctionsWon, totalBidsPlaced, winRate }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
    <StatCard label="Auctions Created" value={auctionsCreated} icon="add_box" />
    <StatCard label="Auctions Won" value={auctionsWon} icon="trophy" valueClassName="text-primary" />
    <StatCard label="Total Bids Placed" value={totalBidsPlaced} icon="gavel" />
    <StatCard label="Win Rate" value={`${Math.round(winRate * 100)}%`} icon="target" valueClassName="text-secondary" />
  </div>
);

export default StatsSummary;