import express from 'express';
import { store } from '../data/store.js';
import { WooCommerceService } from '../services/woocommerceService.js';

const router = express.Router();

// GET store settings
router.get('/settings', (req, res) => {
  try {
    const settings = store.getSettings();
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST update settings
router.post('/settings', (req, res) => {
  try {
    const updated = store.updateSettings(req.body);
    res.json({ success: true, settings: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST test connection to WooCommerce
router.post('/test-connection', async (req, res) => {
  try {
    const { storeUrl, consumerKey, consumerSecret } = req.body;
    const result = await WooCommerceService.testConnection({ storeUrl, consumerKey, consumerSecret });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST sync data
router.post('/sync', async (req, res) => {
  try {
    const result = await WooCommerceService.syncLiveData();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST simulate incoming webhook event (ideal for hackathon demo!)
router.post('/simulate-webhook', async (req, res) => {
  try {
    const { eventType, customData } = req.body;
    const result = await WooCommerceService.simulateWebhookEvent(eventType || 'order.created', customData);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST reset demo store
router.post('/reset-demo', (req, res) => {
  try {
    store.resetToSeed();
    res.json({ success: true, message: 'Demo store state reset to initial seed data.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST live webhook endpoint receiver (for real WooCommerce webhooks)
router.post('/webhook-receiver', async (req, res) => {
  try {
    const event = req.headers['x-wc-webhook-topic'] || 'order.created';
    const payload = req.body;
    console.log(`[WooCommerce Webhook] Received topic: ${event}`);

    // If order created or updated, process into store
    if (event.includes('order.created') && payload?.id) {
      const order = store.addOrder({
        id: payload.id,
        order_number: payload.number || `WC-${payload.id}`,
        status: payload.status || 'processing',
        total: parseFloat(payload.total || 0),
        customer_id: payload.customer_id,
        customer_name: `${payload.billing?.first_name || ''} ${payload.billing?.last_name || ''}`.trim() || 'Guest Customer',
        customer_email: payload.billing?.email,
        line_items: payload.line_items || []
      });

      res.json({ success: true, orderId: order.id });
      return;
    }

    res.json({ success: true, message: 'Webhook received' });
  } catch (err) {
    console.error('Webhook processing error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
