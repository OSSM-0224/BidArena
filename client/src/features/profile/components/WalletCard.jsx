import { useState } from "react";
import Button from "@/components/Button";
import useRazorpayCheckout from "@/features/profile/hooks/useRazorpayCheckout";

const PRESETS = [500, 1000, 5000];

const WalletCard = ({ user, balance, onBalanceChange }) => {
  const [amount, setAmount] = useState(500);
  const [error, setError] = useState(null);
  const [justAdded, setJustAdded] = useState(null);

  const { openCheckout, status } = useRazorpayCheckout({
    user,
    onSuccess: (result) => {
      setError(null);
      setJustAdded(amount);
      onBalanceChange?.(result.balance);
    },
    onError: (err) => {
      setError(err?.description || err?.message || "Payment failed. Please try again.");
    },
  });

  const handleAddMoney = () => {
    setError(null);
    setJustAdded(null);
    if (!amount || amount < 1) {
      setError("Enter an amount to add.");
      return;
    }
    openCheckout(amount);
  };

  return (
    <div className="terminal-glass tech-border tech-border-tl tech-border-br p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-label-mono text-[9px] uppercase tracking-widest text-outline">
            Wallet Balance
          </div>
          <div className="text-[26px] font-bold text-primary leading-tight">
            ₹{balance.toLocaleString("en-IN")}
          </div>
        </div>
        <span className="material-symbols-outlined text-outline text-[28px]">account_balance_wallet</span>
      </div>

      <div className="space-y-2">
        <div className="font-label-mono text-[9px] uppercase tracking-widest text-outline">
          Add Money
        </div>
        <div className="flex gap-2 flex-wrap">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => setAmount(p)}
              className={`px-3 py-1.5 font-label-mono text-[12px] border ${
                amount === p
                  ? "border-primary text-primary"
                  : "border-outline-variant text-outline hover:text-on-surface"
              }`}
            >
              ₹{p.toLocaleString("en-IN")}
            </button>
          ))}
          <div className="flex items-center gap-1">
            <span className="font-label-mono text-[12px] text-outline">₹</span>
            <input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-24 bg-surface-container-low border border-outline-variant px-2 py-1.5 text-on-surface font-label-mono text-[12px] outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="font-label-mono text-[10px] uppercase tracking-widest text-error">{error}</div>
      )}
      {justAdded && !error && (
        <div className="font-label-mono text-[10px] uppercase tracking-widest text-primary">
          ₹{justAdded.toLocaleString("en-IN")} added successfully
        </div>
      )}

      <Button
        size="sm"
        variant="primary"
        onClick={handleAddMoney}
        disabled={status !== "idle"}
      >
        {status === "loading" ? "Opening Razorpay..." : status === "processing" ? "Confirming..." : "Add Money"}
      </Button>

      <div className="font-label-mono text-[9px] text-outline/70 uppercase tracking-widest">
        Secured by Razorpay
      </div>
    </div>
  );
};

export default WalletCard;