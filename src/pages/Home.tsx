import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, ArrowRight } from 'lucide-react';
import { Product, ProductCategory } from '@/types';
import { api } from '@/utils/api';
import { apiHelper } from '@/utils/api';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Hero banner data
  const heroBanners = [
    {
      id: 1,
      title: "Summer Collection 2026",
      subtitle: "Discover the latest trends in fashion",
      description: "Get up to 50% off on selected items",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
      cta: "Shop Now",
      link: "/products?category=fashion"
    },
    {
      id: 2,
      title: "Electronics Sale",
      subtitle: "Premium gadgets at unbeatable prices",
      description: "Limited time offer - Don't miss out!",
      image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&h=600&fit=crop",
      cta: "Explore Deals",
      link: "/products?category=electronics"
    },
    {
      id: 3,
      title: "Home & Living",
      subtitle: "Transform your space with style",
      description: "Free shipping on orders over $50",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=600&fit=crop",
      cta: "Shop Home",
      link: "/products?category=home"
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured products
        const productsResponse = await api.get('/products/featured');
        setFeaturedProducts(productsResponse.data.data || []);

        // Fetch categories
        const categoriesResponse = await api.get('/products/categories');
        setCategories(categoriesResponse.data.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback data for development
        setFeaturedProducts(getMockProducts());
        setCategories(getMockCategories());
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-advance hero banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        {heroBanners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <div className="relative h-full">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-2xl text-white">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                      {banner.title}
                    </h1>
                    <p className="text-xl md:text-2xl mb-2 text-secondary-200">
                      {banner.subtitle}
                    </p>
                    <p className="text-lg mb-6 text-secondary-300">
                      {banner.description}
                    </p>
                    <Link to={banner.link}>
                      <Button size="lg" className="text-lg px-8 py-3">
                        {banner.cta}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
            />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-secondary-600">
              Discover products across all categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.slug}`}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-square bg-secondary-100 overflow-hidden">
                    <img
                      src={category.image || '/placeholder-category.jpg'}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-secondary-900 mb-2">
                Featured Products
              </h2>
              <p className="text-lg text-secondary-600">
                Handpicked products for you
              </p>
            </div>
            <Link to="/products">
              <Button variant="outline">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Our Newsletter
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Get the latest updates on new products and special offers
          </p>
          <div className="max-w-md mx-auto flex space-x-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-secondary-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-primary-600 hover:bg-secondary-100">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

// Mock data for development
const getMockProducts = (): Product[] => [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 99.99,
    originalPrice: 129.99,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'],
    category: 'Electronics',
    brand: 'TechPro',
    rating: 4.5,
    reviewCount: 128,
    stock: 50,
    sku: 'TEC-001',
    tags: ['wireless', 'bluetooth', 'headphones'],
    specifications: { 'Battery Life': '20 hours', 'Connectivity': 'Bluetooth 5.0' },
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable and sustainable cotton t-shirt',
    price: 29.99,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'],
    category: 'Fashion',
    brand: 'EcoWear',
    rating: 4.2,
    reviewCount: 89,
    stock: 100,
    sku: 'FAS-002',
    tags: ['organic', 'cotton', 'sustainable'],
    specifications: { 'Material': '100% Organic Cotton', 'Fit': 'Regular' },
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Smart Fitness Watch',
    description: 'Track your fitness goals with this advanced smartwatch',
    price: 199.99,
    originalPrice: 249.99,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop'],
    category: 'Electronics',
    brand: 'FitTech',
    rating: 4.7,
    reviewCount: 256,
    stock: 30,
    sku: 'TEC-003',
    tags: ['smartwatch', 'fitness', 'tracking'],
    specifications: { 'Battery Life': '7 days', 'Water Resistance': '5ATM' },
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Ceramic Coffee Mug Set',
    description: 'Beautiful handcrafted ceramic coffee mugs',
    price: 24.99,
    images: ['https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=400&fit=crop'],
    category: 'Home',
    brand: 'ArtisanHome',
    rating: 4.4,
    reviewCount: 67,
    stock: 75,
    sku: 'HOM-004',
    tags: ['ceramic', 'coffee', 'kitchen'],
    specifications: { 'Material': 'Ceramic', 'Capacity': '12oz' },
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const getMockCategories = (): ProductCategory[] => [
  { id: '1', name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=300&h=300&fit=crop' },
  { id: '2', name: 'Fashion', slug: 'fashion', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop' },
  { id: '3', name: 'Home & Garden', slug: 'home-garden', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop' },
  { id: '4', name: 'Sports', slug: 'sports', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop' },
  { id: '5', name: 'Books', slug: 'books', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop' },
  { id: '6', name: 'Beauty', slug: 'beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop' },
  { id: '7', name: 'Toys', slug: 'toys', image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=300&h=300&fit=crop' },
  { id: '8', name: 'Automotive', slug: 'automotive', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=300&h=300&fit=crop' },
];

export default Home;
