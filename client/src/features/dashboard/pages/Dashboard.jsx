import Badge from '@/components/Badge'
import Button from '@/components/Button'
import IntelLogItem from '@/components/IntelLogItem'
import OperationCard from '@/components/OperationCard'
import StatCard from '@/components/StatCard'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate()

  // Every operation button opens the same reusable room page — bidder mode
  // for actions that should let the person bid right away, spectator mode
  // for anything read-only. AuctionRoom still re-syncs against the server
  // on join either way (FR-7), so this is just about which panel opens by default.
  const openRoom = (auctionId, mode) => {
    navigate(`/dashboard/auction/${auctionId}`, { state: { initialMode: mode } })
  }

  return (
     <div className="space-y-10">
      {/* Welcome banner */}
      <div className="terminal-glass tech-border tech-border-tl tech-border-br p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-surface-container-low border border-outline-variant flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary text-[28px]">person</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-[24px] font-bold text-on-surface">Welcome back, Flash.</h1>
            <div className="flex items-center gap-2 font-label-mono text-[11px] text-outline uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              System Connected · Uptime 432:12:04
            </div>
          </div>
        </div>
 
        <div className="flex gap-4">
          <div className="text-right">
            <div className="font-label-mono text-[9px] text-outline uppercase tracking-widest">
              Current Operation
            </div>
            <div className="text-primary font-bold text-[20px]">99.8%</div>
          </div>
          <div className="text-right">
            <div className="font-label-mono text-[9px] text-outline uppercase tracking-widest">
              Network Latency
            </div>
            <div className="text-on-surface font-bold text-[20px]">14ms</div>
          </div>
        </div>
      </div>
 
      {/* Performance overview */}
      <section className="space-y-4">
        <h2 className="font-label-mono text-[12px] text-primary uppercase tracking-widest border-l-2 border-primary pl-3">
          Performance Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard label="Total Wins" value="142" icon="trophy">
            <div className="h-1 bg-surface-container-low rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: "72%" }} />
            </div>
          </StatCard>
 
          <StatCard label="Active Exposure" value="08" valueClassName="text-secondary" icon="target">
            <div className="flex gap-2">
              <Badge tone="neutral">3 Pending</Badge>
              <Badge tone="error">High Position</Badge>
            </div>
          </StatCard>
 
          <StatCard label="Global Vol (24H)" value="4.2M" icon="public">
            <div className="font-label-mono text-[10px] text-outline uppercase tracking-widest">
              Node Efficiency: 100%
            </div>
          </StatCard>
        </div>
      </section>
 
      {/* Active operations + Recent intel */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-label-mono text-[12px] text-primary uppercase tracking-widest border-l-2 border-primary pl-3">
              Active Operations
            </h2>
            <div className="flex gap-3 font-label-mono text-[10px] text-outline uppercase tracking-widest">
              <button className="hover:text-on-surface transition-colors">Priority</button>
              <span>·</span>
              <button className="hover:text-on-surface transition-colors">Expiry</button>
            </div>
          </div>
 
          <div className="space-y-4">
            <OperationCard
              id="IDX-4XX7XB"
              statusLabel="Live Auction"
              statusTone="primary"
              icon="memory"
              title="Obsidian Hardware Ledger (Ltd Ed)"
              stat1Label="Current Bid"
              stat1Value="$12,450.00"
              stat2Label="Time"
              stat2Value="00:42:12"
              stat2Tone="error"
              primaryAction="Place Bid"
              onPrimaryAction={() => openRoom("IDX-4XX7XB", "bidder")}
              secondaryAction="View Intel"
              onSecondaryAction={() => openRoom("IDX-4XX7XB", "spectator")}
            />
 
            <OperationCard
              id="IDX-3729BF"
              statusLabel="Negotiating"
              statusTone="secondary"
              icon="location_city"
              title="Neo-Kyoto Residential Tier 1"
              stat1Label="Starting Price"
              stat1Value="$85,200.00"
              stat2Label="Countdown"
              stat2Value="06:14:00"
              stat2Tone="secondary"
              primaryAction="Set Alert"
              onPrimaryAction={() => openRoom("IDX-3729BF", "spectator")}
              secondaryAction="Details"
              onSecondaryAction={() => openRoom("IDX-3729BF", "spectator")}
            />
          </div>
 
          <Button variant="secondary" size="sm" fullWidth>
            Load Older Intelligence Logs
          </Button>
        </div>
 
        <div className="space-y-4">
          <h2 className="font-label-mono text-[12px] text-primary uppercase tracking-widest border-l-2 border-primary pl-3">
            Recent Intel
          </h2>
 
          <div className="terminal-glass tech-border tech-border-tl tech-border-br p-5">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40 mb-1">
              <span className="font-label-mono text-[10px] text-outline uppercase tracking-widest">
                Live Network Log
              </span>
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            </div>
 
            <IntelLogItem
              tag="SYS"
              tone="primary"
              message="Carbon-Core CPU Extracted"
              meta="+$2,450.00 Credit"
              timestamp="11:42:0X"
            />
            <IntelLogItem
              tag="SYS"
              tone="primary"
              message="Cloud Node Counter-Bid"
              meta="Isolated by 1809_R0"
              timestamp="11:40:1X"
            />
            <IntelLogItem
              tag="ALERT"
              tone="error"
              message="Network Lag Spike Detected"
              meta="Latency: 32ms"
              timestamp="11:38:4X"
            />
            <IntelLogItem
              tag="SYS"
              tone="neutral"
              message="Encryption Key Rotated"
              timestamp="11:20:0X"
              muted
            />
 
            <div className="pt-4 text-center">
              <button className="font-label-mono text-[10px] text-primary uppercase tracking-widest hover:underline">
                Export Full Log ↓
              </button>
            </div>
          </div>
        </div>
      </section>
 
      {/* Footer */}
      <footer className="pt-6 border-t border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex gap-8 font-label-mono text-[10px] text-outline uppercase tracking-widest">
          <div>
            Security Layer
            <div className="text-primary">AES-256 Active_Node</div>
          </div>
          <div>
            Session Auth
            <div className="text-secondary">b3ce-098-294-91d80</div>
          </div>
        </div>
        <div className="font-label-mono text-[10px] text-outline/60 uppercase tracking-widest">
          © 2026 BidArena Systems. BidProtocol_ZE v3.031
        </div>
      </footer>
    </div>
  )
}

export default Dashboard