import React, { useState } from 'react';
import { 
  PackageSearch, 
  Search, 
  Filter, 
  Truck, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  ExternalLink,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export default function OrdersView({ 
  orders, 
  onSelectOrder 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const statusOptions = ['all', 'processing', 'shipped', 'delivered', 'pending'];

  const filteredOrders = orders.filter(o => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = 
      String(o.id).includes(q) ||
      (o.order_number && o.order_number.toLowerCase().includes(q)) ||
      (o.customer_name && o.customer_name.toLowerCase().includes(q)) ||
      (o.customer_email && o.customer_email.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'all' || o.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Order Tracking & Fulfillment Hub</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
              {orders.length} Orders
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Real-time WooCommerce order lifecycle, fulfillment stages, and carrier dispatch telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>WooCommerce REST Sync Active</span>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="p-4 rounded-xl glass-panel flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by order #, customer name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-900/80 border border-slate-700/80 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar">
          <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Status:</span>
          {statusOptions.map((st) => {
            const isSelected = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl glass-panel overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Order</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Fulfillment Stage</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Carrier / Tracking</th>
                <th className="py-3.5 px-4 text-right">Total Amount</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredOrders.map((order) => {
                const step = order.fulfillment_step ?? 1;
                const isDelivered = order.status === 'delivered';
                const isShipped = order.status === 'shipped';
                const isProcessing = order.status === 'processing';

                return (
                  <tr
                    key={order.id}
                    onClick={() => onSelectOrder(order)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    {/* Order ID & Date */}
                    <td className="py-4 px-4 font-medium">
                      <div className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">
                        {order.order_number || `#${order.id}`}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {new Date(order.date_created).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-200">{order.customer_name}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[160px]">{order.customer_email}</div>
                    </td>

                    {/* Visual Fulfillment Stage */}
                    <td className="py-4 px-4">
                      <div className="space-y-1.5">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          isDelivered ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                          isShipped ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          isProcessing ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                          'bg-slate-700/30 text-slate-400 border border-slate-600/30'
                        }`}>
                          {order.status}
                        </span>

                        {/* 5-step visual dot stepper */}
                        <div className="flex items-center gap-1">
                          {[0, 1, 2, 3, 4].map((s) => (
                            <div
                              key={s}
                              className={`h-1.5 rounded-full transition-all ${
                                s <= step
                                  ? isDelivered
                                    ? 'w-4 bg-purple-400'
                                    : isShipped
                                    ? 'w-4 bg-amber-400'
                                    : 'w-4 bg-indigo-400'
                                  : 'w-2 bg-slate-800'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </td>

                    {/* Items preview */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        {order.line_items?.slice(0, 2).map((item, idx) => (
                          <img
                            key={idx}
                            src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=80'}
                            alt={item.name}
                            className="w-7 h-7 rounded-md object-cover border border-slate-700"
                            title={item.name}
                          />
                        ))}
                        <span className="text-[11px] text-slate-400">
                          {order.line_items?.length || 1} item(s)
                        </span>
                      </div>
                    </td>

                    {/* Carrier / Tracking */}
                    <td className="py-4 px-4">
                      {order.tracking ? (
                        <div>
                          <div className="flex items-center gap-1 font-semibold text-slate-300">
                            <Truck className="w-3.5 h-3.5 text-amber-400" />
                            <span>{order.tracking.carrier}</span>
                          </div>
                          <div className="text-[11px] text-indigo-400 font-mono mt-0.5 truncate max-w-[140px]">
                            {order.tracking.tracking_number}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">No carrier yet</span>
                      )}
                    </td>

                    {/* Total Amount */}
                    <td className="py-4 px-4 text-right">
                      <div className="font-bold text-emerald-400 text-sm">
                        ${Number(order.total).toFixed(2)}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {order.payment_method_title || 'Credit Card'}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 group-hover:bg-indigo-600 text-slate-300 group-hover:text-white transition-all">
                        <span>Fulfill</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
