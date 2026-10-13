# WooCRM Nexus: End-to-End Project Walkthrough & Judge Demo Guide

Welcome to **WooCRM Nexus** — the Customer Relationship Management (CRM) platform designed specifically for WooCommerce stores. This document provides an end-to-end walkthrough of every feature, how to run the system, and a recommended 3-minute pitch flow for hackathon judges.

---

## 1. Quick Start Guide: Running the Project

### Prerequisites
- Node.js (v18+) & npm installed.

### Step 1: Start the Backend Server (Port 5000)
Open a terminal in the root directory:
```bash
cd server
npm install
npm run dev
```
*The server starts on `http://localhost:5000` with the persistent data store initialized.*

### Step 2: Start the Frontend Client (Port 5173)
Open a second terminal in the root directory:
```bash
cd client
npm install
npm run dev
```
*The React + Vite app opens at `http://localhost:5173`.*

---

## 2. End-to-End Feature Walkthrough

### View 1: Executive Dashboard (`/`)
- **Key Metrics Strip**:
  - **Total Revenue**: Aggregated lifetime customer spending across the WooCommerce store.
  - **Active Customers & VIPs**: Customer count with VIP percentage.
  - **Orders in Fulfillment**: Real-time counter of orders currently in processing or transit.
  - **Average Order Value (AOV)**: Dynamic metric showing purchasing power.
- **Store Sync Status Badge**:
  - Displays live heartbeat pulse: `Connected (Demo Mode)` or `Connected (Live WooCommerce)`.
- **Live Activity Stream**:
  - Chronological real-time feed of WooCommerce store events (order placements, tracking attachments, workflow triggers).
- **Quick Action Bar**:
  - `Simulate Live Webhook`: Fire real-time order creation or shipping events right from the header!

---

### View 2: Customer Data Management (Customer 360°)
- **Customer Directory**:
  - Fast search by customer name, email, or telephone.
  - One-click filter pills: `All`, `VIP`, `High Spender`, `New Buyer`, `At-Risk`.
  - RFM badges indicating customer value score (Champion, Loyal, At-Risk).
- **Customer 360° Profile Modal**:
  - **Customer Identity**: Avatar, contact information, billing & shipping address.
  - **Financial Metrics**: Total spent, order frequency, average order value, last active timestamp.
  - **Tags Management**: Easily add and remove tags (`VIP`, `Repeat Buyer`, `Eco-Friendly`).
  - **Internal Merchant Notes**: Add timestamped notes attributed to staff (e.g., "Prefers gift packaging").
  - **Order History**: Drill into any previous order placed by this customer.
  - **One-Click Communication**: Launch the Email/SMS composer pre-filled with the customer's details.

---

### View 3: Order Fulfillment & Tracking Hub
- **Fulfillment Pipeline**:
  - Categorized by order status: `All`, `Processing`, `Shipped`, `Delivered`, `Pending`.
  - Displays customer name, order number, items summary, and total amount.
- **Visual Order Tracking Modal**:
  - **Interactive 5-Step Fulfillment Stepper**:
    1. *Order Placed*
    2. *Payment Confirmed*
    3. *Processing & Warehouse Packing*
    4. *Shipped & In Transit*
    5. *Delivered to Customer*
  - **Carrier & Tracking Details**:
    - Carrier selector: **FedEx**, **DHL**, **UPS**, **BlueDart**.
    - Live tracking number with one-click external tracking link.
    - Estimated delivery date.
  - **Order Item Breakdown**:
    - High-resolution product thumbnails, SKU numbers, quantities, unit prices, subtotal, shipping, and tax.
  - **Real-Time Status Advancement**:
    - Click `Mark as Shipped` or `Mark as Delivered`: this advances the visual tracker, logs the event in the order timeline, and **automatically fires registered communication workflows**!

---

### View 4: Visual Communication Workflows
- **Interactive Automation Cards**:
  - **VIP High-Spender Welcome**: Orders ≥ $200 trigger VIP tag + founder thank-you email with 15% discount code.
  - **Real-Time Shipping Tracker**: Status changed to *Shipped* sends email and SMS with carrier tracking URL.
  - **Delivery Delight & Review Request**: Status changed to *Delivered* sends review invitation and satisfaction tag.
  - **Dormant Customer Win-Back**: Reactivates customers inactive > 30 days with a $20 gift voucher.
- **Visual Workflow Builder**:
  - Shows clear node connections: `[Trigger]` ➔ `[Condition]` ➔ `[Action 1]` + `[Action 2]`.
  - Toggle workflows active/inactive with one click.
- **Interactive "Test Workflow" Sandbox**:
  - Click `Test Workflow` on any card to run an instant dry-run simulation.
  - Inspect the condition evaluation, variable interpolation (`{{customer.name}}`, `{{order.id}}`), and execution trace.
- **Workflow Execution History Logs**:
  - Audit trail displaying exact timestamps, triggered order IDs, targeted customers, and action statuses.

---

### View 5: Communication Center & AI Composer
- **Multi-Channel Message Inbox/Outbox**:
  - Filter by channel: `All`, `Email`, `SMS`, `Merchant Notes`.
  - View delivery status (`Delivered`, `Sent`, `Saved`) and customer read status.
- **AI-Powered Communication Assistant**:
  - Select communication goal:
    - *Shipping Delay Notification* (with empathetic apology & 10% coupon)
    - *VIP Appreciation* (exclusive concierge invite)
    - *Customer Win-Back* (re-engagement offer)
    - *Post-Purchase Review Request* (5-star feedback request)
  - Select customer & order to instantly inject real store data.
  - 1-click **Generate AI Copy** generates polished copy ready for immediate sending!

---

### View 6: WooCommerce Live Settings & Webhook Simulator
- **Dual-Mode Connectivity**:
  - **Demo Mode**: Active out of the box with realistic products, orders, and customer data.
  - **Live WooCommerce Mode**: Connect any real WooCommerce store by entering `Store URL`, `Consumer Key`, and `Consumer Secret`.
  - `Test Connection` button executes live validation against WooCommerce REST API v3.
- **Webhook Simulator for Live Judging**:
  - `Simulate New Order`: Injects a live WooCommerce order into the system and triggers the VIP workflow in real time.
  - `Simulate Order Shipped`: Advances an order to shipped with carrier tracking and fires SMS/email alerts.
  - `Simulate Order Delivered`: Completes fulfillment and sends review follow-up.
  - `Reset Demo Store`: Restores clean benchmark data instantly.

---

## 3. Recommended 3-Minute Hackathon Demo Pitch

Follow this step-by-step demonstration script to impress judges:

### Minute 1: The Problem & The Solution
1. **Show the Dashboard**:
   - *"Standard WooCommerce lacks actionable customer intelligence and automated follow-ups. WooCRM Nexus bridges that gap."*
   - Highlight the KPI cards (LTV, AOV) and the Dual-Mode status badge.

### Minute 2: Customer 360° & Visual Order Tracking
2. **Open Customer 360°**:
   - Filter by `VIP` and open *Eleanor Vance*.
   - Point out the RFM Champion score, total spent ($1,420), merchant notes, and previous order history.
3. **Open Order Tracking**:
   - Click on Order `#3042` and demonstrate the visual 5-step fulfillment stepper.
   - Change the order status to `Shipped` or enter a FedEx tracking number.
   - Show how the timeline immediately captures the update.

### Minute 3: Autonomous Workflows & Real-Time Webhook Simulator
4. **Demonstrate Automation Workflows**:
   - Navigate to the **Workflows** tab to show the visual Trigger-Condition-Action builder.
   - Click `Test Workflow` to show the live execution trace and variable substitution.
5. **The "Grand Finale" Webhook Simulation**:
   - Go to **Settings & Simulator** or use the header action: click `Simulate New Order`.
   - Switch to the **Dashboard** and **Communications** tab: show the new order appearing in the live feed, and show how the VIP Welcome workflow automatically dispatched an email to the customer with their name and order details!
6. **Conclude**:
   - Highlight the production-ready architecture with live WooCommerce REST API v3 keys support.
