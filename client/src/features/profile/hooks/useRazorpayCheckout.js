// useRazorpayCheckout.js
//
// Order creation and payment verification are mocked (see
// mockWalletServer.js) — everything else here is exactly how a real
// integration works: load the checkout script once, create an order,
// open Razorpay Checkout, and on success verify the payment before
// trusting it.
//
// Swap in production:
//   const order = await fetch("/api/wallet/orders", { method: "POST", body: JSON.stringify({ amount }) }).then(r => r.json());
//   ...
//   const result = await fetch("/api/wallet/orders/verify", { method: "POST", body: JSON.stringify({
//     orderId: response.razorpay_order_id,
//     paymentId: response.razorpay_payment_id,
//     signature: response.razorpay_signature,
//   }) }).then(r => r.json());
//
// Never do the signature check in the browser — it needs your key secret.

import { useCallback, useRef, useState } from "react";
import { createOrder, verifyPayment } from "@/features/profile/lib/mockWalletServer";

const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true);
    const existing = document.querySelector(`script[src="${RAZORPAY_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => reject(new Error("SCRIPT_LOAD_FAILED")));
      return;
    }
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_SRC;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("SCRIPT_LOAD_FAILED"));
    document.body.appendChild(script);
  });
}

export default function useRazorpayCheckout({ user, onSuccess, onError }) {
  const [status, setStatus] = useState("idle"); // idle | loading | processing
  const busyRef = useRef(false);

  const openCheckout = useCallback(
    async (amountInRupees) => {
      if (busyRef.current) return;
      busyRef.current = true;
      setStatus("loading");
      try {
        await loadRazorpayScript();
        const order = await createOrder({ userId: user.userId, amount: amountInRupees });

        const options = {
          // TODO: pull from env, e.g. import.meta.env.VITE_RAZORPAY_KEY_ID
          // This is the PUBLIC key only — never put the key secret here.
          key: "rzp_test_XXXXXXXXXXXX",
          amount: order.amount * 100, // Razorpay expects paise
          currency: order.currency,
          name: "BidArena Systems",
          description: "Wallet Top-up",
          order_id: order.id,
          prefill: { name: user.userName },
          theme: { color: "#0BC5A8" },
          handler: async (response) => {
            setStatus("processing");
            try {
              const result = await verifyPayment({
                userId: user.userId,
                orderId: response.razorpay_order_id ?? order.id,
                paymentId: response.razorpay_payment_id,
                amount: amountInRupees,
              });
              onSuccess?.(result);
            } catch (err) {
              onError?.(err);
            } finally {
              setStatus("idle");
              busyRef.current = false;
            }
          },
          modal: {
            ondismiss: () => {
              setStatus("idle");
              busyRef.current = false;
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", (resp) => {
          onError?.(resp.error);
          setStatus("idle");
          busyRef.current = false;
        });
        rzp.open();
      } catch (err) {
        onError?.(err);
        setStatus("idle");
        busyRef.current = false;
      }
    },
    [user, onSuccess, onError],
  );

  return { openCheckout, status };
}