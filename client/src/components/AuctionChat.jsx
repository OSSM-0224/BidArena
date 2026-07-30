import { useState } from "react";

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit" });
}

const AuctionChat = ({ messages = [], onSend, currentUserId }) => {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState(null);

  const handleSend = () => {
    // Isolated from the auction engine on purpose (FR-17): if this throws,
    // it only affects the chat panel, never the bid/timer state above it.
    try {
      if (!draft.trim()) return;
      onSend(draft);
      setDraft("");
      setError(null);
    } catch {
      setError("Message didn't send. Try again.");
    }
  };

  return (
    <div className="terminal-glass tech-border tech-border-tl tech-border-br p-5 flex flex-col gap-3 h-full">
      <div className="font-label-mono text-[10px] uppercase tracking-widest text-outline flex items-center gap-1">
        <span className="material-symbols-outlined text-[14px]">forum</span>
        Room Chat
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 max-h-[260px] pr-1">
        {messages.map((m) => (
          <div key={m.id} className="text-[12px]">
            <span className={m.userId === currentUserId ? "text-primary" : "text-secondary"}>
              {m.userName}
            </span>
            <span className="font-label-mono text-[9px] text-outline ml-2">{formatTime(m.ts)}</span>
            <div className="text-on-surface-variant">{m.message}</div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="font-label-mono text-[10px] text-outline uppercase tracking-widest">
            No messages yet
          </div>
        )}
      </div>
      {error && (
        <div className="font-label-mono text-[9px] uppercase tracking-widest text-error">{error}</div>
      )}
      <div className="flex items-center gap-2 border-t border-outline-variant pt-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Say something..."
          maxLength={500}
          className="flex-1 bg-surface-container-low border border-outline-variant px-3 py-2 text-on-surface text-[12px] outline-none focus:border-primary"
        />
        <button
          onClick={handleSend}
          className="w-9 h-9 flex items-center justify-center bg-secondary text-on-secondary shrink-0"
          aria-label="Send message"
        >
          <span className="material-symbols-outlined text-[18px]">send</span>
        </button>
      </div>
    </div>
  );
};

export default AuctionChat;