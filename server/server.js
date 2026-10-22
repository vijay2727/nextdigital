import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { PRODUCTS, CLIENT_LOGOS, CATEGORIES } from './data/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve images statically if requested through backend
app.use('/images', express.static(path.join(__dirname, '../atoz_product_images')));

// 1. Get all products with query filtering (category, search, sort, deal)
app.get('/api/products', (req, res) => {
  const { category, search, sort, deal, featured } = req.query;
  let results = [...PRODUCTS];

  if (category && category.toLowerCase() !== 'all') {
    results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase().trim();
    results = results.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  if (deal === 'true') {
    results = results.filter(p => p.isDeal);
  }

  if (featured === 'true') {
    results = results.filter(p => p.isBestSeller);
  }

  if (sort === 'price-low') {
    results.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    results.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  }

  res.json({
    success: true,
    count: results.length,
    data: results
  });
});

// 2. Get single product by id
app.get('/api/products/:id', (req, res) => {
  const product = PRODUCTS.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // Related products from same category
  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  res.json({
    success: true,
    data: product,
    related
  });
});

// 3. Get categories
app.get('/api/categories', (req, res) => {
  res.json({
    success: true,
    data: CATEGORIES
  });
});

// 4. Get client associations
app.get('/api/clients', (req, res) => {
  res.json({
    success: true,
    data: CLIENT_LOGOS
  });
});

// 5. Contact / Inquiry form submission
const inquiries = [];
app.post('/api/inquiries', (req, res) => {
  const { name, email, phone, message, subject } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ success: false, message: 'Name and Phone number are required' });
  }

  const inquiry = {
    id: 'INQ-' + Date.now(),
    name,
    email: email || '',
    phone,
    subject: subject || 'General Product Inquiry',
    message: message || '',
    createdAt: new Date().toISOString()
  };

  inquiries.push(inquiry);
  console.log(`[INQUIRY RECEIVED] From ${name} (${phone}) - ${subject}`);

  res.status(201).json({
    success: true,
    message: 'Thank you for reaching out! Our team at NextDigital will contact you shortly.',
    inquiryId: inquiry.id
  });
});

// 6. Orders / Checkout stub (Payment gateway placeholder for future integration)
const orders = [];
app.post('/api/checkout', (req, res) => {
  const { customer, items, totalAmount, paymentMethod = 'COD' } = req.body;

  if (!customer || !items || !items.length) {
    return res.status(400).json({ success: false, message: 'Customer details and cart items are required' });
  }

  const order = {
    orderId: 'ND-' + Math.floor(100000 + Math.random() * 900000),
    customer,
    items,
    totalAmount,
    paymentMethod,
    paymentStatus: paymentMethod === 'COD' ? 'Pending (Cash on Delivery)' : 'Payment Gateway Ready (Pending Integration)',
    orderStatus: 'Confirmed',
    createdAt: new Date().toISOString()
  };

  orders.push(order);
  console.log(`[ORDER CREATED] ${order.orderId} for ₹${totalAmount}`);

  res.status(201).json({
    success: true,
    message: 'Order created successfully! Confirmation details sent to customer.',
    order
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'NextDigital India Backend API' });
});

app.listen(PORT, () => {
  console.log(`NextDigital Backend API running on http://localhost:${PORT}`);
});
