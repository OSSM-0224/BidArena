// mockWalletServer.js
//
// Razorpay's flow is deliberately split so the secret key never touches the
// browser: the client asks YOUR server to create an order, Razorpay's
// checkout collects payment, then the client tells YOUR server the payment
// happened and YOUR server verifies the signature (using the key secret)
// before crediting the wallet. This file fakes both of those server calls
// so the UI works today. Replace `createOrder` and `verifyPayment` with real
// fetch() calls to your backend — do not just move this logic client-side
// as-is.
//
// Real backend shape (Node/Express-ish, for reference):
//
//   POST /api/wallet/orders          { amount }        -> { id, amount, currency }
//     -> razorpayInstance.orders.create({ amount: amount * 100, currency: "INR" })
//
//   POST /api/wallet/orders/verify   { orderId, paymentId, signature }
//     -> verify HMAC-SHA256(orderId + "|" + paymentId, RAZORPAY_KEY_SECRET) === signature
//     -> if valid: credit wallet in DB, return new balance
//     -> if invalid: reject, do NOT credit

const wallets = new Map();

function getWallet(userId, startingBalance = 0) {
  if (!wallets.has(userId)) {
    wallets.set(userId, { balance: startingBalance, transactions: [] });
  }
  return wallets.get(userId);
}

export function seedWallet(userId, startingBalance) {
  if (!wallets.has(userId)) {
    wallets.set(userId, { balance: startingBalance, transactions: [] });
  }
}

// Stands in for POST /api/wallet/orders
export async function createOrder({ userId, amount }) {
  await new Promise((r) => setTimeout(r, 300)); // simulate network
  return {
    id: `order_mock_${Date.now()}`,
    amount,
    currency: "INR",
    userId,
  };
}

// Stands in for POST /api/wallet/orders/verify
// In production this MUST run server-side, checking the signature against
// your Razorpay key secret before crediting anything.
export async function verifyPayment({ userId, orderId, paymentId, amount }) {
  await new Promise((r) => setTimeout(r, 300));
  const wallet = getWallet(userId);
  wallet.balance += amount;
  const txn = {
    id: `txn_${Date.now()}`,
    type: "topup",
    amount,
    orderId,
    paymentId,
    status: "success",
    ts: new Date().toISOString(),
  };
  wallet.transactions = [txn, ...wallet.transactions].slice(0, 50);
  return { balance: wallet.balance, transaction: txn };
}

export function getWalletSnapshot(userId, startingBalance) {
  return getWallet(userId, startingBalance);
}