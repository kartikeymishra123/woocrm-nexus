# WooCRM Nexus: Comprehensive Implementation & Architecture Document

## 1. Executive Summary & Challenge Overview

### 1.1 The Challenge
The Kilowott Hackathon challenge task is:
> **CRM System Integration**
> *Analyse, design, and implement a Customer Relationship Management system that integrates with WooCommerce.*
> - **Customer data management**
> - **Order tracking**
> - **Communication workflows**
> *The open-ended nature of the challenge encourages innovation and resourcefulness.*

### 1.2 Our Solution: WooCRM Nexus
**WooCRM Nexus** is an enterprise-grade Customer Relationship Management platform purpose-engineered for WooCommerce e-commerce merchants. While standard WooCommerce installations only provide a basic list of WordPress users and orders, WooCRM Nexus transforms raw transaction data into **actionable customer intelligence**, **real-time visual fulfillment tracking**, and **autonomous event-driven communication workflows**.

To guarantee a pitch-perfect demonstration regardless of whether the judging panel has an active WordPress/WooCommerce site running during evaluation, WooCRM Nexus implements **Dual-Engine Architecture**:
1. **Live WooCommerce REST API v3 Integration**: Secure connection to real WordPress/WooCommerce instances via Consumer Key / Secret with webhook receiver.
2. **Interactive Demo Store Simulator ("Velvet & Oak Luxury Apparel")**: A fully seeded, interactive mock store with realistic products, customers, and a live Webhook Event Dispatcher for instant demonstration.

---

## 2. System Architecture & Tech Stack

```
+---------------------------------------------------------------------------------------+
|                                    WOOCRM NEXUS                                       |
+---------------------------------------------------------------------------------------+
|                                                                                       |
|   +-------------------------------------------------------------------------------+   |
|   |                       FRONTEND: React 19 + Vite 8                             |   |
|   |                       Styling: Tailwind CSS v4 + Lucide Icons                 |   |
|   +-------------------------------------------------------------------------------+   |
|   |  - Executive KPI Analytics Dashboard (LTV, AOV, Real-Time Event Stream)       |   |
|   |  - Customer 360 Degree Profile & RFM Segmentation Engine                      |   |
|   |  - Visual Order Fulfillment Stepper & Carrier Tracking Hub                    |   |
|   |  - Drag-and-Configure Visual Automation Workflow Builder                      |   |
|   |  - Unified Communication Hub (Email, SMS, WhatsApp) + AI Assistant Composer   |   |
|   |  - WooCommerce Live Credentials Manager & Webhook Simulation Console          |   |
|   +---------------------------------------+---------------------------------------+   |
|                                           | REST APIs (JSON)                          |
|                                           v                                           |
|   +-------------------------------------------------------------------------------+   |
|   |                     BACKEND: Node.js + Express (Port 5000)                    |   |
|   +-------------------------------------------------------------------------------+   |
|   |  /api/customers        -> Customer CRUD, Segmentation, Notes, Tags, RFM       |   |
|   |  /api/orders           -> Order Tracking, Status Transitions, Carrier Sync    |   |
|   |  /api/workflows        -> Automation Rule Engine (Trigger/Condition/Action)   |   |
|   |  /api/communications   -> Message Delivery Logs & Dynamic AI Copywriter       |   |
|   |  /api/woocommerce      -> Live REST v3 Client, Credentials & Webhook Dispatch |   |
|   +-------------------+-----------------------------------+-----------------------+   |
|                       |                                   |                           |
|                       v                                   v                           |
|        +-----------------------------+     +-------------------------------+          |
|        | Persistent JSON Data Store  |     |   WooCommerce Integration     |          |
|        |     (server/data/db.json)   |     |   - Live WooCommerce API v3   |          |
|        | Seeds from initial dataset  |     |   - Webhook Event Dispatcher  |          |
|        +-----------------------------+     +-------------------------------+          |
+---------------------------------------------------------------------------------------+
```

### 2.1 Technology Stack Selection
- **Frontend**: **React 19** with **Vite 8** for ultra-fast HMR and interactive state handling.
- **Styling**: **Tailwind CSS v4** (`@tailwindcss/vite`) providing a sleek dark/light modern glassmorphism design system.
- **Icons**: **Lucide React** for consistent, crisp iconography.
- **Backend API**: **Node.js** with **Express 4.21** providing modular RESTful endpoints.
- **Persistence**: File-backed atomic JSON data store (`server/data/db.json`) ensuring data persists across restarts without heavyweight external database dependencies.
- **Live Integration**: Native HTTPS REST client communicating with WooCommerce REST API endpoints (`/wp-json/wc/v3/*`).

---

## 3. Core Functional Pillars

### 3.1 Pillar 1: Customer Data Management (Customer 360°)
Standard WooCommerce records users as basic WordPress accounts. WooCRM Nexus enriches this into a complete **Customer 360° Profile**:
- **RFM Segmentation Matrix**:
  - **Recency**: Days since last purchase.
  - **Frequency**: Total order count.
  - **Monetary**: Lifetime Value (LTV) and Average Order Value (AOV).
  - Categorized into dynamic segments: **Champions/VIP**, **Loyal Customers**, **New Buyers**, and **At-Risk**.
- **Customer Directory**: Fast search by name, email, or phone; filter by segment (VIP, High Spender, At-Risk, New) and tags.
- **Customer Dossier Modal**:
  - Contact info, billing & shipping addresses with postal validation.
  - Chronological purchase history with one-click drill-down to order items.
  - Merchant internal notes stream with author attribution and timestamp.
  - Dynamic tag manager (e.g. `VIP`, `Eco-Friendly`, `Express Shipper`).
  - Quick communication action: compose targeted Email or SMS directly from the profile.

### 3.2 Pillar 2: Order Fulfillment & Tracking Hub
The order management pipeline turns WooCommerce orders into a real-time fulfillment console:
- **Visual Fulfillment Stepper**:
  - `Step 0: Placed / Pending Payment`
  - `Step 1: Payment Confirmed`
  - `Step 2: Processing & Warehouse Packing`
  - `Step 3: Shipped / In Transit`
  - `Step 4: Delivered`
- **Carrier Tracking Integration**:
  - Support for major carriers (**FedEx**, **DHL**, **UPS**, **BlueDart**).
  - Tracking number generation, estimated delivery date calculation, and direct tracking URL generation.
- **Interactive Status Progression**:
  - Changing an order's status (e.g., from *Processing* to *Shipped*) immediately updates the order timeline.
  - **Crucially: status changes automatically dispatch events to the Workflow Automation Engine**, immediately triggering corresponding customer communications!

### 3.3 Pillar 3: Visual Communication Workflows
Automated customer communications are the superpower of modern e-commerce CRM platforms (similar to Klaviyo or ActiveCampaign).
- **Trigger-Condition-Action Architecture**:
  - **Triggers**:
    - `order.created` (New order placed in WooCommerce)
    - `order.status_changed` (e.g. Order marked Shipped or Delivered)
    - `customer.inactive_30d` (Customer dormant for > 30 days)
  - **Conditions**:
    - `order.total >= 200` (High basket value)
    - `has_tracking_number` (Carrier tracking info exists)
    - `customer.total_spent > 100` (Loyal threshold)
    - `always` (Unconditional execution)
  - **Actions**:
    - `send_email`: Dynamic personalized email with WooCommerce merge tags (`{{customer.name}}`, `{{order.id}}`, `{{order.total}}`, `{{order.tracking.url}}`).
    - `send_sms`: Mobile alert dispatch.
    - `add_customer_tag`: Automatically upgrades customer segment (e.g. tag as `VIP`).
    - `add_note`: Appends an automated note to customer record.
- **Pre-Configured Automation Templates**:
  1. *VIP High-Spender Welcome*: Orders ≥ $200 trigger VIP tag + founder thank-you email with 15% promo code.
  2. *Real-Time Shipping Dispatch*: Marking order as shipped immediately sends tracking email & SMS with carrier link.
  3. *Delivery Delight & Review Collector*: Delivered orders trigger 5-star review request and satisfaction tag.
  4. *At-Risk Winback Sequence*: Reactivates dormant customers with a targeted coupon.
- **Workflow Sandbox ("Test Workflow")**:
  - 1-click test button simulates workflow execution with live step-by-step trace and execution logs.
- **AI-Powered Communication Assistant**:
  - Context-aware email & SMS copywriter generating polished, tailored communications for scenarios like shipping delays, VIP rewards, win-back campaigns, and review requests.

### 3.4 Pillar 4: Dual-Engine WooCommerce Integration
To ensure the judges can test the system immediately without configuring WordPress:
- **Live Mode**:
  - Form fields for `Store URL`, `Consumer Key` (`ck_...`), and `Consumer Secret` (`cs_...`).
  - "Test Connection" button that validates credentials against `/wp-json/wc/v3/system_status`.
  - Bidirectional sync for orders and customers.
  - Active Webhook Receiver endpoint (`/api/woocommerce/webhook-receiver`).
- **Interactive Demo Simulator**:
  - "Simulate Webhook Event" buttons:
    - `Simulate New Order`: Generates a realistic customer order from the store catalog, logs it, and fires matching workflows live on screen!
    - `Simulate Order Shipped`: Advances an order to Shipped, attaches carrier tracking, and fires tracking email/SMS alerts.
    - `Simulate Order Delivered`: Marks order delivered and dispatches review request.
  - "Reset Demo Store" button to restore clean benchmark data at any time.

---

## 4. REST API Endpoint Specification

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/customers` | List customers with search, segment, tag, and sort filters |
| `GET` | `/api/customers/:id` | Full 360° customer profile with order history and comms |
| `POST` | `/api/customers/:id/notes` | Add internal merchant note |
| `POST` | `/api/customers/:id/tags` | Add tag to customer |
| `GET` | `/api/customers/stats/summary` | Aggregate customer metrics (LTV, VIP count, AOV) |
| `GET` | `/api/orders` | List orders with status and search filters |
| `GET` | `/api/orders/:id` | Full order detail with line items and tracking |
| `PATCH` | `/api/orders/:id/status` | Update fulfillment status & fire automation workflows |
| `PATCH` | `/api/orders/:id/tracking` | Attach carrier and tracking number |
| `GET` | `/api/workflows` | List automation workflows |
| `POST` | `/api/workflows/:id/test` | Dry-run workflow simulation with execution trace |
| `GET` | `/api/workflows/logs/recent` | Recent workflow trigger execution logs |
| `GET` | `/api/communications` | List email/SMS/note communication logs |
| `POST` | `/api/communications/send` | Send manual email or SMS to customer |
| `POST` | `/api/communications/ai-draft` | Generate AI-written communication copy |
| `GET` | `/api/woocommerce/settings` | Retrieve store integration settings |
| `POST` | `/api/woocommerce/test-connection` | Verify live WooCommerce API credentials |
| `POST` | `/api/woocommerce/simulate-webhook`| Fire live simulated webhook (order created/shipped/delivered) |
| `POST` | `/api/woocommerce/reset-demo` | Reset state to initial seed dataset |

---

## 5. Hackathon Judging Matrix Alignment

| Evaluation Criteria | WooCRM Nexus Delivery |
| :--- | :--- |
| **Completeness of Requirements** | 100% coverage of Customer Data Management, Order Tracking, and Communication Workflows. |
| **Innovation & Resourcefulness** | Visual automation workflow builder, AI communication drafter, interactive RFM segmentation, and real-time webhook event simulation. |
| **User Experience & Aesthetics** | Modern glassmorphic theme built on Tailwind CSS v4, visual fulfillment steppers, instant search, responsive badges, and smooth micro-animations. |
| **Engineering Rigor** | Decoupled client-server architecture, extensible rule engine, persistent atomic state store, and real WooCommerce REST API v3 readiness. |
