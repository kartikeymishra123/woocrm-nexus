import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialSeedData } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

class DataStore {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.resetToSeed();
      }
    } catch (err) {
      console.error('Failed reading db.json, falling back to seed:', err);
      this.resetToSeed();
    }
  }

  resetToSeed() {
    this.data = JSON.parse(JSON.stringify(initialSeedData));
    this.save();
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error persisting db.json:', err);
    }
  }

  getSettings() {
    return this.data.settings;
  }

  updateSettings(newSettings) {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.save();
    return this.data.settings;
  }

  getCustomers() {
    return this.data.customers;
  }

  getCustomerById(id) {
    return this.data.customers.find(c => String(c.id) === String(id));
  }

  addCustomer(customer) {
    const newCust = {
      id: customer.id || Date.now(),
      date_created: customer.date_created || new Date().toISOString(),
      last_active: new Date().toISOString(),
      total_spent: customer.total_spent || 0,
      orders_count: customer.orders_count || 0,
      segment: customer.segment || 'New',
      tags: customer.tags || ['New'],
      rfm_score: customer.rfm_score || { recency: 5, frequency: 1, monetary: 1, label: 'New Buyer' },
      notes: customer.notes || [],
      ...customer
    };
    this.data.customers.unshift(newCust);
    this.save();
    return newCust;
  }

  updateCustomer(id, updates) {
    const index = this.data.customers.findIndex(c => String(c.id) === String(id));
    if (index === -1) return null;
    this.data.customers[index] = { ...this.data.customers[index], ...updates };
    this.save();
    return this.data.customers[index];
  }

  addCustomerNote(customerId, noteText, author = 'Merchant') {
    const cust = this.getCustomerById(customerId);
    if (!cust) return null;
    const note = {
      id: 'n_' + Date.now(),
      text: noteText,
      author,
      createdAt: new Date().toISOString()
    };
    if (!cust.notes) cust.notes = [];
    cust.notes.unshift(note);
    this.save();
    return note;
  }

  addCustomerTag(customerId, tag) {
    const cust = this.getCustomerById(customerId);
    if (!cust) return null;
    if (!cust.tags) cust.tags = [];
    if (!cust.tags.includes(tag)) {
      cust.tags.push(tag);
      this.save();
    }
    return cust.tags;
  }

  getOrders() {
    return this.data.orders;
  }

  getOrderById(id) {
    return this.data.orders.find(o => String(o.id) === String(id));
  }

  addOrder(order) {
    const newOrder = {
      id: order.id || Math.floor(3000 + Math.random() * 1000),
      order_number: order.order_number || `WC-${Math.floor(3000 + Math.random() * 1000)}`,
      date_created: order.date_created || new Date().toISOString(),
      status: order.status || 'processing',
      fulfillment_step: order.fulfillment_step ?? 1,
      total: Number(order.total || 0),
      timeline: order.timeline || [
        { time: new Date().toISOString(), event: 'Order Placed', note: 'Created via WooCommerce.' }
      ],
      ...order
    };
    this.data.orders.unshift(newOrder);

    // Update customer stats if customer exists
    if (newOrder.customer_id) {
      const cust = this.getCustomerById(newOrder.customer_id);
      if (cust) {
        cust.total_spent = Number((cust.total_spent + newOrder.total).toFixed(2));
        cust.orders_count = (cust.orders_count || 0) + 1;
        cust.last_active = new Date().toISOString();
        if (cust.total_spent > 1000 && !cust.tags.includes('VIP')) {
          cust.tags.push('VIP');
          cust.segment = 'VIP';
        }
      }
    }

    this.save();
    return newOrder;
  }

  updateOrderStatus(orderId, newStatus, note = '') {
    const order = this.getOrderById(orderId);
    if (!order) return null;

    const oldStatus = order.status;
    order.status = newStatus;

    // Map fulfillment step
    const stepMap = {
      'pending': 0,
      'processing': 2,
      'on-hold': 1,
      'shipped': 3,
      'delivered': 4,
      'completed': 4,
      'cancelled': -1
    };
    if (stepMap[newStatus] !== undefined) {
      order.fulfillment_step = stepMap[newStatus];
    }

    if (!order.timeline) order.timeline = [];
    order.timeline.push({
      time: new Date().toISOString(),
      event: `Status changed to ${newStatus.toUpperCase()}`,
      note: note || `Updated via WooCRM from ${oldStatus}.`
    });

    this.save();
    return order;
  }

  updateOrderTracking(orderId, trackingInfo) {
    const order = this.getOrderById(orderId);
    if (!order) return null;
    order.tracking = {
      ...order.tracking,
      ...trackingInfo
    };
    if (!order.timeline) order.timeline = [];
    order.timeline.push({
      time: new Date().toISOString(),
      event: 'Tracking Information Attached',
      note: `Carrier: ${trackingInfo.carrier || 'Standard'}, Tracking #: ${trackingInfo.tracking_number}`
    });
    this.save();
    return order;
  }

  getWorkflows() {
    return this.data.workflows;
  }

  getWorkflowById(id) {
    return this.data.workflows.find(w => String(w.id) === String(id));
  }

  addWorkflow(workflow) {
    const newWf = {
      id: 'wf-' + Date.now(),
      active: true,
      executions_count: 0,
      last_executed: null,
      ...workflow
    };
    this.data.workflows.unshift(newWf);
    this.save();
    return newWf;
  }

  updateWorkflow(id, updates) {
    const index = this.data.workflows.findIndex(w => String(w.id) === String(id));
    if (index === -1) return null;
    this.data.workflows[index] = { ...this.data.workflows[index], ...updates };
    this.save();
    return this.data.workflows[index];
  }

  deleteWorkflow(id) {
    this.data.workflows = this.data.workflows.filter(w => String(w.id) !== String(id));
    this.save();
    return true;
  }

  getWorkflowLogs() {
    return this.data.workflowLogs || [];
  }

  addWorkflowLog(log) {
    if (!this.data.workflowLogs) this.data.workflowLogs = [];
    const entry = {
      id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      ...log
    };
    this.data.workflowLogs.unshift(entry);
    if (this.data.workflowLogs.length > 100) this.data.workflowLogs.pop();
    this.save();
    return entry;
  }

  getCommunications() {
    return this.data.communications || [];
  }

  addCommunication(comm) {
    if (!this.data.communications) this.data.communications = [];
    const entry = {
      id: 'comm-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      status: comm.status || 'Sent',
      opened: true,
      ...comm
    };
    this.data.communications.unshift(entry);
    this.save();
    return entry;
  }
}

export const store = new DataStore();
