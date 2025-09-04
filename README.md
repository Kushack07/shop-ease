# 🛍️ ShopEase - Full-Stack E-Commerce Platform

A world-class Full-Stack E-Commerce Platform built with React, TypeScript, Node.js, and PostgreSQL. This platform rivals Amazon and Flipkart with its modern UI, robust backend, and comprehensive e-commerce features.

![ShopEase Banner](https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop)

## ✨ Features

### 🎨 Frontend (React + TypeScript + Tailwind CSS)
- **High-quality UI/UX** with responsive design and modern graphics
- **Homepage** with dynamic banners, product listings, search & filters
- **Product detail pages** with image galleries, ratings, and reviews
- **Shopping cart & checkout flow** with real-time updates
- **User authentication** with JWT and social login options
- **Order tracking dashboard** with real-time status updates
- **Admin dashboard** for managing products, users, and analytics
- **Wishlist functionality** for saving favorite products
- **Advanced search** with filters and sorting options

### 🔧 Backend (Node.js + Express + PostgreSQL)
- **RESTful API endpoints** for all e-commerce operations
- **Secure JWT-based authentication** with role-based access control
- **Comprehensive database schema** for users, products, categories, orders
- **Payment integration** with Stripe (sandbox mode)
- **File upload system** with Cloudinary integration
- **Analytics API** for sales and user activity tracking
- **Rate limiting** and security middleware
- **Email notifications** for order updates

### 🚀 Advanced Features
- **Cloud storage** for product images via Cloudinary
- **Real-time inventory management**
- **Order status tracking** with notifications
- **Product reviews and ratings** system
- **Advanced filtering and search** capabilities
- **Responsive design** for all devices
- **SEO optimized** pages and meta tags

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Zustand** for state management
- **React Query** for data fetching
- **Lucide React** for icons
- **React Hook Form** for form handling
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express
- **PostgreSQL** database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **Cloudinary** for image storage
- **Stripe** for payments
- **Helmet** for security
- **CORS** for cross-origin requests

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/shopease.git
cd shopease
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies (if not already installed)
npm install
```

### 3. Environment Configuration
```bash
# Copy the example environment file
cp env.example .env

# Edit the .env file with your configuration
nano .env
```

### 4. Database Setup
```bash
# Create PostgreSQL database
createdb shopease

# The database tables will be created automatically when you start the server
```

### 5. Start the Development Servers
```bash
# Start both frontend and backend (recommended)
npm run dev:full

# Or start them separately:
# Frontend only
npm run dev

# Backend only
npm run server
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://localhost:5432/shopease

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Stripe Configuration (for payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### External Services Setup

#### 1. Cloudinary (Image Storage)
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your cloud name, API key, and API secret
3. Add them to your `.env` file

#### 2. Stripe (Payments)
1. Sign up at [Stripe](https://stripe.com/)
2. Get your test API keys
3. Add them to your `.env` file

#### 3. PostgreSQL Database
1. Install PostgreSQL on your system
2. Create a database named `shopease`
3. Update the `DATABASE_URL` in your `.env` file

## 📁 Project Structure

```
shopease/
├── src/                    # Frontend source code
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Basic UI components
│   │   ├── layout/        # Layout components
│   │   └── products/      # Product-related components
│   ├── pages/             # Page components
│   │   ├── auth/          # Authentication pages
│   │   └── admin/         # Admin dashboard pages
│   ├── store/             # State management (Zustand)
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── App.tsx            # Main app component
├── backend/               # Backend source code
│   └── server.js          # Express server
├── public/                # Static assets
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**:
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Deploy to Netlify**:
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

### Backend Deployment (Render/Heroku)

1. **Deploy to Render**:
   - Connect your GitHub repository
   - Set build command: `npm install`
   - Set start command: `node backend/server.js`

2. **Deploy to Heroku**:
   ```bash
   heroku create your-app-name
   heroku addons:create heroku-postgresql:hobby-dev
   git push heroku main
   ```

### Database Deployment

1. **Use a managed PostgreSQL service**:
   - [Supabase](https://supabase.com/)
   - [Neon](https://neon.tech/)
   - [Railway](https://railway.app/)

2. **Update your `DATABASE_URL`** in the production environment

## 🧪 Testing

```bash
# Run frontend tests
npm test

# Run backend tests
npm run test:server

# Run all tests
npm run test:all
```

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Product Endpoints
- `GET /api/products` - Get all products (with pagination)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get product details
- `GET /api/products/categories` - Get all categories

### Order Endpoints
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details

### Admin Endpoints
- `GET /api/admin/dashboard` - Get admin dashboard stats
- `GET /api/admin/products` - Get all products (admin)
- `GET /api/admin/orders` - Get all orders (admin)
- `GET /api/admin/users` - Get all users (admin)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Unsplash](https://unsplash.com/) for beautiful product images
- [Tailwind CSS](https://tailwindcss.com/) for the amazing CSS framework
- [Lucide](https://lucide.dev/) for the icon library
- [Stripe](https://stripe.com/) for payment processing
- [Cloudinary](https://cloudinary.com/) for image management

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/yourusername/shopease/issues) page
2. Create a new issue if your problem isn't already listed
3. Contact us at support@shopease.com

---

**Built with ❤️ by the ShopEase Team**
