// profileSeed.js
//
// TODO: replace getProfile() with a real fetch to your user/profile
// endpoint. Shape returned here is exactly what the Profile page and its
// components expect, so swapping the source is a one-line change.

const PROFILE = {
  userId: "u_flash_01",
  name: "Flash",
  handle: "@flash_1809",
  email: "flash@bidarena.systems",
  phone: "+91 98XXX XX210",
  memberSince: "2024-03-11",
  verified: true,
  kycStatus: "verified", // 'verified' | 'pending' | 'unverified'
  stats: {
    auctionsCreated: 12,
    auctionsWon: 34,
    totalBidsPlaced: 268,
    winRate: 0.62, // 62%
  },
  wallet: {
    balance: 18450,
    currency: "INR",
  },
  bidHistory: [
    {
      id: "bid_9182",
      auctionId: "IDX-4XX7XB",
      title: "Obsidian Hardware Ledger (Ltd Ed)",
      amount: 12450,
      status: "leading", // 'leading' | 'won' | 'outbid' | 'lost'
      date: "2026-07-30T11:42:00Z",
    },
    {
      id: "bid_9155",
      auctionId: "IDX-9182LK",
      title: "Carbon-Core Neural Chip Array",
      amount: 6820,
      status: "outbid",
      date: "2026-07-30T10:20:00Z",
    },
    {
      id: "bid_8890",
      auctionId: "IDX-7723CK",
      title: "Quantum Relay Firmware Key",
      amount: 4200,
      status: "won",
      date: "2026-07-27T18:04:00Z",
    },
    {
      id: "bid_8711",
      auctionId: "IDX-6610MN",
      title: "Deep Archive Cold Storage Unit",
      amount: 990,
      status: "lost",
      date: "2026-07-22T09:15:00Z",
    },
    {
      id: "bid_8502",
      auctionId: "IDX-5540PP",
      title: "Synth-Leather Field Jacket, Sz M",
      amount: 340,
      status: "won",
      date: "2026-07-18T14:31:00Z",
    },
  ],
};

export function getProfile(userId) {
  // Single mock user for now — real version would key off userId.
  return { ...PROFILE, userId };
}