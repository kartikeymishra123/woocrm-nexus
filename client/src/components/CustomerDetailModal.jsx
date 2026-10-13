import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  DollarSign, 
  ShoppingBag, 
  Tag, 
  Plus, 
  MessageSquare, 
  Calendar, 
  Clock, 
  Sparkles,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Send
} from 'lucide-react';

export default function CustomerDetailModal({ 
  customer, 
  onClose, 
  onAddNote, 
  onAddTag, 
  onOpenOrder,
  onOpenMessageComposer 
}) {
  const [newNote, setNewNote] = useState('');
  const [newTag, setNewTag] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'orders', 'notes', 'comms'

  if (!customer) return null;

  const handleNoteSubmit = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddNote(customer.id, newNote);
    setNewNote('');
  };

  const handleTagSubmit = (e) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    onAddTag(customer.id, newTag.trim());
    setNewTag('');
  };

  const avgOrderVal = customer.orders_count > 0 
    ? (customer.total_spent / customer.orders_count).toFixed(2) 
    : '0.00';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="max-w-4xl w-full max-h-[92vh] flex flex-col rounded-2xl glass-dropdown border border-slate-700/80 shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-900/90 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={customer.avatar || `https://ui-avatars.com/api/?name=${customer.first_name}+${customer.last_name}&background=6366f1&color=fff`}
              alt={customer.first_name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-white">
                  {customer.first_name} {customer.last_name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {customer.segment}
                </span>
                {customer.rfm_score?.label && (
                  <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    RFM: {customer.rfm_score.label}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  {customer.email}
                </span>
                {customer.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    {customer.phone}
                  </span>
                )}
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  ID #{customer.id}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenMessageComposer(customer)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Contact</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex px-6 border-b border-slate-800 bg-slate-900/40 text-xs font-medium">
          {[
            { id: 'overview', label: 'Customer 360°' },
            { id: 'orders', label: `Order History (${customer.orders?.length || customer.orders_count || 0})` },
            { id: 'notes', label: `Staff Notes (${customer.notes?.length || 0})` },
            { id: 'comms', label: `Communications (${customer.communications?.length || 0})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-300 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body / Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Financial Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Lifetime Value</span>
                  <span className="text-lg font-bold text-emerald-400">
                    ${Number(customer.total_spent || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Total Orders</span>
                  <span className="text-lg font-bold text-white">
                    {customer.orders_count || 0}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Avg Order Value</span>
                  <span className="text-lg font-bold text-indigo-300">
                    ${avgOrderVal}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Last Active</span>
                  <span className="text-xs font-semibold text-slate-300 block truncate mt-1">
                    {new Date(customer.last_active || customer.date_created).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Tag Management */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-indigo-400" />
                    Customer Segmentation Tags
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {customer.tags && customer.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-indigo-300 border border-indigo-500/20"
                    >
                      {t}
                    </span>
                  ))}

                  <form onSubmit={handleTagSubmit} className="inline-flex items-center gap-1">
                    <input
                      type="text"
                      placeholder="+ Add tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="px-2 py-1 rounded text-xs bg-slate-950 border border-slate-700 text-white w-28 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      className="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
                    >
                      Add
                    </button>
                  </form>
                </div>
              </div>

              {/* Addresses Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Shipping */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    Shipping Address
                  </div>
                  {customer.shipping ? (
                    <div className="text-xs text-slate-400 space-y-0.5 leading-relaxed">
                      <div className="font-medium text-slate-200">{customer.shipping.first_name} {customer.shipping.last_name}</div>
                      <div>{customer.shipping.address_1}</div>
                      <div>{customer.shipping.city}, {customer.shipping.state} {customer.shipping.postcode}</div>
                      <div>{customer.shipping.country}</div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 italic">No shipping address recorded.</div>
                  )}
                </div>

                {/* Billing */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    Billing Address
                  </div>
                  {customer.billing ? (
                    <div className="text-xs text-slate-400 space-y-0.5 leading-relaxed">
                      <div className="font-medium text-slate-200">{customer.billing.first_name} {customer.billing.last_name}</div>
                      <div>{customer.billing.address_1}</div>
                      <div>{customer.billing.city}, {customer.billing.state} {customer.billing.postcode}</div>
                      <div>{customer.billing.country}</div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 italic">No billing address recorded.</div>
                  )}
                </div>
              </div>

            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-3">
              {customer.orders && customer.orders.length > 0 ? (
                customer.orders.map(order => (
                  <div
                    key={order.id}
                    onClick={() => onOpenOrder(order)}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm group-hover:text-indigo-300">
                          {order.order_number || `#${order.id}`}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          order.status === 'delivered' ? 'bg-purple-500/20 text-purple-300' :
                          order.status === 'shipped' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-indigo-500/20 text-indigo-300'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {order.line_items?.length || 1} item(s) • {new Date(order.date_created).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold text-emerald-400">
                        ${Number(order.total).toFixed(2)}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-500 text-xs">
                  No orders recorded for this customer yet.
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              {/* Note composer */}
              <form onSubmit={handleNoteSubmit} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Add Merchant / Staff Note
                </label>
                <textarea
                  rows="2"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Record customer preferences, support context, special shipping requests..."
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
                  >
                    Save Note
                  </button>
                </div>
              </form>

              {/* Notes list */}
              <div className="space-y-2.5">
                {customer.notes && customer.notes.length > 0 ? (
                  customer.notes.map(note => (
                    <div key={note.id} className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span className="font-semibold text-indigo-300">{note.author || 'Staff'}</span>
                        <span>{new Date(note.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-200 leading-relaxed">{note.text}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    No notes recorded yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'comms' && (
            <div className="space-y-3">
              {customer.communications && customer.communications.length > 0 ? (
                customer.communications.map(comm => (
                  <div key={comm.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                          {comm.channel}
                        </span>
                        <span className="font-semibold text-slate-200">{comm.subject}</span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {new Date(comm.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs whitespace-pre-wrap">{comm.content}</p>
                    <div className="text-[10px] text-emerald-400 font-medium">Status: {comm.status}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-500 text-xs">
                  No automated or manual communications logged yet.
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
