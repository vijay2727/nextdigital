import pg from 'pg';
const { Pool } = pg;

let pool = null;

/**
 * Get or create the PostgreSQL connection pool
 */
export const getPool = () => {
  if (!pool) {
    const connectionUri = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.PG_URI;

    if (!connectionUri) {
      return null;
    }

    // Render PostgreSQL requires SSL in production and when connecting to render.com domains
    const isRemote =
      process.env.NODE_ENV === 'production' ||
      connectionUri.includes('render.com') ||
      connectionUri.includes('sslmode=require');

    pool = new Pool({
      connectionString: connectionUri,
      ssl: isRemote ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 8000,
      idleTimeoutMillis: 30000,
      max: 10
    });

    pool.on('error', (err) => {
      console.error('[POSTGRES POOL ERROR] Unexpected error on idle client:', err.message);
    });
  }

  return pool;
};

/**
 * Initializes application schema tables in PostgreSQL if they do not exist
 */
export const initTables = async (activePool) => {
  const p = activePool || getPool();
  if (!p) {
    return;
  }

  const createTablesSql = `
    -- Customers Table
    CREATE TABLE IF NOT EXISTS customers (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(50),
      password VARCHAR(255) NOT NULL,
      address TEXT,
      city VARCHAR(100),
      pincode VARCHAR(20),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Orders Table
    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(50) PRIMARY KEY,
      order_number VARCHAR(100) UNIQUE NOT NULL,
      customer_email VARCHAR(255),
      customer_phone VARCHAR(50),
      customer_info JSONB,
      items JSONB NOT NULL,
      subtotal NUMERIC NOT NULL,
      discount NUMERIC DEFAULT 0,
      shipping NUMERIC DEFAULT 0,
      total NUMERIC NOT NULL,
      payment_method VARCHAR(50) DEFAULT 'COD',
      status VARCHAR(50) DEFAULT 'Confirmed',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Inquiries / Contact Form Table
    CREATE TABLE IF NOT EXISTS inquiries (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      message TEXT NOT NULL,
      category VARCHAR(100),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await p.query(createTablesSql);

  // Seed default demo customer if not exists
  const seedDemoUserSql = `
    INSERT INTO customers (id, name, email, phone, password, address, city, pincode)
    VALUES ('CUST-1001', 'Ramesh Sharma', 'demo@digitalnextonline.com', '9876543210', 'password123', 'B-42, Sector 62', 'Noida', '201301')
    ON CONFLICT (email) DO NOTHING;
  `;
  await p.query(seedDemoUserSql);

  console.log('[DATABASE] PostgreSQL schema tables initialized (customers, orders, inquiries).');
};

/**
 * Connect to PostgreSQL and verify connection with test query
 */
export const connectDB = async () => {
  const connectionUri = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.PG_URI;

  if (!connectionUri) {
    console.warn(
      '[DATABASE NOTICE] PostgreSQL connection URI is missing (DATABASE_URL not set).'
    );
    console.warn(
      '[DATABASE NOTICE] Running in in-memory fallback mode. Add DATABASE_URL to Render environment variables to enable persistence.'
    );
    return null;
  }

  try {
    const activePool = getPool();
    if (!activePool) return null;

    const client = await activePool.connect();

    // Verify connectivity with test query
    const res = await client.query('SELECT current_database() as db_name, NOW() as server_time, version()');
    client.release();

    const dbName = res.rows[0]?.db_name || 'postgres';
    const serverTime = res.rows[0]?.server_time;

    console.log(`[DATABASE] PostgreSQL Connected Successfully!`);
    console.log(`[DATABASE] Database: "${dbName}" | Server Time: ${serverTime}`);

    // Auto-create tables on startup
    await initTables(activePool);

    return activePool;
  } catch (error) {
    console.error(`[DATABASE ERROR] Failed to connect to PostgreSQL: ${error.message}`);
    throw error;
  }
};

/**
 * Query helper to execute SQL statements safely
 */
export const query = (text, params) => {
  const activePool = getPool();
  if (!activePool) {
    return Promise.reject(new Error('PostgreSQL not configured (running in in-memory fallback mode)'));
  }
  return activePool.query(text, params);
};

export default {
  connectDB,
  getPool,
  query,
  initTables
};
