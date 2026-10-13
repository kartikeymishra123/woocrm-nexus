import React from 'react';
import { 
  DollarSign, 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  GitBranch, 
  Sparkles, 
  CheckCircle2, 
  Truck, 
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function DashboardView({ 
  customers, 
  orders, 
  workflows, 
  communications, 
  settings, 
  setCurrentTab,
  onOpenCustomer,
  onOpenOrder,
  onSimulateWebhook
}) {
  // Aggregate KPIs
  const totalRevenue = customers.reduce((sum, c) => sum + (c.total_spent || 0), 0);
  const totalOrders = orders.length;
  const activeFulfillmentOrders = orders.filter(o => o.status === 'processing' || o.status === 'shipped').length;
  const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;
  const vipCount = customers.filter(c => c.segment === 'VIP').length;

  // Recent combined activity feed
  const activityItems = [
    ...orders.map(o => ({
      type: 'order',
      title: `New Order ${o.order_number}`,
      subtitle: `${o.customer_name} placed an order for $${Number(o.total).toFixed(2)}`,
      status: o.status,
      timestamp: o.date_created,
      data: o
    })),
    ...communications.map(c => ({
      type: 'comm',
      title: `${c.channel.toUpperCase()} Dispatched`,
      subtitle: `${c.subject} to ${c.customer_name}`,
      status: c.status,
      timestamp: c.timestamp,
      data: c
    }))
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 6);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Welcome / Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl glass-panel relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-16 w-48 h-48 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />
        
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">WooCommerce Operations Center</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
              Nexus 360
            </span>
          </div>
          <p className="text-sm text-slate-400 max-w-2xl">
            Real-time customer relationship telemetry, automated communication workflows, and fulfillment intelligence for <span className="text-slate-200 font-medium">{settings?.storeName || 'WooCommerce'}</span>.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSimulateWebhook('order.created')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all hover:scale-102 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Simulate Order (+Workflow)</span>
          </button>
          <button
            onClick={() => setCurrentTab('workflows')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
          >
            <GitBranch className="w-4 h-4 text-indigo-400" />
            <span>View Automations</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl glass-card relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total LTV Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight mb-1">
            ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+19.4% vs last cycle</span>
          </div>
        </div>

        {/* Total Customers */}
        <div className="p-5 rounded-2xl glass-card relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Customer Profiles</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight mb-1">
            {customers.length}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-medium">
            <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/30 font-bold">{vipCount} VIP</span>
            <span className="text-slate-400">Champions recognized</span>
          </div>
        </div>

        {/* Orders in Pipeline */}
        <div className="p-5 rounded-2xl glass-card relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Fulfillment</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight mb-1">
            {activeFulfillmentOrders} <span className="text-xs font-normal text-slate-400">/ {totalOrders} total</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium">
            <Truck className="w-3.5 h-3.5" />
            <span>In processing & transit</span>
          </div>
        </div>

        {/* Avg Order Value */}
        <div className="p-5 rounded-2xl glass-card relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Order Value</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight mb-1">
            ${avgOrderValue}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-purple-300 font-medium">
            <span>High purchasing intent</span>
          </div>
        </div>

      </div>

      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Visual Analytics & Customer Segments */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Revenue & Growth Trend */}
          <div className="p-6 rounded-2xl glass-panel">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-white">Store Revenue Performance</h3>
                <p className="text-xs text-slate-400">Real-time synchronized transactions over recent timeline</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Live Sync
                </span>
              </div>
            </div>

            {/* Custom SVG Gradient Trend Chart */}
            <div className="h-44 w-full relative pt-4">
              <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Horizontal grid lines */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="#1e293b" strokeDasharray="4 4" />
                <line x1="0" y1="75" x2="500" y2="75" stroke="#1e293b" strokeDasharray="4 4" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="#1e293b" strokeDasharray="4 4" />

                {/* Area fill */}
                <path
                  d="M 0 130 Q 80 110, 150 90 T 270 45 T 390 60 T 500 20 L 500 150 L 0 150 Z"
                  fill="url(#revenueGrad)"
                />
                {/* Line stroke */}
                <path
                  d="M 0 130 Q 80 110, 150 90 T 270 45 T 390 60 T 500 20"
                  fill="none"
                  stroke="#818cf8"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Data Points */}
                <circle cx="150" cy="90" r="4.5" fill="#6366f1" stroke="#ffffff" strokeWidth="2" />
                <circle cx="270" cy="45" r="4.5" fill="#6366f1" stroke="#ffffff" strokeWidth="2" />
                <circle cx="390" cy="60" r="4.5" fill="#6366f1" stroke="#ffffff" strokeWidth="2" />
                <circle cx="500" cy="20" r="5" fill="#a855f7" stroke="#ffffff" strokeWidth="2" />
              </svg>

              <div className="flex justify-between text-[11px] text-slate-500 mt-2 px-1">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Today (Peak)</span>
              </div>
            </div>
          </div>

          {/* Customer RFM Segmentation Matrix */}
          <div className="p-6 rounded-2xl glass-panel">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-white">Customer RFM Segmentation Matrix</h3>
                <p className="text-xs text-slate-400">Recency, Frequency & Monetary behavioral distribution</p>
              </div>
              <button
                onClick={() => setCurrentTab('customers')}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium cursor-pointer"
              >
                <span>View All Customers</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {/* VIP / Champions */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Champions & VIP ({customers.filter(c => c.segment === 'VIP').length})
                  </span>
                  <span className="text-slate-300 font-semibold">$3,570.50 (68% of Total)</span>
                </div>
                <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>

              {/* High Spenders */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-indigo-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                    High Spenders ({customers.filter(c => c.segment === 'High Spender').length})
                  </span>
                  <span className="text-slate-300 font-semibold">$890.00 (17% of Total)</span>
                </div>
                <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: '17%' }}></div>
                </div>
              </div>

              {/* At-Risk Customers */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-rose-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                    At-Risk / Dormant ({customers.filter(c => c.segment === 'At-Risk').length})
                  </span>
                  <span className="text-slate-300 font-semibold">$640.20 (Eligible for win-back)</span>
                </div>
                <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-rose-500 h-2.5 rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Real-Time Activity Feed & Quick Actions */}
        <div className="space-y-6">
          
          {/* Live Store Feed */}
          <div className="p-6 rounded-2xl glass-panel">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                </span>
                <h3 className="text-base font-semibold text-white">Live Store Feed</h3>
              </div>
              <span className="text-[11px] text-slate-500">Real-time</span>
            </div>

            <div className="space-y-3.5">
              {activityItems.map((item, index) => {
                const isOrder = item.type === 'order';
                return (
                  <div 
                    key={index}
                    onClick={() => {
                      if (isOrder) onOpenOrder(item.data);
                    }}
                    className={`flex items-start gap-3 p-3 rounded-xl transition-all border border-transparent ${
                      isOrder ? 'hover:bg-slate-800/60 hover:border-slate-700/80 cursor-pointer' : 'bg-slate-900/40'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isOrder 
                        ? 'bg-indigo-500/15 text-indigo-400' 
                        : 'bg-purple-500/15 text-purple-400'
                    }`}>
                      {isOrder ? <ShoppingBag className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-200 truncate">{item.title}</span>
                        <span className="text-[10px] text-slate-500 shrink-0 ml-1">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Automation Execution Card */}
          <div className="p-6 rounded-2xl glass-card border-indigo-500/30 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <h4 className="text-sm font-semibold text-white">Autonomous Event Engine</h4>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              {workflows.filter(w => w.active).length} automated workflows currently listening to WooCommerce triggers.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => onSimulateWebhook('order.shipped')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/90 hover:bg-slate-800 text-xs text-slate-200 font-medium border border-slate-700 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-amber-400" />
                  Dispatch Shipping Simulation
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
              <button
                onClick={() => onSimulateWebhook('order.delivered')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/90 hover:bg-slate-800 text-xs text-slate-200 font-medium border border-slate-700 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  Dispatch Delivery Feedback
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
