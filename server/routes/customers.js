import express from 'express';
import { store } from '../data/store.js';

const router = express.Router();

// GET all customers with search & filter
router.get('/', (req, res) => {
  try {
    let customers = store.getCustomers();
    const { search, segment, tag, sortBy } = req.query;

    if (search) {
      const q = search.toLowerCase();
      customers = customers.filter(c =>
        `${c.first_name} ${c.last_name}`.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q))
      );
    }

    if (segment && segment !== 'All') {
      customers = customers.filter(c => c.segment === segment);
    }

    if (tag) {
      customers = customers.filter(c => c.tags && c.tags.includes(tag));
    }

    if (sortBy === 'spent_desc') {
      customers.sort((a, b) => (b.total_spent || 0) - (a.total_spent || 0));
    } else if (sortBy === 'orders_desc') {
      customers.sort((a, b) => (b.orders_count || 0) - (a.orders_count || 0));
    } else if (sortBy === 'newest') {
      customers.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
    }

    res.json({ success: true, count: customers.length, data: customers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET customer stats / metrics
router.get('/stats/summary', (req, res) => {
  try {
    const customers = store.getCustomers();
    const orders = store.getOrders();

    const totalCustomers = customers.length;
    const vipCount = customers.filter(c => c.segment === 'VIP').length;
    const atRiskCount = customers.filter(c => c.segment === 'At-Risk').length;
    const newCount = customers.filter(c => c.segment === 'New').length;

    const totalRevenue = customers.reduce((sum, c) => sum + (c.total_spent || 0), 0);
    const avgLtv = totalCustomers > 0 ? (totalRevenue / totalCustomers).toFixed(2) : 0;

    res.json({
      success: true,
      stats: {
        totalCustomers,
        vipCount,
        atRiskCount,
        newCount,
        totalRevenue,
        avgLtv: Number(avgLtv),
        totalOrders: orders.length
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single customer 360 profile
router.get('/:id', (req, res) => {
  try {
    const customer = store.getCustomerById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Attach customer's orders and communications
    const customerOrders = store.getOrders().filter(o => String(o.customer_id) === String(customer.id));
    const customerComms = store.getCommunications().filter(c => String(c.customer_id) === String(customer.id));

    res.json({
      success: true,
      data: {
        ...customer,
        orders: customerOrders,
        communications: customerComms
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create customer
router.post('/', (req, res) => {
  try {
    const created = store.addCustomer(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update customer
router.put('/:id', (req, res) => {
  try {
    const updated = store.updateCustomer(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST add note
router.post('/:id/notes', (req, res) => {
  try {
    const { text, author } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'Note text is required' });
    const note = store.addCustomerNote(req.params.id, text, author || 'Admin');
    res.json({ success: true, data: note });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST add tag
router.post('/:id/tags', (req, res) => {
  try {
    const { tag } = req.body;
    if (!tag) return res.status(400).json({ success: false, message: 'Tag is required' });
    const tags = store.addCustomerTag(req.params.id, tag);
    res.json({ success: true, data: tags });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
