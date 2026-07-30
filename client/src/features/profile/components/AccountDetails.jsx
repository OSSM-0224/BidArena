import Badge from "@/components/Badge";

const KYC_CONFIG = {
  verified: { label: "Verified", tone: "primary" },
  pending: { label: "Pending", tone: "secondary" },
  unverified: { label: "Unverified", tone: "error" },
};

const Row = ({ icon, label, value, right }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-outline-variant/30 last:border-b-0">
    <div className="flex items-center gap-2 text-on-surface-variant text-[13px]">
      <span className="material-symbols-outlined text-outline text-[16px]">{icon}</span>
      {label}
    </div>
    {right ?? <span className="text-on-surface text-[13px]">{value}</span>}
  </div>
);

const AccountDetails = ({ email, phone, kycStatus }) => {
  const kyc = KYC_CONFIG[kycStatus] ?? KYC_CONFIG.unverified;
  return (
    <div className="terminal-glass tech-border tech-border-tl tech-border-br p-5">
      <div className="font-label-mono text-[10px] uppercase tracking-widest text-outline mb-2 flex items-center gap-1">
        <span className="material-symbols-outlined text-[14px]">badge</span>
        Account Details
      </div>
      <Row icon="mail" label="Email" value={email} />
      <Row icon="call" label="Phone" value={phone} />
      <Row icon="verified_user" label="KYC Status" right={<Badge tone={kyc.tone}>{kyc.label}</Badge>} />
    </div>
  );
};

export default AccountDetails;