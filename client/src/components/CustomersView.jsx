import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  DollarSign, 
  ShoppingBag, 
  Tag, 
  MessageSquare, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

export default function CustomersView({ 
  customers, 
  onSelectCustomer, 
  onCreateCustomer,
  onOpenMessageComposer 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    segment: 'New'
  });

  const segments = ['All', 'VIP', 'High Spender', 'New', 'At-Risk'];

  // Filter logic
  const filteredCustomers = customers.filter(c => {
    const fullName = `${c.first_name} ${c.last_name}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone && c.phone.includes(searchTerm));

    const matchesSegment = selectedSegment === 'All' || c.segment === selectedSegment;

    return matchesSearch && matchesSegment;
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newCustomer.first_name || !newCustomer.email) return;
    onCreateCustomer(newCustomer);
    setShowCreateModal(false);
    setNewCustomer({ first_name: '', last_name: '', email: '', phone: '', segment: 'New' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Customer Intelligence & 360° Directory</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
              {customers.length} Profiles
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Enriched customer lifetime intelligence, RFM behavioral scoring, and interaction logs.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Customer Profile</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl glass-panel flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or telephone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-900/80 border border-slate-700/80 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Segment Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar">
          <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Segment:</span>
          {segments.map((seg) => {
            const isSelected = selectedSegment === seg;
            return (
              <button
                key={seg}
                onClick={() => setSelectedSegment(seg)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-950 font-semibold'
                    : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {seg}
              </button>
            );
          })}
        </div>
      </div>

      {/* Customer Cards Grid / Directory */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((cust) => {
          const isVip = cust.segment === 'VIP';
          const isAtRisk = cust.segment === 'At-Risk';
          const isHighSpender = cust.segment === 'High Spender';

          return (
            <div
              key={cust.id}
              className="p-5 rounded-2xl glass-card hover:border-indigo-500/40 transition-all group flex flex-col justify-between"
            >
              <div>
                {/* Header: Avatar, Name & Segment Badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={cust.avatar || `https://ui-avatars.com/api/?name=${cust.first_name}+${cust.last_name}&background=6366f1&color=fff`}
                      alt={cust.first_name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-md group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <h3 className="font-semibold text-white text-base leading-tight group-hover:text-indigo-300 transition-colors">
                        {cust.first_name} {cust.last_name}
                      </h3>
                      <div className="text-xs text-slate-400 truncate max-w-[170px] mt-0.5">
                        {cust.email}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                      isVip
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : isAtRisk
                        ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                        : isHighSpender
                        ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                        : 'bg-slate-700/40 text-slate-300 border-slate-600/40'
                    }`}
                  >
                    {cust.segment}
                  </span>
                </div>

                {/* RFM Label & Spend Metrics */}
                <div className="grid grid-cols-2 gap-2 my-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Total Spent</span>
                    <span className="text-sm font-bold text-slate-100">
                      ${Number(cust.total_spent || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Orders</span>
                    <span className="text-sm font-bold text-slate-100">
                      {cust.orders_count || 0} orders
                    </span>
                  </div>
                </div>

                {/* Tags */}
                {cust.tags && cust.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {cust.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-2">
                <button
                  onClick={() => onOpenMessageComposer(cust)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-400 font-medium transition-colors cursor-pointer"
                  title="Send Direct Message"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Message</span>
                </button>

                <button
                  onClick={() => onSelectCustomer(cust)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 transition-all cursor-pointer"
                >
                  <span>360° Profile</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-16 p-8 rounded-2xl glass-panel">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-300 mb-1">No customer profiles found</h3>
          <p className="text-sm text-slate-500 mb-4">Try clearing your search query or selecting a different segment.</p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedSegment('All'); }}
            className="px-4 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Create Customer Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full rounded-2xl glass-dropdown p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-2">Create Customer Profile</h3>
            <p className="text-xs text-slate-400 mb-4">Add a new customer to the WooCommerce CRM database.</p>
            
            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">First Name *</label>
                  <input
                    type="text"
                    required
                    value={newCustomer.first_name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, first_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Liam"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Last Name</label>
                  <input
                    type="text"
                    value={newCustomer.last_name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, last_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Vance"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="liam.vance@example.com"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Phone Number</label>
                <input
                  type="text"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Segment</label>
                <select
                  value={newCustomer.segment}
                  onChange={(e) => setNewCustomer({ ...newCustomer, segment: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="New">New Buyer</option>
                  <option value="VIP">VIP</option>
                  <option value="High Spender">High Spender</option>
                  <option value="At-Risk">At-Risk</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-950"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
