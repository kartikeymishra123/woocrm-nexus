import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import CustomersView from './components/CustomersView';
import CustomerDetailModal from './components/CustomerDetailModal';
import OrdersView from './components/OrdersView';
import OrderDetailModal from './components/OrderDetailModal';
import WorkflowsView from './components/WorkflowsView';
import CommunicationsView from './components/CommunicationsView';
import SettingsView from './components/SettingsView';
import Toast from './components/Toast';
import { api } from './services/api';
import confetti from 'canvas-confetti';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [workflowLogs, setWorkflowLogs] = useState([]);
  const [communications, setCommunications] = useState([]);
  const [settings, setSettings] = useState(null);

  // Modals & Navigation state
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [targetMessageCustomer, setTargetMessageCustomer] = useState(null);
  const [targetMessageOrder, setTargetMessageOrder] = useState(null);

  // UX state
  const [toasts, setToasts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const addToast = (type, title, message) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const loadAllData = async () => {
    try {
      const [custRes, ordRes, wfRes, logsRes, commRes, setRes] = await Promise.all([
        api.getCustomers(),
        api.getOrders(),
        api.getWorkflows(),
        api.getWorkflowLogs(),
        api.getCommunications(),
        api.getStoreSettings(),
      ]);

      if (custRes.data) setCustomers(custRes.data);
      if (ordRes.data) setOrders(ordRes.data);
      if (wfRes.data) setWorkflows(wfRes.data);
      if (logsRes.data) setWorkflowLogs(logsRes.data);
      if (commRes.data) setCommunications(commRes.data);
      if (setRes.settings) setSettings(setRes.settings);
    } catch (err) {
      console.error('Failed loading CRM data:', err);
      addToast('error', 'Connection Error', 'Could not reach backend API server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Webhook Simulation
  const handleSimulateWebhook = async (eventType) => {
    try {
      const res = await api.simulateWebhook(eventType);
      if (res.success) {
        if (eventType === 'order.created') {
          confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
          addToast(
            'success',
            'WooCommerce Webhook Ingested!',
            `Order #${res.order?.order_number || res.order?.id} placed by ${res.order?.customer_name}. Automated workflows evaluated!`
          );
        } else if (eventType === 'order.shipped') {
          addToast(
            'success',
            'Order Shipped Event Dispatched',
            `Order #${res.order?.order_number} marked shipped via ${res.order?.tracking?.carrier}. Tracking alert sent.`
          );
        } else if (eventType === 'order.delivered') {
          addToast(
            'success',
            'Order Delivered Event Dispatched',
            `Order #${res.order?.order_number} marked delivered. Post-delivery review request fired.`
          );
        }
        await loadAllData();
      }
    } catch (err) {
      addToast('error', 'Simulation Failed', err.message);
    }
  };

  // Sync Store
  const handleSyncStore = async () => {
    setIsSyncing(true);
    try {
      const res = await api.syncData();
      addToast('success', 'Store Synchronized', `Refreshed ${res.synced?.customers || 0} customers & ${res.synced?.orders || 0} orders.`);
      await loadAllData();
    } catch (err) {
      addToast('error', 'Sync Failed', err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  // Customer Actions
  const handleSelectCustomer = async (cust) => {
    try {
      const res = await api.getCustomerById(cust.id);
      setSelectedCustomer(res.data);
    } catch {
      setSelectedCustomer(cust);
    }
  };

  const handleCreateCustomer = async (newCust) => {
    try {
      const res = await api.createCustomer(newCust);
      if (res.success) {
        addToast('success', 'Customer Created', `Profile for ${res.data.first_name} added to CRM.`);
        await loadAllData();
      }
    } catch (err) {
      addToast('error', 'Creation Failed', err.message);
    }
  };

  const handleAddCustomerNote = async (customerId, text) => {
    try {
      const res = await api.addCustomerNote(customerId, text, 'Staff Concierge');
      if (res.success) {
        addToast('success', 'Note Added', 'Staff note recorded to customer dossier.');
        // Refresh customer modal state
        const updated = await api.getCustomerById(customerId);
        setSelectedCustomer(updated.data);
        await loadAllData();
      }
    } catch (err) {
      addToast('error', 'Failed adding note', err.message);
    }
  };

  const handleAddCustomerTag = async (customerId, tag) => {
    try {
      const res = await api.addCustomerTag(customerId, tag);
      if (res.success) {
        addToast('success', 'Tag Applied', `Tag "${tag}" added to customer profile.`);
        const updated = await api.getCustomerById(customerId);
        setSelectedCustomer(updated.data);
        await loadAllData();
      }
    } catch (err) {
      addToast('error', 'Failed adding tag', err.message);
    }
  };

  // Order Actions
  const handleSelectOrder = async (order) => {
    try {
      const res = await api.getOrderById(order.id);
      setSelectedOrder(res.data);
    } catch {
      setSelectedOrder(order);
    }
  };

  const handleUpdateOrderStatus = async (orderId, status, note) => {
    try {
      const res = await api.updateOrderStatus(orderId, status, note);
      if (res.success) {
        addToast('success', 'Fulfillment Updated', `Order #${res.data.order_number || res.data.id} moved to ${status.toUpperCase()}.`);
        const updated = await api.getOrderById(orderId);
        setSelectedOrder(updated.data);
        await loadAllData();
      }
    } catch (err) {
      addToast('error', 'Status Update Failed', err.message);
    }
  };

  const handleUpdateOrderTracking = async (orderId, tracking) => {
    try {
      const res = await api.updateOrderTracking(orderId, tracking);
      if (res.success) {
        addToast('success', 'Tracking Attached', `${tracking.carrier} tracking number ${tracking.tracking_number} saved.`);
        const updated = await api.getOrderById(orderId);
        setSelectedOrder(updated.data);
        await loadAllData();
      }
    } catch (err) {
      addToast('error', 'Tracking Update Failed', err.message);
    }
  };

  // Workflow Actions
  const handleToggleWorkflow = async (workflowId, active) => {
    try {
      await api.updateWorkflow(workflowId, { active });
      addToast('info', 'Workflow Updated', `Workflow state changed to ${active ? 'Active' : 'Paused'}.`);
      await loadAllData();
    } catch (err) {
      addToast('error', 'Workflow Update Failed', err.message);
    }
  };

  const handleTestWorkflow = async (workflowId) => {
    return await api.testWorkflow(workflowId);
  };

  const handleCreateWorkflow = async (wf) => {
    try {
      const res = await api.createWorkflow(wf);
      if (res.success) {
        addToast('success', 'Workflow Created', `Automation rule "${res.data.name}" is now active!`);
        await loadAllData();
      }
    } catch (err) {
      addToast('error', 'Workflow Creation Failed', err.message);
    }
  };

  const handleDeleteWorkflow = async (workflowId) => {
    try {
      await api.deleteWorkflow(workflowId);
      addToast('info', 'Workflow Removed', 'Automation rule deleted.');
      await loadAllData();
    } catch (err) {
      addToast('error', 'Delete Failed', err.message);
    }
  };

  // Communication Actions
  const handleSendCommunication = async (commData) => {
    try {
      const res = await api.sendCommunication(commData);
      if (res.success) {
        addToast('success', 'Message Dispatched', `${commData.channel.toUpperCase()} recorded and delivered.`);
        await loadAllData();
      }
    } catch (err) {
      addToast('error', 'Failed sending message', err.message);
    }
  };

  const handleOpenMessageComposer = (customer, order = null) => {
    setTargetMessageCustomer(customer);
    setTargetMessageOrder(order);
    setSelectedCustomer(null);
    setSelectedOrder(null);
    setCurrentTab('communications');
  };

  // Settings Actions
  const handleUpdateSettings = async (newSettings) => {
    try {
      const res = await api.updateStoreSettings(newSettings);
      if (res.success) {
        addToast('success', 'Settings Saved', 'WooCommerce integration preferences updated.');
        setSettings(res.settings);
      }
    } catch (err) {
      addToast('error', 'Save Failed', err.message);
    }
  };

  const handleResetDemo = async () => {
    try {
      await api.resetDemoStore();
      addToast('info', 'Store Reset', 'State restored to clean benchmark data.');
      await loadAllData();
    } catch (err) {
      addToast('error', 'Reset Failed', err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 animate-spin flex items-center justify-center mb-4">
          <div className="w-6 h-6 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
        </div>
        <div className="text-white font-bold text-lg">Initializing WooCRM Nexus...</div>
        <div className="text-slate-500 text-xs mt-1">Connecting to WooCommerce data store</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        settings={settings}
        onSimulateWebhook={handleSimulateWebhook}
        onSyncStore={handleSyncStore}
        isSyncing={isSyncing}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'dashboard' && (
          <DashboardView
            customers={customers}
            orders={orders}
            workflows={workflows}
            communications={communications}
            settings={settings}
            setCurrentTab={setCurrentTab}
            onOpenCustomer={handleSelectCustomer}
            onOpenOrder={handleSelectOrder}
            onSimulateWebhook={handleSimulateWebhook}
          />
        )}

        {currentTab === 'customers' && (
          <CustomersView
            customers={customers}
            onSelectCustomer={handleSelectCustomer}
            onCreateCustomer={handleCreateCustomer}
            onOpenMessageComposer={handleOpenMessageComposer}
          />
        )}

        {currentTab === 'orders' && (
          <OrdersView
            orders={orders}
            onSelectOrder={handleSelectOrder}
          />
        )}

        {currentTab === 'workflows' && (
          <WorkflowsView
            workflows={workflows}
            workflowLogs={workflowLogs}
            onToggleWorkflow={handleToggleWorkflow}
            onTestWorkflow={handleTestWorkflow}
            onCreateWorkflow={handleCreateWorkflow}
            onDeleteWorkflow={handleDeleteWorkflow}
          />
        )}

        {currentTab === 'communications' && (
          <CommunicationsView
            communications={communications}
            customers={customers}
            orders={orders}
            onSendCommunication={handleSendCommunication}
            onGenerateAIDraft={api.generateAIDraft}
            initialTargetCustomer={targetMessageCustomer}
            initialTargetOrder={targetMessageOrder}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onTestConnection={api.testConnection}
            onSimulateWebhook={handleSimulateWebhook}
            onResetDemo={handleResetDemo}
          />
        )}
      </main>

      {/* Customer 360 Profile Modal */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onAddNote={handleAddCustomerNote}
          onAddTag={handleAddCustomerTag}
          onOpenOrder={(order) => {
            setSelectedCustomer(null);
            handleSelectOrder(order);
          }}
          onOpenMessageComposer={(customer) => {
            handleOpenMessageComposer(customer);
          }}
        />
      )}

      {/* Order Detail & Fulfillment Stepper Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={handleUpdateOrderStatus}
          onUpdateTracking={handleUpdateOrderTracking}
          onOpenMessageComposer={(customer, order) => {
            handleOpenMessageComposer(customer, order);
          }}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>WooCRM Nexus</strong> • Customer Relationship Management for WooCommerce
          </div>
          <div>
            Kilowott Hackathon Submission • Dual-Engine Architecture
          </div>
        </div>
      </footer>
    </div>
  );
}
