import express from 'express';
import { store } from '../data/store.js';

const router = express.Router();

// GET all communication logs
router.get('/', (req, res) => {
  try {
    let comms = store.getCommunications();
    const { channel, customerId, orderId, search } = req.query;

    if (channel && channel !== 'all') {
      comms = comms.filter(c => c.channel === channel);
    }

    if (customerId) {
      comms = comms.filter(c => String(c.customer_id) === String(customerId));
    }

    if (orderId) {
      comms = comms.filter(c => String(c.order_id) === String(orderId));
    }

    if (search) {
      const q = search.toLowerCase();
      comms = comms.filter(c =>
        (c.customer_name && c.customer_name.toLowerCase().includes(q)) ||
        (c.subject && c.subject.toLowerCase().includes(q)) ||
        (c.content && c.content.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, count: comms.length, data: comms });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST send communication (Email, SMS, or Merchant Note)
router.post('/send', (req, res) => {
  try {
    const { customer_id, channel, subject, content, order_id } = req.body;

    if (!customer_id || !content) {
      return res.status(400).json({ success: false, message: 'Customer ID and message content are required.' });
    }

    const customer = store.getCustomerById(customer_id);
    const customer_name = customer ? `${customer.first_name} ${customer.last_name}` : 'Customer';

    const newComm = store.addCommunication({
      customer_id,
      customer_name,
      channel: channel || 'email',
      type: 'manual',
      subject: subject || (channel === 'sms' ? 'SMS Update' : 'Customer Service Note'),
      content,
      status: channel === 'note' ? 'Saved' : 'Delivered',
      order_id: order_id || null
    });

    res.status(201).json({ success: true, data: newComm });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST generate AI draft for communication
router.post('/ai-draft', (req, res) => {
  try {
    const { tone, goal, customerId, orderId, customPrompt } = req.body;

    const customer = customerId ? store.getCustomerById(customerId) : null;
    const order = orderId ? store.getOrderById(orderId) : null;

    const customerName = customer ? customer.first_name : 'Customer';
    const storeSettings = store.getSettings();
    const brandName = storeSettings.storeName || 'Velvet & Oak';

    let subject = '';
    let body = '';

    if (goal === 'shipping_delay') {
      subject = `Update regarding your order #${order?.order_number || order?.id || ''} from ${brandName}`;
      body = `Dear ${customerName},\n\nWe wanted to reach out personally to let you know that your recent order #${order?.order_number || order?.id || ''} is experiencing a slight fulfillment delay due to exceptional demand.\n\nOur team is currently preparing your package with utmost care, and we expect it to dispatch shortly. We sincerely appreciate your patience and understanding.\n\nAs a token of our appreciation, please use code THANKYOU10 for 10% off your next purchase.\n\nWarm regards,\nThe ${brandName} Concierge Team`;
    } else if (goal === 'vip_appreciation') {
      subject = `A special VIP privilege for you, ${customerName} ✨`;
      body = `Hi ${customerName},\n\nWe noticed you've been one of our most valued patrons! To thank you for choosing ${brandName}, our team has unlocked complimentary priority shipping and private access to our upcoming seasonal collection.\n\nFeel free to reply directly to this message anytime you need assistance or personal styling advice.\n\nWith gratitude,\nFounder & Team at ${brandName}`;
    } else if (goal === 'win_back') {
      subject = `We miss having you around, ${customerName}! Here's a treat 🎁`;
      body = `Hi ${customerName},\n\nIt's been a little while since your last visit, and we've added exciting new pieces to our catalog that we think you'll love!\n\nTake $25 off your next order of $100 or more with promo code: RECONNECT25 at checkout.\n\nWe hope to see you soon!\nThe ${brandName} Team`;
    } else if (goal === 'review_request') {
      subject = `How do you like your items, ${customerName}? 🌟`;
      body = `Hi ${customerName},\n\nWe hope you are thoroughly enjoying your recent order #${order?.order_number || order?.id || ''}.\n\nYour feedback means the world to our small artisan team. If you have 60 seconds, would you mind sharing your review on our store? We read every single comment!\n\nBest,\nCustomer Experience at ${brandName}`;
    } else {
      subject = `A note regarding your order #${order?.order_number || order?.id || ''} from ${brandName}`;
      body = `Hello ${customerName},\n\n${customPrompt || 'Thank you for choosing Velvet & Oak. We are dedicated to ensuring your complete satisfaction with every purchase.'}\n\nPlease don't hesitate to reach out if you have any questions.\n\nWarmly,\n${brandName} Support`;
    }

    res.json({
      success: true,
      draft: {
        subject,
        body,
        tone: tone || 'warm_concierge',
        recipient: customer ? `${customer.first_name} ${customer.last_name} (${customer.email})` : 'Recipient'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
