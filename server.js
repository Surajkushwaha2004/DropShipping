require('dotenv').config();
const express = require('express');
const Razorpay = require('razorpay');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path = require('path');

const app = express();
app.use(express.json());

// --- Database setup (orders.json) ---
const dbFile = path.join(__dirname, 'orders.json');
const adapter = new JSONFile(dbFile);
const db = new Low(adapter, { orders: [] });

// Initialize DB before requests
db.read().then(() => {
  db.data ||= { orders: [] };
});

// --- API routes ---
app.post('/api/orders', async (req, res) => {
  const order = req.body;
  db.data.orders.push({ id: Date.now(), ...order });
  await db.write();
  res.json({ success: true, order });
});

app.get('/api/orders', async (req, res) => {
  if (req.query.token !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  res.json(db.data.orders);
});

app.post('/api/razorpay/order', async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const options = {
      amount: req.body.amount * 100,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Razorpay order creation failed' });
  }
});

// --- Serve frontend from /public ---
app.use(express.static(path.join(__dirname, 'public')));

// --- Start server ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
