import React, { useState } from 'react';
import { 
  Settings, 
  Key, 
  Globe, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  RefreshCw, 
  RotateCcw, 
  Copy, 
  Check, 
  Sparkles,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SettingsView({ 
  settings, 
  onUpdateSettings, 
  onTestConnection, 
  onSimulateWebhook, 
  onResetDemo 
}) {
  const [formData, setFormData] = useState({
    mode: settings?.mode || 'demo',
    storeName: settings?.storeName || 'Velvet & Oak Luxury Goods',
    storeUrl: settings?.storeUrl || '',
    consumerKey: settings?.consumerKey || '',
    consumerSecret: settings?.consumerSecret || '',
    currency: settings?.currency || 'USD'
  });

  const [testStatus, setTestStatus] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  const webhookEndpoint = `${window.location.protocol}//${window.location.hostname}:5000/api/woocommerce/webhook-receiver`;

  const handleTest = async () => {
    setIsTesting(true);
    setTestStatus(null);
    try {
      const res = await onTestConnection({
        storeUrl: formData.storeUrl,
        consumerKey: formData.consumerKey,
        consumerSecret: formData.consumerSecret
      });
      setTestStatus(res);
      if (res.success) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdateSettings(formData);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookEndpoint);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">WooCommerce Integration Engine</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
              Dual-Engine Architecture
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Connect live WooCommerce stores via REST API v3 or operate using the built-in demo simulator.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: WooCommerce API Settings (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSave} className="p-6 rounded-2xl glass-panel space-y-5 border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Store Connection Settings</h3>
              
              {/* Mode Toggle */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, mode: 'demo' })}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    formData.mode === 'demo'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Demo Simulator
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, mode: 'live' })}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    formData.mode === 'live'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Live WooCommerce
                </button>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Store Brand Name</label>
                <input
                  type="text"
                  required
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Store URL (with HTTPS)</label>
                <input
                  type="url"
                  placeholder="https://yourstore.com"
                  value={formData.storeUrl}
                  onChange={(e) => setFormData({ ...formData, storeUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Consumer Key (ck_...)</label>
                  <input
                    type="text"
                    placeholder="ck_xxxxxxxxxxxxxxxxxxxxxx"
                    value={formData.consumerKey}
                    onChange={(e) => setFormData({ ...formData, consumerKey: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Consumer Secret (cs_...)</label>
                  <input
                    type="password"
                    placeholder="cs_xxxxxxxxxxxxxxxxxxxxxx"
                    value={formData.consumerSecret}
                    onChange={(e) => setFormData({ ...formData, consumerSecret: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Test Status Banner */}
            {testStatus && (
              <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                testStatus.success 
                  ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200' 
                  : 'bg-rose-950/80 border-rose-500/40 text-rose-200'
              }`}>
                {testStatus.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold">{testStatus.success ? 'Connection Validated' : 'Connection Failed'}</div>
                  <div className="text-[11px] opacity-90 mt-0.5">{testStatus.message}</div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleTest}
                disabled={isTesting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              >
                <Key className="w-3.5 h-3.5 text-indigo-400" />
                <span>{isTesting ? 'Testing...' : 'Test API Credentials'}</span>
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-950 transition-all cursor-pointer"
              >
                {isSaving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>

          {/* Webhook Endpoint Box */}
          <div className="p-6 rounded-2xl glass-panel space-y-3 border border-slate-800">
            <h4 className="font-bold text-white text-sm">Live Webhook Receiver Endpoint</h4>
            <p className="text-xs text-slate-400">
              Configure this webhook URL inside WordPress (WooCommerce &gt; Settings &gt; Advanced &gt; Webhooks) for real-time push synchronization:
            </p>

            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-indigo-300">
              <span className="truncate flex-1">{webhookEndpoint}</span>
              <button
                onClick={handleCopyWebhook}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Copy URL"
              >
                {copiedWebhook ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Hackathon Webhook Simulator & Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Live Hackathon Simulator Box */}
          <div className="p-6 rounded-2xl glass-panel space-y-4 border border-indigo-500/40 relative overflow-hidden">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Zap className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Interactive Webhook Simulator</h3>
                <div className="text-[11px] text-slate-400">Demonstrate instant live event reactions to judges</div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Click any button below to trigger real-time simulated WooCommerce events. Watch how WooCRM Nexus processes the event, updates the dashboard, and executes matching automation workflows live!
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => onSimulateWebhook('order.created')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-indigo-600/20 border border-slate-700 hover:border-indigo-500/40 text-left transition-all group cursor-pointer"
              >
                <div>
                  <div className="font-semibold text-xs text-white group-hover:text-indigo-300">
                    🛍️ Simulate New Customer Order
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Fires 'order.created' ➔ Triggers VIP Welcome Workflow
                  </div>
                </div>
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              </button>

              <button
                onClick={() => onSimulateWebhook('order.shipped')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-amber-600/20 border border-slate-700 hover:border-amber-500/40 text-left transition-all group cursor-pointer"
              >
                <div>
                  <div className="font-semibold text-xs text-white group-hover:text-amber-300">
                    🚚 Simulate Order Shipped
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Generates carrier tracking # ➔ Dispatches SMS/Email
                  </div>
                </div>
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              </button>

              <button
                onClick={() => onSimulateWebhook('order.delivered')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-purple-600/20 border border-slate-700 hover:border-purple-500/40 text-left transition-all group cursor-pointer"
              >
                <div>
                  <div className="font-semibold text-xs text-white group-hover:text-purple-300">
                    ✨ Simulate Order Delivered
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Marks completed ➔ Dispatches Review Request Email
                  </div>
                </div>
                <Sparkles className="w-4 h-4 text-purple-300 shrink-0" />
              </button>
            </div>
          </div>

          {/* Reset Demo Store Box */}
          <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-400" />
              Reset Benchmark Demo Data
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Restores the CRM store database back to the clean benchmark seed data (5 customer profiles, 4 sample orders, 4 pre-built workflows).
            </p>

            <button
              onClick={onResetDemo}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-rose-950/60 hover:bg-rose-900 text-rose-200 border border-rose-800/60 transition-colors cursor-pointer"
            >
              Reset Store State
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
