# WooCRM Nexus ⚡
> **Enterprise-Grade Customer Relationship Management & Event-Driven Automation Engine for WooCommerce**

Built for the **Kilowott Hackathon** — CRM System Integration Challenge.

---

## 🌟 Key Features

1. **Customer 360° Profile & RFM Intelligence**:
   - Enriched customer profiles with Lifetime Value (LTV), Average Order Value (AOV), and purchase frequency.
   - Dynamic **RFM Behavioral Segmentation**: Champions (VIP), Loyal, New Buyers, and At-Risk customers.
   - Merchant internal notes system with staff attribution.
   - Custom customer segmentation tags (`VIP`, `Eco-Friendly`, `Express Shipper`).

2. **Visual Order Tracking & Fulfillment Stepper**:
   - 5-Step Fulfillment Stepper: *Order Placed* ➔ *Payment Confirmed* ➔ *Processing* ➔ *Shipped* ➔ *Delivered*.
   - Carrier integration: FedEx, DHL, UPS, BlueDart with live tracking number generator and deep links.
   - Real-time status advancement that dispatches events directly to the automation engine.

3. **Autonomous Communication Workflows**:
   - Visual Drag-and-Configure rule engine: `[Trigger]` ➔ `[Condition]` ➔ `[Actions]`.
   - Variable substitution supporting dynamic tags: `{{customer.name}}`, `{{order.id}}`, `{{order.total}}`, `{{order.tracking.url}}`.
   - Pre-built automations: VIP High-Spender Welcome, Real-Time Shipping Dispatch, Post-Delivery Feedback Request, and Dormant Customer Win-Back.
   - Interactive **Test Workflow Sandbox** displaying dry-run execution traces and evaluation results.

4. **Multi-Channel Communication Center & AI Composer**:
   - Unified message inbox/outbox for Email, SMS, and Staff Notes.
   - Contextual **AI Copywriter** producing tailored messages for shipping delays (with apology coupons), VIP perks, re-engagement, and 5-star review requests.

5. **Dual-Engine WooCommerce Integration**:
   - **Live WooCommerce Store**: REST API v3 OAuth/Basic Auth connectivity with live credentials validation.
   - **Interactive Demo Store Simulator ("Velvet & Oak")**: Pre-seeded products, orders, and customer data.
   - **Interactive Webhook Simulator**: 1-click buttons to simulate live WooCommerce order placement, shipment, and delivery events on the fly.

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18+) and npm installed.

### 2. Start Backend Server (Port 5000)
```bash
cd server
npm install
npm start
```

### 3. Start Frontend Client (Port 5173)
```bash
cd client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🏗️ Architecture

- **Frontend**: React 19, Vite 8, Tailwind CSS v4, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js, Express, Axios, CORS.
- **Persistence**: File-backed atomic JSON data store (`server/data/db.json`) with seed fallback.
- **API Spec**: Documented in detail in [IMPLEMENTATION.md](IMPLEMENTATION.md).
- **Pitch Guide**: Full 3-minute hackathon demo guide in [WALKTHROUGH.md](WALKTHROUGH.md).

---

## 📄 License
MIT License
