import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import { fileURLToPath } from 'url';
import { createNebulaRouter } from './routes/nebulaSync.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/shopease',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

// Database initialization
const initializeDatabase = async () => {
  try {
    // Create tables if they don't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        avatar VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        image VARCHAR(500),
        parent_id INTEGER REFERENCES categories(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        original_price DECIMAL(10,2),
        images TEXT[],
        category_id INTEGER REFERENCES categories(id),
        brand VARCHAR(100),
        rating DECIMAL(3,2) DEFAULT 0,
        review_count INTEGER DEFAULT 0,
        stock INTEGER DEFAULT 0,
        sku VARCHAR(100) UNIQUE,
        tags TEXT[],
        specifications JSONB,
        is_active BOOLEAN DEFAULT true,
        is_featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        total DECIMAL(10,2) NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        tax DECIMAL(10,2) DEFAULT 0,
        shipping DECIMAL(10,2) DEFAULT 0,
        discount DECIMAL(10,2) DEFAULT 0,
        status VARCHAR(50) DEFAULT 'pending',
        payment_status VARCHAR(50) DEFAULT 'pending',
        payment_method VARCHAR(100),
        shipping_address JSONB,
        tracking_number VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id),
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        title VARCHAR(255),
        comment TEXT,
        images TEXT[],
        is_verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS wishlist (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS wallet_rewards (
        user_id INTEGER REFERENCES users(id),
        wallet_address VARCHAR(255) PRIMARY KEY,
        stardust_balance INTEGER DEFAULT 0,
        last_sync TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS transaction_logs (
        tx_id VARCHAR(255) PRIMARY KEY,
        wallet_address VARCHAR(255) REFERENCES wallet_rewards(wallet_address),
        amount INTEGER NOT NULL,
        action_type VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Initialize database
initializeDatabase();

// Routes

// Mount secure webhook pipeline for Nebula integration
app.use('/api/v1/nebula', createNebulaRouter(pool));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Authentication routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name, role, created_at',
      [email, passwordHash, firstName, lastName]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          createdAt: user.created_at,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          avatar: user.avatar,
          createdAt: user.created_at,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Products routes
app.get('/api/products', async (req, res) => {
  try {
    const { page = 1, limit = 12, category, search, sortBy = 'created_at', sortOrder = 'desc' } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM products WHERE is_active = true';
    const params = [];
    let paramCount = 0;

    if (category) {
      paramCount++;
      query += ` AND category_id = (SELECT id FROM categories WHERE slug = $${paramCount})`;
      params.push(category);
    }

    if (search) {
      paramCount++;
      query += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
    query += ` LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const products = result.rows;

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM products WHERE is_active = true';
    if (category || search) {
      countQuery = countQuery.replace('WHERE', 'WHERE');
      if (category) {
        countQuery += ` AND category_id = (SELECT id FROM categories WHERE slug = '${category}')`;
      }
      if (search) {
        countQuery += ` AND (name ILIKE '%${search}%' OR description ILIKE '%${search}%')`;
      }
    }
    const countResult = await pool.query(countQuery);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/products/featured', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM products WHERE is_featured = true AND is_active = true ORDER BY created_at DESC LIMIT 8'
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Featured products error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = $1 AND p.is_active = true',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Product detail error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Categories routes
app.get('/api/products/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// File upload route
app.post('/api/upload/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'shopease',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    res.json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ success: false, message: 'Image upload failed' });
  }
});

// Protected routes
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, first_name, last_name, role, avatar, created_at FROM users WHERE id = $1', [req.user.userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = result.rows[0];
    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Admin routes
app.get('/api/admin/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Get basic stats
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    const productCount = await pool.query('SELECT COUNT(*) FROM products');
    const orderCount = await pool.query('SELECT COUNT(*) FROM orders');
    const totalSales = await pool.query('SELECT COALESCE(SUM(total), 0) FROM orders WHERE status = \'delivered\'');

    res.json({
      success: true,
      data: {
        stats: {
          users: parseInt(userCount.rows[0].count),
          products: parseInt(productCount.rows[0].count),
          orders: parseInt(orderCount.rows[0].count),
          sales: parseFloat(totalSales.rows[0].coalesce),
        },
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Nebula Integration Routes
app.post('/api/integration/link-wallet', async (req, res) => {
  try {
    const { email, wallet_address } = req.body;

    // Find user by email
    const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const userId = userResult.rows[0].id;

    // Insert or update wallet
    await pool.query(
      `INSERT INTO wallet_rewards (user_id, wallet_address) 
       VALUES ($1, $2) 
       ON CONFLICT (wallet_address) 
       DO UPDATE SET user_id = $1`,
      [userId, wallet_address]
    );

    res.json({ success: true, message: 'Wallet linked successfully' });
  } catch (error) {
    console.error('Link wallet error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/api/integration/sync-rewards', async (req, res) => {
  try {
    const { wallet_address, stardust_earned } = req.body;

    const result = await pool.query(
      `UPDATE wallet_rewards 
       SET stardust_balance = stardust_balance + $1, last_sync = CURRENT_TIMESTAMP 
       WHERE wallet_address = $2 
       RETURNING stardust_balance`,
      [stardust_earned, wallet_address]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Wallet not found. Link wallet first.' });
    }

    res.json({ success: true, balance: result.rows[0].stardust_balance });
  } catch (error) {
    console.error('Sync rewards error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/api/integration/redeem', async (req, res) => {
  try {
    const { wallet_address, product_id, stardust_cost } = req.body;

    // Verification 1: Get wallet and user
    const walletResult = await pool.query('SELECT user_id, stardust_balance FROM wallet_rewards WHERE wallet_address = $1', [wallet_address]);
    if (walletResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Wallet not found' });
    }

    const { user_id, stardust_balance } = walletResult.rows[0];

    if (stardust_balance < stardust_cost) {
      return res.status(400).json({ success: false, message: 'Insufficient stardust balance' });
    }

    // Verification 2: Get product
    const productResult = await pool.query('SELECT price FROM products WHERE id = $1 AND is_active = true', [product_id]);
    if (productResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found or inactive' });
    }

    // Begin Transaction
    await pool.query('BEGIN');

    // 1. Deduct Stardust
    await pool.query(
      'UPDATE wallet_rewards SET stardust_balance = stardust_balance - $1 WHERE wallet_address = $2',
      [stardust_cost, wallet_address]
    );

    // 2. Create Order
    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, total, subtotal, status, payment_status, payment_method) 
       VALUES ($1, $2, $2, 'processing', 'paid', 'stardust_points') RETURNING id`,
      [user_id, 0] // 0 total because paid via points
    );
    const orderId = orderResult.rows[0].id;

    // 3. Create Order Item
    await pool.query(
      'INSERT INTO order_items (order_id, product_id, quantity, price, total) VALUES ($1, $2, 1, $3, $3)',
      [orderId, product_id, productResult.rows[0].price]
    );

    // Commit Transaction
    await pool.query('COMMIT');

    res.json({
      success: true,
      message: 'Product redeemed successfully',
      order_id: orderId,
      remaining_balance: stardust_balance - stardust_cost
    });

  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Redeem error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
