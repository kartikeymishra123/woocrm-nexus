import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  PackageSearch, 
  GitBranch, 
  MessageSquare, 
  Settings, 
  Sparkles, 
  RefreshCw, 
  Zap, 
  ChevronDown,
  ShoppingBag,
  Truck,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  settings, 
  onSimulateWebhook, 
  onSyncStore, 
  isSyncing 
}) {
  const [showSimulateMenu, setShowSimulateMenu] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers 360°', icon: Users },
    { id: 'orders', label: 'Orders & Tracking', icon: PackageSearch },
    { id: 'workflows', label: 'Workflows', icon: GitBranch },
    { id: 'communications', label: 'Communications', icon: MessageSquare },
    { id: 'settings', label: 'Store Integration', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0d1322]/85 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Store Badge */}
          <div className="flex items-center gap-4">
            <div 
              onClick={() => setCurrentTab('dashboard')} 
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg text-white tracking-tight">WooCRM</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">NEXUS</span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium truncate max-w-[160px]">
                  {settings?.storeName || 'Velvet & Oak Luxury'}
                </div>
              </div>
            </div>

            {/* Live Connection Heartbeat */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300 font-medium">
                {settings?.mode === 'live' ? 'Live Store Sync' : 'Demo Mode (Connected)'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-950'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Actions & Simulator Dropdown */}
          <div className="flex items-center gap-2.5">
            {/* Sync Now button */}
            <button
              onClick={onSyncStore}
              disabled={isSyncing}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
              title="Sync latest data with WooCommerce"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-indigo-400' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Store'}</span>
            </button>

            {/* Quick Webhook Simulator Menu */}
            <div className="relative">
              <button
                onClick={() => setShowSimulateMenu(!showSimulateMenu)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-950 transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>Simulate Webhook</span>
                <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-80" />
              </button>

              {showSimulateMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowSimulateMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 rounded-xl glass-dropdown p-1.5 z-50 text-xs">
                    <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-1">
                      Live WooCommerce Webhooks
                    </div>
                    
                    <button
                      onClick={() => {
                        setShowSimulateMenu(false);
                        onSimulateWebhook('order.created');
                      }}
                      className="w-full flex items-start gap-2.5 px-3 py-2.5 rounded-lg hover:bg-slate-800/80 text-left transition-colors group cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="font-semibold text-slate-200">Simulate New Order</div>
                        <div className="text-[11px] text-slate-400">Triggers 'order.created' & VIP workflow</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setShowSimulateMenu(false);
                        onSimulateWebhook('order.shipped');
                      }}
                      className="w-full flex items-start gap-2.5 px-3 py-2.5 rounded-lg hover:bg-slate-800/80 text-left transition-colors group cursor-pointer"
                    >
                      <Truck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="font-semibold text-slate-200">Simulate Order Shipped</div>
                        <div className="text-[11px] text-slate-400">Attaches tracking & dispatches SMS</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setShowSimulateMenu(false);
                        onSimulateWebhook('order.delivered');
                      }}
                      className="w-full flex items-start gap-2.5 px-3 py-2.5 rounded-lg hover:bg-slate-800/80 text-left transition-colors group cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="font-semibold text-slate-200">Simulate Order Delivered</div>
                        <div className="text-[11px] text-slate-400">Sends review request email</div>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-800/60 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
