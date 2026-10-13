import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import customerRoutes from './routes/customers.js';
import orderRoutes from './routes/orders.js';
import workflowRoutes from './routes/workflows.js';
import communicationRoutes from './routes/communications.js';
import woocommerceRoutes from './routes/woocommerce.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/communications', communicationRoutes);
app.use('/api/woocommerce', woocommerceRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'WooCRM Nexus API Engine',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 WooCRM Nexus Backend server listening on port ${PORT}`);
  console.log(`📡 WooCommerce Webhook endpoint active at http://localhost:${PORT}/api/woocommerce/webhook-receiver`);
});
