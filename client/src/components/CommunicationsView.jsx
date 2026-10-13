import React, { useState } from 'react';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Search, 
  Bot,
  User,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CommunicationsView({ 
  communications, 
  customers, 
  orders, 
  onSendCommunication, 
  onGenerateAIDraft,
  initialTargetCustomer,
  initialTargetOrder 
}) {
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // AI Composer state
  const [selectedCustomerId, setSelectedCustomerId] = useState(initialTargetCustomer?.id || (customers[0]?.id || ''));
  const [selectedOrderId, setSelectedOrderId] = useState(initialTargetOrder?.id || '');
  const [aiGoal, setAiGoal] = useState('shipping_delay');
  const [channelType, setChannelType] = useState('email');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Filter logs
  const filteredComms = communications.filter(c => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = 
      (c.customer_name && c.customer_name.toLowerCase().includes(q)) ||
      (c.subject && c.subject.toLowerCase().includes(q)) ||
      (c.content && c.content.toLowerCase().includes(q));

    const matchesChannel = selectedChannel === 'all' || c.channel === selectedChannel;

    return matchesSearch && matchesChannel;
  });

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const res = await onGenerateAIDraft({
        customerId: selectedCustomerId,
        orderId: selectedOrderId,
        goal: aiGoal,
        channel: channelType
      });
      if (res.draft) {
        setSubject(res.draft.subject || '');
        setBody(res.draft.body || '');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedCustomerId || !body.trim()) return;

    setIsSending(true);
    try {
      await onSendCommunication({
        customer_id: selectedCustomerId,
        order_id: selectedOrderId || null,
        channel: channelType,
        subject: channelType === 'email' ? subject || 'Notice from Merchant' : 'SMS Alert',
        content: body
      });

      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
      setSubject('');
      setBody('');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Communication Workflows & AI Hub</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/25">
              Multi-Channel Center
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Automated customer dispatches, personalized AI email & SMS drafts, and interaction history.
          </p>
        </div>
      </div>

      {/* Main Grid: AI Composer on Left, History on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: AI Communication Assistant (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-panel space-y-5 border border-indigo-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">AI Communication Composer</h3>
                <div className="text-[11px] text-slate-400">Contextual copy tailored with WooCommerce data</div>
              </div>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Goal Preset */}
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Communication Goal</label>
              <select
                value={aiGoal}
                onChange={(e) => setAiGoal(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="shipping_delay">Shipping Delay Notification (+10% Discount)</option>
                <option value="vip_appreciation">VIP Concierge Appreciation (+Exclusive Perks)</option>
                <option value="win_back">Dormant Customer Win-Back (Re-engagement $25)</option>
                <option value="review_request">Post-Purchase Review Request</option>
              </select>
            </div>

            {/* Target Customer */}
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Recipient Customer</label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.first_name} {c.last_name} ({c.email}) - {c.segment}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Order */}
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Related WooCommerce Order (Optional)</label>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">None / General Inquiry</option>
                {orders.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.order_number || `#${o.id}`} - ${o.total} ({o.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Channel Radio */}
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Channel</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'email', label: 'Email', icon: Mail },
                  { id: 'sms', label: 'SMS', icon: Phone },
                  { id: 'note', label: 'Internal Note', icon: MessageSquare }
                ].map(ch => {
                  const Icon = ch.icon;
                  const isSelected = channelType === ch.id;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setChannelType(ch.id)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{ch.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 1-Click Generate Button */}
            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-950 transition-all cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 text-amber-300 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Synthesizing with AI...' : 'Generate Contextual AI Draft'}</span>
            </button>
          </div>

          {/* Form Composer */}
          <form onSubmit={handleSendMessage} className="space-y-3 pt-3 border-t border-slate-800 text-xs">
            {channelType === 'email' && (
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Subject Line</label>
                <input
                  type="text"
                  required
                  placeholder="Subject line..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Message Content</label>
              <textarea
                rows="6"
                required
                placeholder="Draft or AI generated message..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={isSending || !body.trim()}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSending ? 'Sending...' : `Dispatch ${channelType.toUpperCase()}`}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Unified Communication Log (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Filter Bar */}
          <div className="p-4 rounded-xl glass-panel flex flex-col sm:flex-row gap-3 justify-between items-center">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1 w-full sm:w-auto">
              {['all', 'email', 'sms', 'note'].map(ch => (
                <button
                  key={ch}
                  onClick={() => setSelectedChannel(ch)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium capitalize cursor-pointer transition-all ${
                    selectedChannel === ch
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          {/* Logs List */}
          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
            {filteredComms.map((comm) => {
              const isEmail = comm.channel === 'email';
              const isSms = comm.channel === 'sms';

              return (
                <div
                  key={comm.id}
                  className="p-4 rounded-2xl glass-card border border-slate-800 hover:border-slate-700 transition-all text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isEmail ? 'bg-indigo-500/20 text-indigo-400' :
                        isSms ? 'bg-amber-500/20 text-amber-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {isEmail ? <Mail className="w-3.5 h-3.5" /> :
                         isSms ? <Phone className="w-3.5 h-3.5" /> :
                         <MessageSquare className="w-3.5 h-3.5" />}
                      </div>

                      <div>
                        <div className="font-semibold text-white">{comm.subject}</div>
                        <div className="text-[11px] text-slate-400">
                          To: <span className="text-slate-200">{comm.customer_name}</span>
                          {comm.order_id && <span className="ml-2 font-mono text-indigo-400">Order #{comm.order_id}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        {comm.status}
                      </span>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {new Date(comm.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 whitespace-pre-wrap font-sans text-[11px]">
                    {comm.content}
                  </p>
                </div>
              );
            })}

            {filteredComms.length === 0 && (
              <div className="text-center py-16 rounded-2xl glass-panel text-slate-500 text-xs">
                No communication logs found.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
