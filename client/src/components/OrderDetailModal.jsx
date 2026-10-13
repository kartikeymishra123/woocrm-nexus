import React, { useState } from 'react';
import { 
  X, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Package, 
  DollarSign, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Send,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrderDetailModal({ 
  order, 
  onClose, 
  onUpdateStatus, 
  onUpdateTracking,
  onOpenMessageComposer 
}) {
  const [selectedStatus, setSelectedStatus] = useState(order?.status || 'processing');
  const [carrier, setCarrier] = useState(order?.tracking?.carrier || 'FedEx');
  const [trackingNumber, setTrackingNumber] = useState(order?.tracking?.tracking_number || '');
  const [statusNote, setStatusNote] = useState('');
  const [showTrackingForm, setShowTrackingForm] = useState(false);

  if (!order) return null;

  const steps = [
    { step: 0, key: 'pending', label: 'Order Placed', desc: 'Received online' },
    { step: 1, key: 'paid', label: 'Payment Captured', desc: 'Funds verified' },
    { step: 2, key: 'processing', label: 'Warehouse Packing', desc: 'Preparing parcel' },
    { step: 3, key: 'shipped', label: 'Shipped (In Transit)', desc: 'Handed to carrier' },
    { step: 4, key: 'delivered', label: 'Delivered', desc: 'Received by customer' }
  ];

  const currentStep = order.fulfillment_step ?? 1;

  const handleStatusChange = (newStatus) => {
    onUpdateStatus(order.id, newStatus, statusNote || `Status updated to ${newStatus.toUpperCase()}`);
    if (newStatus === 'delivered') {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }
  };

  const handleTrackingSubmit = (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;
    onUpdateTracking(order.id, {
      carrier,
      tracking_number: trackingNumber.trim(),
      estimated_delivery: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString().split('T')[0],
      url: `https://track.example.com?carrier=${carrier}&num=${trackingNumber.trim()}`
    });
    setShowTrackingForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="max-w-4xl w-full max-h-[92vh] flex flex-col rounded-2xl glass-dropdown border border-slate-700/80 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-slate-900/90 border-b border-slate-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Order {order.order_number || `#${order.id}`}
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                order.status === 'delivered' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                order.status === 'shipped' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                order.status === 'processing' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                'bg-slate-700/30 text-slate-400'
              }`}>
                {order.status}
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Customer: <span className="font-semibold text-slate-200">{order.customer_name}</span> ({order.customer_email}) • Placed {new Date(order.date_created).toLocaleString()}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenMessageComposer({ id: order.customer_id, first_name: order.customer_name, email: order.customer_email }, order)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Contact Customer</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Visual Fulfillment Stepper */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-indigo-400" />
                Visual Fulfillment Pipeline
              </span>
              <span className="text-[11px] text-slate-500">Real-time status synchronizer</span>
            </div>

            {/* Stepper items */}
            <div className="grid grid-cols-5 gap-2 relative">
              {steps.map((st, idx) => {
                const isPassed = currentStep >= st.step;
                const isCurrent = currentStep === st.step;

                return (
                  <div key={idx} className="flex flex-col items-center text-center relative z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md ${
                      isPassed
                        ? order.status === 'delivered'
                          ? 'bg-purple-600 text-white shadow-purple-600/30'
                          : order.status === 'shipped'
                          ? 'bg-amber-500 text-white shadow-amber-500/30'
                          : 'bg-indigo-600 text-white shadow-indigo-600/30'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}>
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : st.step + 1}
                    </div>

                    <div className="font-semibold text-xs mt-2 text-slate-200">
                      {st.label}
                    </div>
                    <div className="text-[10px] text-slate-500 hidden sm:block mt-0.5">
                      {st.desc}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Interactive Status Advancement Buttons */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                Advance status to automatically trigger registered communication workflows:
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleStatusChange('processing')}
                  disabled={order.status === 'processing'}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    order.status === 'processing'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 cursor-default'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  Mark Processing
                </button>

                <button
                  onClick={() => {
                    setShowTrackingForm(true);
                    handleStatusChange('shipped');
                  }}
                  disabled={order.status === 'shipped'}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    order.status === 'shipped'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-default'
                      : 'bg-amber-600/90 hover:bg-amber-500 text-white shadow-md'
                  }`}
                >
                  🚀 Mark as Shipped (+SMS/Email)
                </button>

                <button
                  onClick={() => handleStatusChange('delivered')}
                  disabled={order.status === 'delivered'}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    order.status === 'delivered'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 cursor-default'
                      : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md'
                  }`}
                >
                  ✨ Mark as Delivered (+Review)
                </button>
              </div>
            </div>
          </div>

          {/* Carrier Tracking Box */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Truck className="w-4 h-4 text-amber-400" />
                Carrier Dispatch & Tracking
              </div>
              <button
                onClick={() => setShowTrackingForm(!showTrackingForm)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
              >
                {showTrackingForm ? 'Close Edit' : 'Edit Tracking Info'}
              </button>
            </div>

            {order.tracking ? (
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <div className="space-y-0.5">
                  <div className="text-slate-400">Carrier: <span className="font-bold text-slate-100">{order.tracking.carrier}</span></div>
                  <div className="text-slate-400">Tracking #: <span className="font-mono text-indigo-400">{order.tracking.tracking_number}</span></div>
                </div>
                {order.tracking.estimated_delivery && (
                  <div className="text-slate-400 text-[11px]">
                    Est. Delivery: <span className="font-medium text-slate-200">{order.tracking.estimated_delivery}</span>
                  </div>
                )}
                {order.tracking.url && (
                  <a
                    href={order.tracking.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 underline font-medium"
                  >
                    <span>Track on Carrier Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic">
                No carrier tracking information attached yet.
              </div>
            )}

            {showTrackingForm && (
              <form onSubmit={handleTrackingSubmit} className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs">
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="FedEx">FedEx Express</option>
                  <option value="DHL">DHL Worldwide</option>
                  <option value="UPS">UPS Air</option>
                  <option value="BlueDart">BlueDart Express</option>
                </select>

                <input
                  type="text"
                  placeholder="Tracking Number (e.g. FX-9982410)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white flex-1 min-w-[180px] focus:outline-none focus:border-indigo-500 font-mono"
                />

                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer"
                >
                  Save & Dispatch Tracking
                </button>
              </form>
            )}
          </div>

          {/* Line Items Breakdown */}
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden">
            <div className="p-3.5 bg-slate-900/80 border-b border-slate-800 text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Order Line Items</span>
              <span>{order.line_items?.length || 0} Products</span>
            </div>

            <div className="divide-y divide-slate-800/80 text-xs">
              {order.line_items?.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=80'}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-700"
                    />
                    <div>
                      <div className="font-semibold text-slate-100">{item.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">SKU: {item.sku || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-white text-sm">
                      ${Number(item.price).toFixed(2)} × {item.quantity}
                    </div>
                    <div className="text-[11px] text-emerald-400 font-medium">
                      = ${Number(item.total || item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="p-4 bg-slate-950/60 border-t border-slate-800 space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium text-slate-200">${Number(order.subtotal || order.total * 0.9).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping ({order.shipping_method || 'Standard'}):</span>
                <span className="font-medium text-slate-200">${Number(order.shipping_total || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax:</span>
                <span className="font-medium text-slate-200">${Number(order.tax_total || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold text-white">
                <span>Total Amount:</span>
                <span className="text-emerald-400">${Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Chronological Timeline */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Order Event Timeline & Audit Trail
            </div>

            <div className="space-y-3 relative pl-4 border-l border-slate-800 text-xs">
              {order.timeline && order.timeline.length > 0 ? (
                order.timeline.map((entry, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-slate-900"></span>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{entry.event}</span>
                      <span className="text-[10px] text-slate-500">{new Date(entry.time).toLocaleString()}</span>
                    </div>
                    {entry.note && (
                      <p className="text-[11px] text-slate-400 mt-0.5">{entry.note}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-slate-500 text-xs italic">No timeline entries recorded yet.</div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
