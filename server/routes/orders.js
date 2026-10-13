import express from 'express';
import { store } from '../data/store.js';
import { WorkflowEngine } from '../services/workflowEngine.js';

const router = express.Router();

// GET all orders
router.get('/', (req, res) => {
  try {
    let orders = store.getOrders();
    const { status, search, customerId } = req.query;

    if (status && status !== 'all') {
      orders = orders.filter(o => o.status.toLowerCase() === status.toLowerCase());
    }

    if (customerId) {
      orders = orders.filter(o => String(o.customer_id) === String(customerId));
    }

    if (search) {
      const q = search.toLowerCase();
      orders = orders.filter(o =>
        String(o.id).includes(q) ||
        (o.order_number && o.order_number.toLowerCase().includes(q)) ||
        (o.customer_name && o.customer_name.toLowerCase().includes(q)) ||
        (o.customer_email && o.customer_email.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET order by id
router.get('/:id', (req, res) => {
  try {
    const order = store.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    const customer = order.customer_id ? store.getCustomerById(order.customer_id) : null;
    res.json({ success: true, data: { ...order, customer } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create order
router.post('/', async (req, res) => {
  try {
    const newOrder = store.addOrder(req.body);
    const customer = newOrder.customer_id ? store.getCustomerById(newOrder.customer_id) : null;

    // Trigger workflow
    const workflows = await WorkflowEngine.triggerEvent('order.created', {
      order: newOrder,
      customer
    });

    res.status(201).json({ success: true, data: newOrder, workflowsTriggered: workflows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, note } = req.body;
    if (!status) return res.status(400).json({ success: false, message: 'Status is required' });

    const updated = store.updateOrderStatus(req.params.id, status, note);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const customer = updated.customer_id ? store.getCustomerById(updated.customer_id) : null;

    // Trigger workflow engine on status changed
    const workflows = await WorkflowEngine.triggerEvent('order.status_changed', {
      order: updated,
      customer,
      status
    });

    res.json({ success: true, data: updated, workflowsTriggered: workflows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH update tracking info
router.patch('/:id/tracking', async (req, res) => {
  try {
    const { carrier, tracking_number, estimated_delivery, url } = req.body;
    if (!tracking_number) {
      return res.status(400).json({ success: false, message: 'Tracking number is required' });
    }

    const cleanCarrier = carrier || 'Standard Express';
    const cleanUrl = url || `https://track.example.com?carrier=${cleanCarrier}&num=${tracking_number}`;

    const updated = store.updateOrderTracking(req.params.id, {
      carrier: cleanCarrier,
      tracking_number,
      estimated_delivery,
      url: cleanUrl
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
