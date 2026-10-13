import axios from 'axios';
import { store } from '../data/store.js';
import { WorkflowEngine } from './workflowEngine.js';

export class WooCommerceService {
  /**
   * Test live WooCommerce connection
   */
  static async testConnection({ storeUrl, consumerKey, consumerSecret }) {
    if (!storeUrl || !consumerKey || !consumerSecret) {
      return { success: false, message: 'Store URL, Consumer Key, and Consumer Secret are required.' };
    }

    try {
      const cleanUrl = storeUrl.replace(/\/+$/, '');
      const testEndpoint = `${cleanUrl}/wp-json/wc/v3/system_status`;

      // WooCommerce Basic Auth over HTTPS
      const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
      const response = await axios.get(testEndpoint, {
        headers: {
          Authorization: `Basic ${auth}`,
          'User-Agent': 'WooCRM-Nexus/1.0'
        },
        timeout: 8000
      });

      if (response.status === 200) {
        return {
          success: true,
          message: 'Connection successfully established with WooCommerce REST API v3!',
          storeInfo: {
            environment: response.data.environment?.version || 'Live WooCommerce',
            currency: response.data.settings?.currency || 'USD'
          }
        };
      } else {
        return { success: false, message: `Unexpected status code: ${response.status}` };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to connect to WooCommerce store. Please check URL and API keys.'
      };
    }
  }

  /**
   * Sync Live Store Data
   */
  static async syncLiveData() {
    const settings = store.getSettings();
    if (settings.mode !== 'live' || !settings.storeUrl || !settings.consumerKey) {
      // In demo mode or unconfigured, we do a quick local refresh and update timestamp
      const updated = store.updateSettings({
        lastSyncedAt: new Date().toISOString(),
        syncStatus: 'connected'
      });
      return {
        success: true,
        mode: 'demo',
        synced: { customers: store.getCustomers().length, orders: store.getOrders().length }
      };
    }

    try {
      const cleanUrl = settings.storeUrl.replace(/\/+$/, '');
      const auth = Buffer.from(`${settings.consumerKey}:${settings.consumerSecret}`).toString('base64');
      const headers = { Authorization: `Basic ${auth}`, 'User-Agent': 'WooCRM-Nexus/1.0' };

      // Fetch customers from live WooCommerce
      const custRes = await axios.get(`${cleanUrl}/wp-json/wc/v3/customers?per_page=20`, { headers, timeout: 10000 });
      let liveCustomers = custRes.data;

      // Fetch orders from live WooCommerce
      const orderRes = await axios.get(`${cleanUrl}/wp-json/wc/v3/orders?per_page=20`, { headers, timeout: 10000 });
      let liveOrders = orderRes.data;

      store.updateSettings({
        lastSyncedAt: new Date().toISOString(),
        syncStatus: 'connected'
      });

      return {
        success: true,
        mode: 'live',
        synced: { customers: liveCustomers.length, orders: liveOrders.length }
      };
    } catch (err) {
      store.updateSettings({ syncStatus: 'error' });
      throw new Error(`Live sync error: ${err.message}`);
    }
  }

  /**
   * Simulate a WooCommerce Webhook event (For live testing & hackathon demonstration)
   */
  static async simulateWebhookEvent(eventType, customData = {}) {
    if (eventType === 'order.created') {
      const customers = store.getCustomers();
      const customer = customData.customer || customers[Math.floor(Math.random() * customers.length)];
      
      const sampleItems = [
        { name: 'Cashmere Knit Beanie', price: 65.00, sku: 'CKB-NVY', image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=150&auto=format&fit=crop&q=80' },
        { name: 'Leather Minimalist Cardholder', price: 55.00, sku: 'LMC-BRN', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=150&auto=format&fit=crop&q=80' },
        { name: 'Italian Silk Pocket Square', price: 45.00, sku: 'SPS-RED', image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=150&auto=format&fit=crop&q=80' },
        { name: 'Heritage Oxford Shirt', price: 140.00, sku: 'HOS-WHT', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=150&auto=format&fit=crop&q=80' },
        { name: 'Merino Wool Overcoat', price: 380.00, sku: 'MWO-BLK', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=150&auto=format&fit=crop&q=80' }
      ];

      const selectedItem = sampleItems[Math.floor(Math.random() * sampleItems.length)];
      const qty = customData.quantity || 1;
      const subtotal = selectedItem.price * qty;
      const total = Number((subtotal + 10.00 + (subtotal * 0.08)).toFixed(2));

      const newOrder = store.addOrder({
        customer_id: customer.id,
        customer_name: `${customer.first_name} ${customer.last_name}`,
        customer_email: customer.email,
        status: 'processing',
        fulfillment_step: 2,
        currency: 'USD',
        subtotal,
        shipping_total: 10.00,
        tax_total: Number((subtotal * 0.08).toFixed(2)),
        total,
        payment_method_title: 'Credit Card (Stripe)',
        shipping_method: 'Standard Express',
        line_items: [
          {
            id: 500 + Math.floor(Math.random() * 500),
            name: selectedItem.name,
            sku: selectedItem.sku,
            price: selectedItem.price,
            quantity: qty,
            total: subtotal,
            image: selectedItem.image
          }
        ],
        tracking: null
      });

      // Fire workflow trigger!
      const workflowResults = await WorkflowEngine.triggerEvent('order.created', {
        order: newOrder,
        customer
      });

      return {
        event: 'order.created',
        order: newOrder,
        customer,
        workflowsTriggered: workflowResults
      };
    }

    if (eventType === 'order.shipped') {
      const orders = store.getOrders().filter(o => o.status === 'processing');
      const order = orders.length > 0 ? orders[0] : store.getOrders()[0];
      if (!order) return { error: 'No orders available to mark shipped' };

      const carriers = ['FedEx', 'DHL', 'UPS', 'BlueDart'];
      const carrier = carriers[Math.floor(Math.random() * carriers.length)];
      const trkNum = `${carrier.substring(0, 2).toUpperCase()}-${Math.floor(100000000 + Math.random() * 900000000)}`;

      store.updateOrderTracking(order.id, {
        carrier,
        tracking_number: trkNum,
        estimated_delivery: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString().split('T')[0],
        url: `https://track.example.com?carrier=${carrier}&num=${trkNum}`
      });

      const updatedOrder = store.updateOrderStatus(order.id, 'shipped', `Dispatched via ${carrier} from regional distribution hub.`);
      const customer = store.getCustomerById(updatedOrder.customer_id);

      const workflowResults = await WorkflowEngine.triggerEvent('order.status_changed', {
        order: updatedOrder,
        customer,
        status: 'shipped'
      });

      return {
        event: 'order.shipped',
        order: updatedOrder,
        customer,
        workflowsTriggered: workflowResults
      };
    }

    if (eventType === 'order.delivered') {
      const orders = store.getOrders().filter(o => o.status === 'shipped');
      const order = orders.length > 0 ? orders[0] : store.getOrders()[0];
      if (!order) return { error: 'No orders available to mark delivered' };

      const updatedOrder = store.updateOrderStatus(order.id, 'delivered', 'Carrier confirmed safe delivery at recipient door.');
      const customer = store.getCustomerById(updatedOrder.customer_id);

      const workflowResults = await WorkflowEngine.triggerEvent('order.status_changed', {
        order: updatedOrder,
        customer,
        status: 'delivered'
      });

      return {
        event: 'order.delivered',
        order: updatedOrder,
        customer,
        workflowsTriggered: workflowResults
      };
    }

    return { error: 'Unknown simulation event' };
  }
}
