import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize dotenv at the top of the main server file to load environment configuration
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

import express from 'express';
import cors from 'cors';
import { connectDB, query } from './config/db.js';
import { PRODUCTS, CLIENT_LOGOS, CATEGORIES } from './data/products.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for Vercel, localhost, and custom domains
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));
app.use(express.json());

// Root endpoint for Render health and browser visitors
app.get('/', (req, res) => {
  res.json({
    service: 'DigitalNext Online E-Commerce Backend API',
    domain: 'digitalnextonline.com',
    website: 'https://digitalnextonline.com',
    database: (process.env.DATABASE_URL || process.env.POSTGRES_URL) ? 'PostgreSQL' : 'In-Memory (PostgreSQL not connected)',
    status: 'online',
    version: '1.0.0',
    documentation: 'https://github.com/vijay2727/nextdigital',
    endpoints: {
      health: '/api/health',
      ping: '/api/ping',
      products: '/api/products',
      categories: '/api/categories',
      clients: '/api/clients',
      inquiries: '/api/inquiries (POST)',
      checkout: '/api/checkout (POST)',
      login: '/api/auth/login (POST)',
      register: '/api/auth/register (POST)',
      profile: '/api/auth/profile (PUT)',
      orders: '/api/customer/orders'
    }
  });
});

// Lightweight wake-up ping endpoint (helps warm up Render free tier instances)
app.get('/api/ping', (req, res) => {
  res.json({ pong: true, timestamp: Date.now() });
});

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
app.post('/api/inquiries', async (req, res) => {
  const { name, email, phone, message, subject } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ success: false, message: 'Name and Phone number are required' });
  }

  const inquiry = {
    id: 'INQ-' + Date.now(),
    name: name.trim(),
    email: email ? email.trim() : '',
    phone: phone.trim(),
    subject: subject || 'General Product Inquiry',
    message: message ? message.trim() : '',
    createdAt: new Date().toISOString()
  };

  inquiries.push(inquiry);
  console.log(`[INQUIRY RECEIVED] From ${name} (${phone}) - ${subject}`);

  // Persist to PostgreSQL if connected
  try {
    await query(
      'INSERT INTO inquiries (id, name, email, phone, message, category) VALUES ($1, $2, $3, $4, $5, $6)',
      [inquiry.id, inquiry.name, inquiry.email, inquiry.phone, inquiry.message, inquiry.subject]
    );
  } catch (dbErr) {
    console.warn('[DB INQUIRY INSERT]', dbErr.message);
  }

  res.status(201).json({
    success: true,
    message: 'Thank you for reaching out! Our team at DigitalNext will contact you shortly.',
    inquiryId: inquiry.id
  });
});

// 6. Orders / Checkout
const orders = [];
app.post('/api/checkout', async (req, res) => {
  const { customer, items, totalAmount, paymentMethod = 'COD' } = req.body;

  if (!customer || !items || !items.length) {
    return res.status(400).json({ success: false, message: 'Customer details and cart items are required' });
  }

  const order = {
    orderId: 'DN-' + Math.floor(100000 + Math.random() * 900000),
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

  // Persist to PostgreSQL if connected
  try {
    await query(
      `INSERT INTO orders (id, order_number, customer_email, customer_phone, customer_info, items, subtotal, discount, shipping, total, payment_method, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        order.orderId,
        order.orderId,
        customer.email || '',
        customer.phone || '',
        JSON.stringify(customer),
        JSON.stringify(items),
        totalAmount,
        0,
        0,
        totalAmount,
        paymentMethod,
        order.orderStatus
      ]
    );
  } catch (dbErr) {
    console.warn('[DB ORDER INSERT]', dbErr.message);
  }

  res.status(201).json({
    success: true,
    message: 'Order created successfully! Confirmation details sent to customer.',
    order
  });
});

// 7. Customer Authentication Store & Endpoints
const customers = [
  {
    id: 'CUST-1001',
    name: 'Ramesh Sharma',
    email: 'demo@digitalnextonline.com',
    phone: '9876543210',
    password: 'password123',
    address: 'B-42, Sector 62',
    city: 'Noida',
    pincode: '201301',
    createdAt: new Date().toISOString()
  }
];

// Register Customer
app.post('/api/auth/register', async (req, res) => {
  const { name, email, phone, password, address, city, pincode } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Check PostgreSQL first
  try {
    const existingResult = await query('SELECT id FROM customers WHERE LOWER(email) = $1', [normalizedEmail]);
    if (existingResult.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'An account with this email address already exists' });
    }
  } catch {
    const existing = customers.find(c => c.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email address already exists' });
    }
  }

  const newCustomer = {
    id: 'CUST-' + Date.now(),
    name: name.trim(),
    email: normalizedEmail,
    phone: phone ? phone.trim() : '',
    password, // Store password
    address: address ? address.trim() : '',
    city: city ? city.trim() : '',
    pincode: pincode ? pincode.trim() : '',
    createdAt: new Date().toISOString()
  };

  customers.push(newCustomer);
  console.log(`[CUSTOMER REGISTERED] ${newCustomer.name} (${newCustomer.email})`);

  // Persist to PostgreSQL
  try {
    await query(
      `INSERT INTO customers (id, name, email, phone, password, address, city, pincode)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        newCustomer.id,
        newCustomer.name,
        newCustomer.email,
        newCustomer.phone,
        newCustomer.password,
        newCustomer.address,
        newCustomer.city,
        newCustomer.pincode
      ]
    );
  } catch (dbErr) {
    console.warn('[DB REGISTER INSERT]', dbErr.message);
  }

  // Return user without password
  const { password: _, ...userWithoutPass } = newCustomer;
  res.status(201).json({
    success: true,
    message: 'Account created successfully! Welcome to DigitalNext.',
    user: userWithoutPass,
    token: 'jwt-mock-token-' + newCustomer.id
  });
});

// Login Customer
app.post('/api/auth/login', async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ success: false, message: 'Email/Phone and password are required' });
  }

  const cleanIdent = identifier.trim().toLowerCase();
  let customer = null;

  // Query PostgreSQL first
  try {
    const isDemo = cleanIdent === 'demo@digitalnextonline.com' || cleanIdent === 'demo@digitalnext.com' || cleanIdent === 'demo@nextdigital.com';
    const dbRes = await query(
      `SELECT * FROM customers 
       WHERE LOWER(email) = $1 
          OR (phone IS NOT NULL AND REGEXP_REPLACE(phone, '[^0-9]', '', 'g') = $2)
          OR ($3 = true AND LOWER(email) IN ('demo@digitalnextonline.com', 'demo@digitalnext.com', 'demo@nextdigital.com'))`,
      [cleanIdent, cleanIdent.replace(/\D/g, ''), isDemo]
    );
    if (dbRes.rows.length > 0) {
      customer = dbRes.rows[0];
    }
  } catch (dbErr) {
    console.warn('[DB LOGIN QUERY]', dbErr.message);
  }

  // Fallback to in-memory list
  if (!customer) {
    const isDemo = cleanIdent === 'demo@digitalnextonline.com' || cleanIdent === 'demo@digitalnext.com' || cleanIdent === 'demo@nextdigital.com';
    customer = customers.find(c => 
      c.email.toLowerCase() === cleanIdent || 
      (isDemo && (c.email.toLowerCase() === 'demo@digitalnextonline.com' || c.email.toLowerCase() === 'demo@digitalnext.com' || c.email.toLowerCase() === 'demo@nextdigital.com')) ||
      (c.phone && c.phone.replace(/\D/g, '') === cleanIdent.replace(/\D/g, ''))
    );
  }

  if (!customer) {
    return res.status(401).json({ success: false, message: 'No account found with this email or phone number' });
  }

  if (customer.password !== password) {
    return res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });
  }

  console.log(`[CUSTOMER LOGGED IN] ${customer.name} (${customer.email})`);

  const { password: _, ...userWithoutPass } = customer;
  res.json({
    success: true,
    message: 'Welcome back, ' + customer.name + '!',
    user: userWithoutPass,
    token: 'jwt-mock-token-' + customer.id
  });
});

// Update Profile
app.put('/api/auth/profile', async (req, res) => {
  const { userId, name, phone, address, city, pincode } = req.body;

  try {
    await query(
      `UPDATE customers 
       SET name = COALESCE($1, name),
           phone = COALESCE($2, phone),
           address = COALESCE($3, address),
           city = COALESCE($4, city),
           pincode = COALESCE($5, pincode)
       WHERE id = $6`,
      [name?.trim(), phone?.trim(), address?.trim(), city?.trim(), pincode?.trim(), userId]
    );
  } catch (dbErr) {
    console.warn('[DB PROFILE UPDATE]', dbErr.message);
  }

  const customer = customers.find(c => c.id === userId);
  if (customer) {
    if (name) customer.name = name.trim();
    if (phone) customer.phone = phone.trim();
    if (address !== undefined) customer.address = address.trim();
    if (city !== undefined) customer.city = city.trim();
    if (pincode !== undefined) customer.pincode = pincode.trim();
  }

  const userWithoutPass = customer ? { ...customer } : { id: userId, name, phone, address, city, pincode };
  delete userWithoutPass.password;

  res.json({
    success: true,
    message: 'Profile updated successfully',
    user: userWithoutPass
  });
});

// Get Customer Orders
app.get('/api/customer/orders', async (req, res) => {
  const { email, phone } = req.query;
  if (!email && !phone) {
    return res.status(400).json({ success: false, message: 'Email or phone required' });
  }

  // Query PostgreSQL first
  try {
    const cleanEmail = email ? email.trim().toLowerCase() : '';
    const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
    const dbOrders = await query(
      `SELECT * FROM orders 
       WHERE (LENGTH($1) > 0 AND LOWER(customer_email) = $1)
          OR (LENGTH($2) > 0 AND REGEXP_REPLACE(customer_phone, '[^0-9]', '', 'g') = $2)
       ORDER BY created_at DESC`,
      [cleanEmail, cleanPhone]
    );

    if (dbOrders.rows.length > 0) {
      return res.json({
        success: true,
        orders: dbOrders.rows.map(r => ({
          orderId: r.order_number,
          customer: r.customer_info,
          items: r.items,
          totalAmount: parseFloat(r.total),
          paymentMethod: r.payment_method,
          orderStatus: r.status,
          createdAt: r.created_at
        }))
      });
    }
  } catch (dbErr) {
    console.warn('[DB ORDERS QUERY]', dbErr.message);
  }

  const customerOrders = orders.filter(o => 
    (email && o.customer?.email?.toLowerCase() === email.toLowerCase()) ||
    (phone && o.customer?.phone?.replace(/\D/g, '') === phone.replace(/\D/g, ''))
  );

  res.json({
    success: true,
    orders: customerOrders
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'DigitalNext Online Backend API' });
});

// Server startup sequence: attempt database connection, fall back gracefully to in-memory mode if DB is not configured
const startServer = async () => {
  try {
    const activeDb = await connectDB();
    if (activeDb) {
      console.log('[DATABASE] PostgreSQL initialized and ready.');
    } else {
      console.log('[DATABASE] Notice: Server running with in-memory storage (PostgreSQL DATABASE_URL not set).');
    }
  } catch (error) {
    console.warn('[DATABASE WARN] PostgreSQL connection failed:', error.message);
    console.warn('[DATABASE WARN] Server continuing startup with in-memory storage fallback.');
  }

  app.listen(PORT, () => {
    console.log(`DigitalNext Backend API running on port ${PORT}`);
  });
};

startServer();

export default app;
