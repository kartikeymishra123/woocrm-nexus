export const initialSeedData = {
  settings: {
    mode: "demo", // "demo" or "live"
    storeName: "Velvet & Oak Artisan Apparel",
    storeUrl: "https://velvetandoak.example.com",
    consumerKey: "ck_9a48f729e10d8a554862b1029c",
    consumerSecret: "cs_6c29b871f30e9d128475a401b2",
    webhookSecret: "whsec_live_948f219082acde",
    currency: "USD",
    currencySymbol: "$",
    lastSyncedAt: new Date().toISOString(),
    syncStatus: "connected"
  },
  customers: [
    {
      id: 101,
      first_name: "Eleanor",
      last_name: "Vance",
      email: "eleanor.vance@example.com",
      phone: "+1 (555) 349-8812",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      total_spent: 1420.50,
      orders_count: 6,
      date_created: "2024-03-12T10:14:00Z",
      last_active: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      segment: "VIP",
      tags: ["VIP", "Repeat Buyer", "Eco Friendly"],
      rfm_score: { recency: 5, frequency: 5, monetary: 5, label: "Champion" },
      billing: {
        first_name: "Eleanor",
        last_name: "Vance",
        address_1: "742 Evergreen Terrace",
        city: "Seattle",
        state: "WA",
        postcode: "98101",
        country: "US"
      },
      shipping: {
        first_name: "Eleanor",
        last_name: "Vance",
        address_1: "742 Evergreen Terrace",
        city: "Seattle",
        state: "WA",
        postcode: "98101",
        country: "US"
      },
      notes: [
        { id: "n1", text: "Prefers gift packaging without plastic.", author: "Support Agent Mark", createdAt: "2024-08-10T14:20:00Z" },
        { id: "n2", text: "Inquired about upcoming Autumn cashmere line.", author: "Sales Rep Lisa", createdAt: "2024-10-01T11:05:00Z" }
      ]
    },
    {
      id: 102,
      first_name: "Marcus",
      last_name: "Sterling",
      email: "marcus.sterling@example.com",
      phone: "+1 (555) 782-9901",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      total_spent: 890.00,
      orders_count: 3,
      date_created: "2024-06-20T14:45:00Z",
      last_active: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
      segment: "High Spender",
      tags: ["High Spender", "Express Shipper"],
      rfm_score: { recency: 4, frequency: 4, monetary: 4, label: "Loyal Customer" },
      billing: {
        first_name: "Marcus",
        last_name: "Sterling",
        address_1: "1200 Grand Avenue, Apt 4B",
        city: "Chicago",
        state: "IL",
        postcode: "60611",
        country: "US"
      },
      shipping: {
        first_name: "Marcus",
        last_name: "Sterling",
        address_1: "1200 Grand Avenue, Apt 4B",
        city: "Chicago",
        state: "IL",
        postcode: "60611",
        country: "US"
      },
      notes: [
        { id: "n3", text: "High average basket value ($296/order).", author: "Automated RFM", createdAt: "2024-09-12T09:00:00Z" }
      ]
    },
    {
      id: 103,
      first_name: "Sophia",
      last_name: "Chen",
      email: "sophia.chen@example.com",
      phone: "+1 (555) 412-3344",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      total_spent: 125.00,
      orders_count: 1,
      date_created: "2024-10-10T18:30:00Z",
      last_active: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      segment: "New",
      tags: ["First-Time Buyer", "Newsletter Subscribed"],
      rfm_score: { recency: 5, frequency: 1, monetary: 2, label: "New Buyer" },
      billing: {
        first_name: "Sophia",
        last_name: "Chen",
        address_1: "88 Mission Street",
        city: "San Francisco",
        state: "CA",
        postcode: "94105",
        country: "US"
      },
      shipping: {
        first_name: "Sophia",
        last_name: "Chen",
        address_1: "88 Mission Street",
        city: "San Francisco",
        state: "CA",
        postcode: "94105",
        country: "US"
      },
      notes: [
        { id: "n4", text: "Signed up via Instagram launch campaign.", author: "System", createdAt: "2024-10-10T18:30:00Z" }
      ]
    },
    {
      id: 104,
      first_name: "Liam",
      last_name: "Gallagher",
      email: "liam.gallagher@example.com",
      phone: "+1 (555) 609-1123",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      total_spent: 640.20,
      orders_count: 4,
      date_created: "2024-01-15T08:00:00Z",
      last_active: new Date(Date.now() - 38 * 24 * 3600 * 1000).toISOString(),
      segment: "At-Risk",
      tags: ["At-Risk", "Discount Driven"],
      rfm_score: { recency: 1, frequency: 3, monetary: 3, label: "Needs Attention" },
      billing: {
        first_name: "Liam",
        last_name: "Gallagher",
        address_1: "45 Beacon St",
        city: "Boston",
        state: "MA",
        postcode: "02108",
        country: "US"
      },
      shipping: {
        first_name: "Liam",
        last_name: "Gallagher",
        address_1: "45 Beacon St",
        city: "Boston",
        state: "MA",
        postcode: "02108",
        country: "US"
      },
      notes: [
        { id: "n5", text: "No orders in last 38 days. Eligible for re-engagement promo.", author: "Automated RFM", createdAt: "2024-10-01T04:00:00Z" }
      ]
    },
    {
      id: 105,
      first_name: "Amara",
      last_name: "Diallo",
      email: "amara.diallo@example.com",
      phone: "+1 (555) 234-9087",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      total_spent: 2150.00,
      orders_count: 8,
      date_created: "2023-11-04T12:00:00Z",
      last_active: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
      segment: "VIP",
      tags: ["VIP", "Brand Ambassador", "High Spender"],
      rfm_score: { recency: 5, frequency: 5, monetary: 5, label: "Champion" },
      billing: {
        first_name: "Amara",
        last_name: "Diallo",
        address_1: "350 5th Avenue, Suite 2100",
        city: "New York",
        state: "NY",
        postcode: "10118",
        country: "US"
      },
      shipping: {
        first_name: "Amara",
        last_name: "Diallo",
        address_1: "350 5th Avenue, Suite 2100",
        city: "New York",
        state: "NY",
        postcode: "10118",
        country: "US"
      },
      notes: [
        { id: "n6", text: "Top 1% spender across all store sales.", author: "Admin", createdAt: "2024-09-01T10:00:00Z" }
      ]
    }
  ],
  orders: [
    {
      id: 3042,
      order_number: "WC-3042",
      status: "processing", // pending, processing, on-hold, completed, shipped, delivered, cancelled
      fulfillment_step: 2, // 0: Placed, 1: Payment Confirmed, 2: Processing/Packing, 3: Shipped, 4: Delivered
      date_created: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      customer_id: 101,
      customer_name: "Eleanor Vance",
      customer_email: "eleanor.vance@example.com",
      currency: "USD",
      total: 345.00,
      subtotal: 320.00,
      shipping_total: 10.00,
      tax_total: 15.00,
      payment_method_title: "Stripe Apple Pay",
      shipping_method: "FedEx Express (2-Day)",
      tracking: {
        carrier: "FedEx",
        tracking_number: "FX-998241029",
        estimated_delivery: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString().split('T')[0],
        url: "https://www.fedex.com/fedextrack/?trknbr=FX-998241029"
      },
      line_items: [
        {
          id: 501,
          name: "Merino Wool Cashmere Cardigan",
          sku: "MWC-OAT-M",
          price: 240.00,
          quantity: 1,
          total: 240.00,
          image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=150&auto=format&fit=crop&q=80"
        },
        {
          id: 502,
          name: "Handcrafted Silk Scarf - Amber Rust",
          sku: "HSS-AMB-OS",
          price: 80.00,
          quantity: 1,
          total: 80.00,
          image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=150&auto=format&fit=crop&q=80"
        }
      ],
      timeline: [
        { time: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), event: "Order Placed", note: "Order placed online by customer." },
        { time: new Date(Date.now() - 2.8 * 3600 * 1000).toISOString(), event: "Payment Captured", note: "$345.00 authorized via Apple Pay." },
        { time: new Date(Date.now() - 1.5 * 3600 * 1000).toISOString(), event: "Sent to Warehouse", note: "Fulfillment ticket #WH-442 generated." }
      ]
    },
    {
      id: 3041,
      order_number: "WC-3041",
      status: "shipped",
      fulfillment_step: 3,
      date_created: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
      customer_id: 102,
      customer_name: "Marcus Sterling",
      customer_email: "marcus.sterling@example.com",
      currency: "USD",
      total: 480.00,
      subtotal: 450.00,
      shipping_total: 12.00,
      tax_total: 18.00,
      payment_method_title: "Credit Card (Visa)",
      shipping_method: "DHL Express Worldwide",
      tracking: {
        carrier: "DHL",
        tracking_number: "DHL-448102941",
        estimated_delivery: new Date(Date.now() + 1 * 24 * 3600 * 1000).toISOString().split('T')[0],
        url: "https://www.dhl.com/en/express/tracking.html?AWB=DHL-448102941"
      },
      line_items: [
        {
          id: 503,
          name: "Structured Italian Wool Blazer",
          sku: "SIW-NAV-42",
          price: 450.00,
          quantity: 1,
          total: 450.00,
          image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=150&auto=format&fit=crop&q=80"
        }
      ],
      timeline: [
        { time: new Date(Date.now() - 26 * 3600 * 1000).toISOString(), event: "Order Placed", note: "Checkout completed." },
        { time: new Date(Date.now() - 25.5 * 3600 * 1000).toISOString(), event: "Payment Confirmed", note: "Stripe Charge ID: ch_398a12b." },
        { time: new Date(Date.now() - 18 * 3600 * 1000).toISOString(), event: "Packed in Warehouse", note: "Scanned and boxed." },
        { time: new Date(Date.now() - 6 * 3600 * 1000).toISOString(), event: "Shipped with DHL", note: "Carrier accepted package at sorting facility." }
      ]
    },
    {
      id: 3040,
      order_number: "WC-3040",
      status: "delivered",
      fulfillment_step: 4,
      date_created: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
      customer_id: 105,
      customer_name: "Amara Diallo",
      customer_email: "amara.diallo@example.com",
      currency: "USD",
      total: 720.00,
      subtotal: 680.00,
      shipping_total: 0.00, // Free VIP shipping
      tax_total: 40.00,
      payment_method_title: "Stripe Credit Card (Amex)",
      shipping_method: "UPS Next Day Air",
      tracking: {
        carrier: "UPS",
        tracking_number: "1Z9999999999999999",
        estimated_delivery: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString().split('T')[0],
        url: "https://www.ups.com/track?tracknum=1Z9999999999999999"
      },
      line_items: [
        {
          id: 504,
          name: "Full Grain Leather Weekender Duffel",
          sku: "FGL-COG-OS",
          price: 520.00,
          quantity: 1,
          total: 520.00,
          image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=150&auto=format&fit=crop&q=80"
        },
        {
          id: 505,
          name: "Leather Luggage Tag & Passport Case",
          sku: "LLT-COG-SET",
          price: 160.00,
          quantity: 1,
          total: 160.00,
          image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=150&auto=format&fit=crop&q=80"
        }
      ],
      timeline: [
        { time: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(), event: "Order Placed", note: "VIP free overnight selected." },
        { time: new Date(Date.now() - 3.8 * 24 * 3600 * 1000).toISOString(), event: "Dispatched", note: "UPS picked up." },
        { time: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(), event: "Delivered", note: "Signed by Amara Diallo at front desk." }
      ]
    },
    {
      id: 3039,
      order_number: "WC-3039",
      status: "pending",
      fulfillment_step: 0,
      date_created: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      customer_id: 103,
      customer_name: "Sophia Chen",
      customer_email: "sophia.chen@example.com",
      currency: "USD",
      total: 125.00,
      subtotal: 110.00,
      shipping_total: 10.00,
      tax_total: 5.00,
      payment_method_title: "PayPal Express",
      shipping_method: "Standard Ground (3-5 Days)",
      tracking: null,
      line_items: [
        {
          id: 506,
          name: "Organic Cotton Ribbed Turtleneck",
          sku: "OCR-IVR-S",
          price: 110.00,
          quantity: 1,
          total: 110.00,
          image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=150&auto=format&fit=crop&q=80"
        }
      ],
      timeline: [
        { time: new Date(Date.now() - 45 * 60 * 1000).toISOString(), event: "Pending Payment", note: "Waiting for PayPal webhook settlement." }
      ]
    }
  ],
  workflows: [
    {
      id: "wf-1",
      name: "VIP High-Spender VIP Welcome",
      description: "When an order exceeds $200, automatically tag customer as VIP and send an exclusive concierge appreciation email.",
      active: true,
      trigger: {
        type: "order.created",
        label: "Order Created in WooCommerce"
      },
      condition: {
        field: "order.total",
        operator: "greater_than_or_equal",
        value: 200,
        label: "Order Total ≥ $200.00"
      },
      actions: [
        {
          type: "add_customer_tag",
          params: { tag: "VIP" },
          label: "Add Tag 'VIP' to Customer"
        },
        {
          type: "send_email",
          params: {
            subject: "A special thank you from our founder, {{customer.name}}! ✨",
            template: "vip_thank_you",
            body: "Hi {{customer.name}},\n\nThank you so much for your recent order #{{order.id}} totaling {{order.total}}. As one of our most valued patrons, you've unlocked exclusive VIP Concierge perks and 15% off your next purchase with code: VIPPRIVILEGE.\n\nWarm regards,\nThe Velvet & Oak Team"
          },
          label: "Send VIP Concierge Email"
        }
      ],
      executions_count: 14,
      last_executed: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
    },
    {
      id: "wf-2",
      name: "Real-Time Shipping & Tracking Dispatch",
      description: "When fulfillment status changes to 'Shipped', trigger instantaneous multi-channel dispatch with tracking link.",
      active: true,
      trigger: {
        type: "order.status_changed",
        target_status: "shipped",
        label: "Order Status becomes 'Shipped'"
      },
      condition: {
        field: "order.tracking.carrier",
        operator: "exists",
        value: true,
        label: "Tracking Number is Present"
      },
      actions: [
        {
          type: "send_email",
          params: {
            subject: "Your order #{{order.id}} has shipped via {{order.tracking.carrier}}! 📦",
            template: "shipping_update",
            body: "Great news, {{customer.name}}! Your parcel is on its way. Track your package here: {{order.tracking.url}}.\nCarrier: {{order.tracking.carrier}}\nTracking #: {{order.tracking.number}}"
          },
          label: "Send Shipping Notification Email"
        },
        {
          type: "send_sms",
          params: {
            phone: "{{customer.phone}}",
            message: "Velvet & Oak: Your order #{{order.id}} has shipped via {{order.tracking.carrier}}! Track live at: {{order.tracking.url}}"
          },
          label: "Send Tracking SMS"
        }
      ],
      executions_count: 28,
      last_executed: new Date(Date.now() - 6 * 3600 * 1000).toISOString()
    },
    {
      id: "wf-3",
      name: "Delivery Delight & Review Feedback Collector",
      description: "When carrier marks order as Delivered, send a warm feedback request and tag customer profile.",
      active: true,
      trigger: {
        type: "order.status_changed",
        target_status: "delivered",
        label: "Order Status becomes 'Delivered'"
      },
      condition: {
        field: "always",
        operator: "equals",
        value: true,
        label: "Always Run"
      },
      actions: [
        {
          type: "send_email",
          params: {
            subject: "How is your new purchase, {{customer.name}}? 🌟",
            template: "review_request",
            body: "Hi {{customer.name}},\n\nYour order #{{order.id}} was marked delivered today. We hope everything exceeded your expectations! If you have a moment, could you share your thoughts with us? Tap below to leave a review."
          },
          label: "Send Post-Delivery Review Email"
        },
        {
          type: "add_customer_tag",
          params: { tag: "Delivery Verified" },
          label: "Add Tag 'Delivery Verified'"
        }
      ],
      executions_count: 19,
      last_executed: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
    },
    {
      id: "wf-4",
      name: "Dormant Customer Win-Back Campaign",
      description: "Re-engage at-risk customers whose last order was > 30 days ago with a tailored reactivation perk.",
      active: false,
      trigger: {
        type: "customer.inactive_30d",
        label: "Customer Inactive > 30 Days"
      },
      condition: {
        field: "customer.total_spent",
        operator: "greater_than",
        value: 100,
        label: "Customer Lifetime Value > $100"
      },
      actions: [
        {
          type: "send_email",
          params: {
            subject: "We miss you, {{customer.name}}! Here's $20 on us 🎁",
            template: "win_back",
            body: "Hi {{customer.name}},\n\nIt's been a little while! Explore our new arrivals and take $20 off your next order over $80 using code: WELCOMEBACK20."
          },
          label: "Send Reactivation Offer"
        }
      ],
      executions_count: 8,
      last_executed: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
    }
  ],
  communications: [
    {
      id: "comm-1",
      customer_id: 101,
      customer_name: "Eleanor Vance",
      channel: "email",
      type: "automated",
      subject: "A special thank you from our founder, Eleanor! ✨",
      content: "Hi Eleanor, Thank you so much for your recent order #3042 totaling $345.00. As one of our most valued patrons, you've unlocked exclusive VIP Concierge perks...",
      status: "Delivered",
      opened: true,
      timestamp: new Date(Date.now() - 2.5 * 3600 * 1000).toISOString(),
      order_id: 3042
    },
    {
      id: "comm-2",
      customer_id: 102,
      customer_name: "Marcus Sterling",
      channel: "email",
      type: "automated",
      subject: "Your order #3041 has shipped via DHL! 📦",
      content: "Great news, Marcus! Your parcel is on its way. Track your package here: https://www.dhl.com/en/express/tracking.html?AWB=DHL-448102941",
      status: "Delivered",
      opened: true,
      timestamp: new Date(Date.now() - 5.8 * 3600 * 1000).toISOString(),
      order_id: 3041
    },
    {
      id: "comm-3",
      customer_id: 102,
      customer_name: "Marcus Sterling",
      channel: "sms",
      type: "automated",
      subject: "SMS Delivery Alert",
      content: "Velvet & Oak: Your order #3041 has shipped via DHL! Track live at: https://www.dhl.com/en/express/tracking.html?AWB=DHL-448102941",
      status: "Sent",
      opened: true,
      timestamp: new Date(Date.now() - 5.8 * 3600 * 1000).toISOString(),
      order_id: 3041
    },
    {
      id: "comm-4",
      customer_id: 105,
      customer_name: "Amara Diallo",
      channel: "email",
      type: "automated",
      subject: "How is your new purchase, Amara? 🌟",
      content: "Hi Amara, Your order #3040 was marked delivered today. We hope everything exceeded your expectations! Tap below to leave a review.",
      status: "Delivered",
      opened: true,
      timestamp: new Date(Date.now() - 23.5 * 3600 * 1000).toISOString(),
      order_id: 3040
    },
    {
      id: "comm-5",
      customer_id: 101,
      customer_name: "Eleanor Vance",
      channel: "note",
      type: "manual",
      subject: "VIP Packaging Note",
      content: "Confirmed with Eleanor via phone that she loves the zero-plastic packaging. Recorded for future orders.",
      status: "Saved",
      opened: true,
      timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      order_id: null
    }
  ],
  workflowLogs: [
    {
      id: "log-1",
      workflow_id: "wf-1",
      workflow_name: "VIP High-Spender VIP Welcome",
      event: "order.created",
      order_id: 3042,
      customer_name: "Eleanor Vance",
      status: "success",
      details: "Condition matched: Order total $345.00 >= $200. Tag 'VIP' added. Email sent.",
      timestamp: new Date(Date.now() - 2.5 * 3600 * 1000).toISOString()
    },
    {
      id: "log-2",
      workflow_id: "wf-2",
      workflow_name: "Real-Time Shipping & Tracking Dispatch",
      event: "order.status_changed",
      order_id: 3041,
      customer_name: "Marcus Sterling",
      status: "success",
      details: "Trigger: status changed to 'shipped'. Sent email & SMS with DHL tracking.",
      timestamp: new Date(Date.now() - 5.8 * 3600 * 1000).toISOString()
    },
    {
      id: "log-3",
      workflow_id: "wf-3",
      workflow_name: "Delivery Delight & Review Feedback Collector",
      event: "order.status_changed",
      order_id: 3040,
      customer_name: "Amara Diallo",
      status: "success",
      details: "Trigger: status changed to 'delivered'. Tag 'Delivery Verified' added. Email sent.",
      timestamp: new Date(Date.now() - 23.5 * 3600 * 1000).toISOString()
    }
  ]
};
