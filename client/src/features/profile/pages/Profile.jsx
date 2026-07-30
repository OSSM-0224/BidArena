import { useState } from "react";
import { getProfile } from "@/features/profile/lib/profileSeed";
import ProfileHeader from "../components/ProfileHeader";
import StatsSummary from "../components/statsSummary";
import BidHistoryList from "../components/BidHistory";
import WalletCard from "../components/WalletCard";
import AccountDetails from "../components/AccountDetails";


// TODO: pull from real auth/session context instead of a hardcoded id.
const CURRENT_USER_ID = "u_flash_01";

const Profile = () => {
  const [profile] = useState(() => getProfile(CURRENT_USER_ID));
  const [balance, setBalance] = useState(profile.wallet.balance);

  const user = { userId: profile.userId, userName: profile.name };

  return (
    <div className="space-y-8">
      <ProfileHeader
        name={profile.name}
        handle={profile.handle}
        verified={profile.verified}
        memberSince={profile.memberSince}
      />

      <StatsSummary {...profile.stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <BidHistoryList bids={profile.bidHistory} />
        </div>
        <div className="space-y-5">
          <WalletCard user={user} balance={balance} onBalanceChange={setBalance} />
          <AccountDetails email={profile.email} phone={profile.phone} kycStatus={profile.kycStatus} />
        </div>
      </div>
    </div>
  );
};

export default Profile;