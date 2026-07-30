import Badge from "@/components/Badge";

const ProfileHeader = ({ name, handle, verified, memberSince }) => (
  <div className="terminal-glass tech-border tech-border-tl tech-border-br p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-surface-container-low border border-outline-variant flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-primary text-[32px]">person</span>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-[24px] font-bold text-on-surface">{name}</h1>
          {verified && <Badge tone="primary">Verified</Badge>}
        </div>
        <div className="font-label-mono text-[11px] text-outline uppercase tracking-widest">
          {handle} · Member since{" "}
          {new Date(memberSince).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
        </div>
      </div>
    </div>
  </div>
);

export default ProfileHeader;