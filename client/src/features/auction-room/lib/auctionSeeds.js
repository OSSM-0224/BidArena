// auctionSeeds.js
//
// TODO(FR-5): replace this lookup with `await fetch(\`/api/auctions/\${id}\`)`
// on page load. Shape returned here is exactly what AuctionRoom expects, so
// swapping the source is a one-line change in AuctionRoom.jsx.

const SEEDS = {
  "IDX-4XX7XB": {
    id: "IDX-4XX7XB",
    title: "Obsidian Hardware Ledger (Ltd Ed)",
    icon: "memory",
    description:
      "A limited-edition offline signing device with tamper-evident casing and dual air-gapped secure elements. One of 200 ever produced.",
    seller: { name: "Vault Systems Co.", rating: 4.9, verified: true },
    status: "active",
    startingBid: 12450,
    minIncrement: 100,
    durationMs: 42 * 60 * 1000 + 12 * 1000,
  },
  "IDX-9182LK": {
    id: "IDX-9182LK",
    title: "Carbon-Core Neural Chip Array",
    icon: "widgets",
    description:
      "8-node neuromorphic inference array, carbon-fiber shielded, benchmarked at 340 TOPS/W. Pulled from a decommissioned research cluster.",
    seller: { name: "Ridgeline Salvage", rating: 4.6, verified: true },
    status: "active",
    startingBid: 6820,
    minIncrement: 50,
    durationMs: 8 * 60 * 1000,
  },
  "IDX-3729BF": {
    id: "IDX-3729BF",
    title: "Neo-Kyoto Residential Tier 1",
    icon: "location_city",
    description: "Tier 1 residential allocation in the Neo-Kyoto arcology, floors 40-45, unfurnished shell.",
    seller: { name: "Arcology Holdings", rating: 4.8, verified: true },
    status: "upcoming",
    startingBid: 85200,
    minIncrement: 500,
    durationMs: 6 * 60 * 60 * 1000,
  },
  "IDX-5567QW": {
    id: "IDX-5567QW",
    title: "Orbital Relay Access Node",
    icon: "satellite_alt",
    description: "Priority access slot on the LEO relay backbone, 5-year lease, transferable.",
    seller: { name: "Meridian Orbital", rating: 4.7, verified: false },
    status: "upcoming",
    startingBid: 3000,
    minIncrement: 100,
    durationMs: 26 * 60 * 60 * 1000,
  },
  "IDX-1120ZP": {
    id: "IDX-1120ZP",
    title: "Legacy Archive Data_Set — Vol. 7",
    icon: "database",
    description: "Curated archival data set, volume 7 of the legacy series. Read-only, notarized checksum included.",
    seller: { name: "Deepwell Archive", rating: 4.5, verified: true },
    status: "completed",
    startingBid: 1980,
    minIncrement: 50,
    durationMs: 0,
  },
};

export function getAuctionSeed(id) {
  return SEEDS[id] ?? null;
}