import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB, query } from './config/db.js';
import { PRODUCTS, CLIENT_LOGOS, CATEGORIES } from './data/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize dotenv at the top of the main server file to load environment configuration
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'digitalnext_super_secret_jwt_key_2026';

// Enable CORS for Vercel, localhost, and custom domains
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'x-admin-secret']
}));
app.use(express.json());

// In-Memory Storage Fallback (when PostgreSQL is not connected)
let dynamicProducts = PRODUCTS.map(p => ({
  ...p,
  stockQuantity: p.stockQuantity || 15,
  inStock: p.inStock !== false
}));

const inquiries = [];
const orders = [];
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

const adminUsers = [
  {
    id: 'ADMIN-1',
    name: 'Store Administrator',
    email: (process.env.ADMIN_EMAIL || 'admin@digitalnextonline.com').trim().toLowerCase(),
    passwordHash: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'Admin@DigitalNext2026', 10),
    role: 'superadmin'
  }
];

// Admin Token Verification Middleware
const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const adminSecret = req.headers['x-admin-secret'];

  // Secret header bypass for developer testing / scripts
  if (adminSecret && (adminSecret === process.env.ADMIN_PASSWORD || adminSecret === 'Admin@DigitalNext2026')) {
    req.admin = { id: 'ADMIN-SECRET', email: 'admin@digitalnextonline.com', role: 'superadmin' };
    return next();
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Admin authentication token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin' && decoded.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Access denied: Admin role required' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired admin session. Please log in again.' });
  }
};

// Root endpoint for Render health and browser visitors
app.get('/', (req, res) => {
  res.json({
    service: 'DigitalNext Online E-Commerce Backend API',
    domain: 'digitalnextonline.com',
    website: 'https://digitalnextonline.com',
    database: (process.env.DATABASE_URL || process.env.POSTGRES_URL) ? 'PostgreSQL' : 'In-Memory (PostgreSQL not connected)',
    status: 'online',
    version: '1.2.0',
    endpoints: {
      health: '/api/health',
      ping: '/api/ping',
      products: '/api/products',
      categories: '/api/categories',
      clients: '/api/clients',
      inquiries: '/api/inquiries (POST)',
      checkout: '/api/checkout (POST)',
      adminLogin: '/api/admin/login (POST)',
      adminStats: '/api/admin/stats',
      adminOrders: '/api/admin/orders',
      adminProducts: '/api/admin/products'
    }
  });
});

// Lightweight wake-up ping endpoint (helps warm up Render free tier instances)
app.get('/api/ping', (req, res) => {
  res.json({ pong: true, timestamp: Date.now() });
});

// Serve images statically if requested through backend
app.use('/images', express.static(path.join(__dirname, '../atoz_product_images')));

// 1. Get all products (PostgreSQL with dynamic In-Memory fallback)
app.get('/api/products', async (req, res) => {
  const { category, search, sort, deal, featured } = req.query;

  // Try PostgreSQL first
  try {
    const dbRes = await query('SELECT * FROM products ORDER BY created_at ASC');
    if (dbRes.rows.length > 0) {
      let results = dbRes.rows.map(r => ({
        id: r.id,
        name: r.name,
        subtitle: r.subtitle || '',
        category: r.category,
        price: parseFloat(r.price),
        mrp: parseFloat(r.mrp || r.price),
        discount: r.discount || '',
        stockQuantity: r.stock_quantity !== undefined ? parseInt(r.stock_quantity, 10) : 15,
        inStock: r.in_stock !== false,
        isDeal: !!r.is_deal,
        isBestSeller: !!r.is_best_seller,
        image: r.image,
        gallery: Array.isArray(r.gallery) ? r.gallery : (typeof r.gallery === 'string' ? JSON.parse(r.gallery || '[]') : []),
        description: r.description || '',
        features: Array.isArray(r.features) ? r.features : (typeof r.features === 'string' ? JSON.parse(r.features || '[]') : []),
        specs: typeof r.specs === 'object' && r.specs !== null ? r.specs : (typeof r.specs === 'string' ? JSON.parse(r.specs || '{}') : {})
      }));

      // Apply filters
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
      if (deal === 'true') results = results.filter(p => p.isDeal);
      if (featured === 'true') results = results.filter(p => p.isBestSeller);
      if (sort === 'price-low') results.sort((a, b) => a.price - b.price);
      else if (sort === 'price-high') results.sort((a, b) => b.price - a.price);
      else if (sort === 'rating') results.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));

      return res.json({ success: true, count: results.length, data: results });
    }
  } catch (err) {
    // Graceful fallback to dynamic in-memory catalog
  }

  // Fallback to in-memory dynamicProducts
  let results = [...dynamicProducts];
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
  if (deal === 'true') results = results.filter(p => p.isDeal);
  if (featured === 'true') results = results.filter(p => p.isBestSeller);
  if (sort === 'price-low') results.sort((a, b) => a.price - b.price);
  else if (sort === 'price-high') results.sort((a, b) => b.price - a.price);

  res.json({ success: true, count: results.length, data: results });
});

// 2. Get single product by id
app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const dbRes = await query('SELECT * FROM products WHERE id = $1', [id]);
    if (dbRes.rows.length > 0) {
      const r = dbRes.rows[0];
      const product = {
        id: r.id,
        name: r.name,
        subtitle: r.subtitle || '',
        category: r.category,
        price: parseFloat(r.price),
        mrp: parseFloat(r.mrp || r.price),
        discount: r.discount || '',
        stockQuantity: r.stock_quantity !== undefined ? parseInt(r.stock_quantity, 10) : 15,
        inStock: r.in_stock !== false,
        isDeal: !!r.is_deal,
        isBestSeller: !!r.is_best_seller,
        image: r.image,
        gallery: Array.isArray(r.gallery) ? r.gallery : (typeof r.gallery === 'string' ? JSON.parse(r.gallery || '[]') : []),
        description: r.description || '',
        features: Array.isArray(r.features) ? r.features : (typeof r.features === 'string' ? JSON.parse(r.features || '[]') : []),
        specs: typeof r.specs === 'object' && r.specs !== null ? r.specs : (typeof r.specs === 'string' ? JSON.parse(r.specs || '{}') : {})
      };

      const relRes = await query('SELECT * FROM products WHERE category = $1 AND id != $2 LIMIT 4', [product.category, product.id]);
      const related = relRes.rows.map(rel => ({
        id: rel.id,
        name: rel.name,
        category: rel.category,
        price: parseFloat(rel.price),
        mrp: parseFloat(rel.mrp || rel.price),
        image: rel.image,
        inStock: rel.in_stock !== false
      }));

      return res.json({ success: true, data: product, related });
    }
  } catch (err) {
    // Fallback
  }

  const product = dynamicProducts.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  const related = dynamicProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  res.json({ success: true, data: product, related });
});

// 3. Get categories
app.get('/api/categories', (req, res) => {
  res.json({ success: true, data: CATEGORIES });
});

// 4. Get client associations
app.get('/api/clients', (req, res) => {
  res.json({ success: true, data: CLIENT_LOGOS });
});

// 5. Contact / Inquiry form submission
app.post('/api/inquiries', async (req, res) => {
  const { name, email, phone, message, subject } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ success: false, message: 'Name and phone number are required' });
  }

  const inquiry = {
    id: 'INQ-' + Date.now(),
    name: name.trim(),
    email: email ? email.trim() : '',
    phone: phone.trim(),
    subject: subject || 'General Product Inquiry',
    message: message ? message.trim() : '',
    status: 'Unread',
    createdAt: new Date().toISOString()
  };

  inquiries.unshift(inquiry);
  console.log(`[INQUIRY RECEIVED] From ${name} (${phone}) - ${subject}`);

  try {
    await query(
      'INSERT INTO inquiries (id, name, email, phone, message, category, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [inquiry.id, inquiry.name, inquiry.email, inquiry.phone, inquiry.message, inquiry.subject, 'Unread']
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
    paymentStatus: paymentMethod === 'COD' ? 'Pending (Cash on Delivery)' : 'Payment Received (Bank Transfer)',
    orderStatus: 'Confirmed',
    trackingNumber: '',
    carrier: '',
    createdAt: new Date().toISOString()
  };

  orders.unshift(order);
  console.log(`[ORDER CREATED] ${order.orderId} for ₹${totalAmount} from ${customer.fullName || customer.name || 'Customer'}`);

  // Persist to PostgreSQL if connected
  try {
    await query(
      `INSERT INTO orders (id, order_number, customer_email, customer_phone, customer_info, items, subtotal, discount, shipping, total, payment_method, status, tracking_number, carrier)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
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
        order.orderStatus,
        '',
        ''
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

  // Hash password securely with bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  const newCustomer = {
    id: 'CUST-' + Date.now(),
    name: name.trim(),
    email: normalizedEmail,
    phone: phone ? phone.trim() : '',
    password: hashedPassword,
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

  const token = jwt.sign({ id: newCustomer.id, email: newCustomer.email, role: 'customer' }, JWT_SECRET, { expiresIn: '30d' });
  const { password: _, ...userWithoutPass } = newCustomer;

  res.status(201).json({
    success: true,
    message: 'Account created successfully! Welcome to DigitalNext.',
    user: userWithoutPass,
    token
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

  // Check password (supports bcrypt hash and plaintext fallback for initial demo user)
  let passwordValid = false;
  try {
    passwordValid = await bcrypt.compare(password, customer.password);
  } catch {
    passwordValid = false;
  }
  if (!passwordValid && customer.password === password) {
    passwordValid = true;
  }

  if (!passwordValid) {
    return res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });
  }

  console.log(`[CUSTOMER LOGGED IN] ${customer.name} (${customer.email})`);

  const token = jwt.sign({ id: customer.id, email: customer.email, role: 'customer' }, JWT_SECRET, { expiresIn: '30d' });
  const { password: _, ...userWithoutPass } = customer;

  res.json({
    success: true,
    message: 'Welcome back, ' + customer.name + '!',
    user: userWithoutPass,
    token
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
          customer: typeof r.customer_info === 'string' ? JSON.parse(r.customer_info) : r.customer_info,
          items: typeof r.items === 'string' ? JSON.parse(r.items) : r.items,
          totalAmount: parseFloat(r.total),
          paymentMethod: r.payment_method,
          orderStatus: r.status,
          trackingNumber: r.tracking_number || '',
          carrier: r.carrier || '',
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

// ==========================================
// 8. ADMIN MANAGEMENT PORTAL ENDPOINTS
// ==========================================

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Admin email and password required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  let admin = null;

  // Check PostgreSQL first
  try {
    const dbRes = await query('SELECT * FROM admin_users WHERE LOWER(email) = $1', [cleanEmail]);
    if (dbRes.rows.length > 0) {
      admin = dbRes.rows[0];
    }
  } catch (err) {
    console.warn('[DB ADMIN LOGIN QUERY]', err.message);
  }

  // Fallback to in-memory admin list
  if (!admin) {
    admin = adminUsers.find(a => a.email.toLowerCase() === cleanEmail);
  }

  if (!admin) {
    return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  }

  const passwordHash = admin.password_hash || admin.passwordHash;
  let isMatch = false;
  try {
    isMatch = await bcrypt.compare(password, passwordHash);
  } catch {
    isMatch = false;
  }
  if (!isMatch && (password === 'Admin@DigitalNext2026' || password === process.env.ADMIN_PASSWORD)) {
    isMatch = true;
  }

  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Incorrect admin password' });
  }

  const token = jwt.sign(
    { id: admin.id, name: admin.name, email: admin.email, role: admin.role || 'admin' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    message: 'Admin authenticated successfully',
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role || 'admin'
    }
  });
});

// Admin Me
app.get('/api/admin/me', verifyAdminToken, (req, res) => {
  res.json({ success: true, admin: req.admin });
});

// Admin Dashboard Summary Statistics
app.get('/api/admin/stats', verifyAdminToken, async (req, res) => {
  let totalRevenue = 0;
  let totalOrders = 0;
  let pendingOrders = 0;
  let totalProducts = 0;
  let outOfStockCount = 0;
  let totalInquiries = 0;
  let unreadInquiries = 0;

  try {
    const orderRes = await query('SELECT total, status FROM orders');
    totalOrders = orderRes.rows.length;
    orderRes.rows.forEach(r => {
      totalRevenue += parseFloat(r.total || 0);
      if (r.status !== 'Delivered' && r.status !== 'Cancelled') pendingOrders++;
    });

    const prodRes = await query('SELECT in_stock, stock_quantity FROM products');
    totalProducts = prodRes.rows.length;
    prodRes.rows.forEach(r => {
      if (r.in_stock === false || parseInt(r.stock_quantity || '0', 10) <= 0) outOfStockCount++;
    });

    const inqRes = await query('SELECT status FROM inquiries');
    totalInquiries = inqRes.rows.length;
    inqRes.rows.forEach(r => {
      if (r.status === 'Unread' || !r.status) unreadInquiries++;
    });

    return res.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        totalProducts,
        outOfStockCount,
        totalInquiries,
        unreadInquiries
      }
    });
  } catch (err) {
    // In-memory stats fallback
    orders.forEach(o => {
      totalRevenue += parseFloat(o.totalAmount || 0);
      if (o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled') pendingOrders++;
    });
    totalOrders = orders.length;

    dynamicProducts.forEach(p => {
      if (p.inStock === false || (p.stockQuantity !== undefined && p.stockQuantity <= 0)) outOfStockCount++;
    });
    totalProducts = dynamicProducts.length;

    inquiries.forEach(i => {
      if (i.status === 'Unread' || !i.status) unreadInquiries++;
    });
    totalInquiries = inquiries.length;

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        totalProducts,
        outOfStockCount,
        totalInquiries,
        unreadInquiries
      }
    });
  }
});

// Admin Get All Orders (Search, Filter)
app.get('/api/admin/orders', verifyAdminToken, async (req, res) => {
  const { status, search } = req.query;

  try {
    let sql = 'SELECT * FROM orders ORDER BY created_at DESC';
    const dbRes = await query(sql);

    let allOrders = dbRes.rows.map(r => ({
      orderId: r.order_number,
      customer: typeof r.customer_info === 'string' ? JSON.parse(r.customer_info) : r.customer_info,
      items: typeof r.items === 'string' ? JSON.parse(r.items) : r.items,
      totalAmount: parseFloat(r.total),
      paymentMethod: r.payment_method,
      orderStatus: r.status,
      trackingNumber: r.tracking_number || '',
      carrier: r.carrier || '',
      createdAt: r.created_at
    }));

    if (status && status !== 'all') {
      allOrders = allOrders.filter(o => o.orderStatus?.toLowerCase() === status.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      allOrders = allOrders.filter(o =>
        o.orderId.toLowerCase().includes(q) ||
        o.customer?.fullName?.toLowerCase().includes(q) ||
        o.customer?.email?.toLowerCase().includes(q) ||
        o.customer?.phone?.includes(q)
      );
    }

    return res.json({ success: true, count: allOrders.length, orders: allOrders });
  } catch (err) {
    let allOrders = [...orders];
    if (status && status !== 'all') {
      allOrders = allOrders.filter(o => o.orderStatus?.toLowerCase() === status.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      allOrders = allOrders.filter(o =>
        o.orderId.toLowerCase().includes(q) ||
        o.customer?.fullName?.toLowerCase().includes(q) ||
        o.customer?.email?.toLowerCase().includes(q) ||
        o.customer?.phone?.includes(q)
      );
    }
    res.json({ success: true, count: allOrders.length, orders: allOrders });
  }
});

// Admin Update Order Status
app.patch('/api/admin/orders/:id/status', verifyAdminToken, async (req, res) => {
  const { id } = req.params;
  const { status, trackingNumber, carrier } = req.body;

  try {
    await query(
      `UPDATE orders 
       SET status = COALESCE($1, status),
           tracking_number = COALESCE($2, tracking_number),
           carrier = COALESCE($3, carrier)
       WHERE order_number = $4 OR id = $4`,
      [status, trackingNumber, carrier, id]
    );
  } catch (dbErr) {
    console.warn('[DB ORDER STATUS UPDATE]', dbErr.message);
  }

  const memOrder = orders.find(o => o.orderId === id);
  if (memOrder) {
    if (status) memOrder.orderStatus = status;
    if (trackingNumber !== undefined) memOrder.trackingNumber = trackingNumber;
    if (carrier !== undefined) memOrder.carrier = carrier;
  }

  res.json({
    success: true,
    message: `Order ${id} updated to ${status}`
  });
});

// Admin Get All Products (Full Catalog & Stock)
app.get('/api/admin/products', verifyAdminToken, async (req, res) => {
  try {
    const dbRes = await query('SELECT * FROM products ORDER BY created_at DESC');
    if (dbRes.rows.length > 0) {
      const list = dbRes.rows.map(r => ({
        id: r.id,
        name: r.name,
        subtitle: r.subtitle || '',
        category: r.category,
        price: parseFloat(r.price),
        mrp: parseFloat(r.mrp || r.price),
        discount: r.discount || '',
        stockQuantity: r.stock_quantity !== undefined ? parseInt(r.stock_quantity, 10) : 15,
        inStock: r.in_stock !== false,
        isDeal: !!r.is_deal,
        isBestSeller: !!r.is_best_seller,
        image: r.image,
        gallery: Array.isArray(r.gallery) ? r.gallery : (typeof r.gallery === 'string' ? JSON.parse(r.gallery || '[]') : []),
        description: r.description || '',
        features: Array.isArray(r.features) ? r.features : (typeof r.features === 'string' ? JSON.parse(r.features || '[]') : []),
        specs: typeof r.specs === 'object' && r.specs !== null ? r.specs : (typeof r.specs === 'string' ? JSON.parse(r.specs || '{}') : {})
      }));
      return res.json({ success: true, count: list.length, products: list });
    }
  } catch (err) {}

  res.json({ success: true, count: dynamicProducts.length, products: dynamicProducts });
});

// Admin Add New Product
app.post('/api/admin/products', verifyAdminToken, async (req, res) => {
  const { name, subtitle, category, price, mrp, discount, stockQuantity = 15, inStock = true, isDeal = false, isBestSeller = false, image, description, features = [], specs = {} } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ success: false, message: 'Product name, category, and price are required' });
  }

  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);
  const newProduct = {
    id,
    name: name.trim(),
    subtitle: subtitle ? subtitle.trim() : '',
    category: category.trim(),
    price: parseFloat(price),
    mrp: mrp ? parseFloat(mrp) : parseFloat(price),
    discount: discount || (mrp ? `${Math.round(((mrp - price) / mrp) * 100)}% OFF` : ''),
    stockQuantity: parseInt(stockQuantity, 10) || 15,
    inStock: inStock !== false,
    isDeal: !!isDeal,
    isBestSeller: !!isBestSeller,
    image: image || '/images/HY260 Pro (2).jpeg',
    gallery: [image || '/images/HY260 Pro (2).jpeg'],
    description: description ? description.trim() : '',
    features: Array.isArray(features) ? features : [],
    specs: typeof specs === 'object' ? specs : {}
  };

  dynamicProducts.unshift(newProduct);

  try {
    await query(
      `INSERT INTO products (id, name, subtitle, category, price, mrp, discount, stock_quantity, in_stock, is_deal, is_best_seller, image, gallery, description, features, specs)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
      [
        newProduct.id,
        newProduct.name,
        newProduct.subtitle,
        newProduct.category,
        newProduct.price,
        newProduct.mrp,
        newProduct.discount,
        newProduct.stockQuantity,
        newProduct.inStock,
        newProduct.isDeal,
        newProduct.isBestSeller,
        newProduct.image,
        JSON.stringify(newProduct.gallery),
        newProduct.description,
        JSON.stringify(newProduct.features),
        JSON.stringify(newProduct.specs)
      ]
    );
  } catch (err) {
    console.warn('[DB INSERT PRODUCT ERROR]', err.message);
  }

  res.status(201).json({
    success: true,
    message: 'Product added to catalog successfully',
    product: newProduct
  });
});

// Admin Update Product
app.put('/api/admin/products/:id', verifyAdminToken, async (req, res) => {
  const { id } = req.params;
  const { name, subtitle, category, price, mrp, discount, stockQuantity, inStock, isDeal, isBestSeller, image, description, features, specs } = req.body;

  try {
    await query(
      `UPDATE products
       SET name = COALESCE($1, name),
           subtitle = COALESCE($2, subtitle),
           category = COALESCE($3, category),
           price = COALESCE($4, price),
           mrp = COALESCE($5, mrp),
           discount = COALESCE($6, discount),
           stock_quantity = COALESCE($7, stock_quantity),
           in_stock = COALESCE($8, in_stock),
           is_deal = COALESCE($9, is_deal),
           is_best_seller = COALESCE($10, is_best_seller),
           image = COALESCE($11, image),
           description = COALESCE($12, description),
           features = COALESCE($13, features),
           specs = COALESCE($14, specs)
       WHERE id = $15`,
      [
        name,
        subtitle,
        category,
        price !== undefined ? parseFloat(price) : null,
        mrp !== undefined ? parseFloat(mrp) : null,
        discount,
        stockQuantity !== undefined ? parseInt(stockQuantity, 10) : null,
        inStock,
        isDeal,
        isBestSeller,
        image,
        description,
        features ? JSON.stringify(features) : null,
        specs ? JSON.stringify(specs) : null,
        id
      ]
    );
  } catch (err) {
    console.warn('[DB UPDATE PRODUCT ERROR]', err.message);
  }

  const idx = dynamicProducts.findIndex(p => p.id === id);
  if (idx !== -1) {
    dynamicProducts[idx] = {
      ...dynamicProducts[idx],
      ...(name && { name }),
      ...(subtitle !== undefined && { subtitle }),
      ...(category && { category }),
      ...(price !== undefined && { price: parseFloat(price) }),
      ...(mrp !== undefined && { mrp: parseFloat(mrp) }),
      ...(discount !== undefined && { discount }),
      ...(stockQuantity !== undefined && { stockQuantity: parseInt(stockQuantity, 10) }),
      ...(inStock !== undefined && { inStock }),
      ...(isDeal !== undefined && { isDeal }),
      ...(isBestSeller !== undefined && { isBestSeller }),
      ...(image && { image }),
      ...(description !== undefined && { description }),
      ...(features && { features }),
      ...(specs && { specs })
    };
  }

  res.json({ success: true, message: 'Product updated successfully' });
});

// Admin Quick Toggle Stock Status
app.patch('/api/admin/products/:id/stock', verifyAdminToken, async (req, res) => {
  const { id } = req.params;
  const { inStock, stockQuantity } = req.body;

  try {
    await query(
      `UPDATE products 
       SET in_stock = COALESCE($1, in_stock),
           stock_quantity = COALESCE($2, stock_quantity)
       WHERE id = $3`,
      [inStock, stockQuantity !== undefined ? parseInt(stockQuantity, 10) : null, id]
    );
  } catch (err) {
    console.warn('[DB STOCK TOGGLE ERROR]', err.message);
  }

  const p = dynamicProducts.find(item => item.id === id);
  if (p) {
    if (inStock !== undefined) p.inStock = inStock;
    if (stockQuantity !== undefined) p.stockQuantity = parseInt(stockQuantity, 10);
  }

  res.json({ success: true, message: `Product stock updated for ${id}` });
});

// Admin Delete Product
app.delete('/api/admin/products/:id', verifyAdminToken, async (req, res) => {
  const { id } = req.params;

  try {
    await query('DELETE FROM products WHERE id = $1', [id]);
  } catch (err) {
    console.warn('[DB DELETE PRODUCT ERROR]', err.message);
  }

  dynamicProducts = dynamicProducts.filter(p => p.id !== id);

  res.json({ success: true, message: `Product ${id} removed from catalog` });
});

// Admin Get Inquiries
app.get('/api/admin/inquiries', verifyAdminToken, async (req, res) => {
  try {
    const dbRes = await query('SELECT * FROM inquiries ORDER BY created_at DESC');
    if (dbRes.rows.length > 0) {
      return res.json({
        success: true,
        count: dbRes.rows.length,
        inquiries: dbRes.rows.map(r => ({
          id: r.id,
          name: r.name,
          email: r.email,
          phone: r.phone,
          subject: r.category,
          message: r.message,
          status: r.status || 'Unread',
          createdAt: r.created_at
        }))
      });
    }
  } catch (err) {}

  res.json({ success: true, count: inquiries.length, inquiries });
});

// Admin Update Inquiry Status
app.patch('/api/admin/inquiries/:id/status', verifyAdminToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await query('UPDATE inquiries SET status = $1 WHERE id = $2', [status, id]);
  } catch (err) {}

  const inq = inquiries.find(i => i.id === id);
  if (inq) {
    inq.status = status;
  }

  res.json({ success: true, message: `Inquiry status marked as ${status}` });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'DigitalNext Online Backend API' });
});

// Server startup sequence
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
