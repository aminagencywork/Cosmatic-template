import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Star, ShieldCheck, Truck, RotateCcw, Sparkles } from 'lucide-react';
import { productService } from '../services/productService';
import { Product } from '../lib/supabase';
import { formatPrice } from '../lib/utils';
import { config } from '../config';
import ProductCard from '../components/ProductCard';

import heroProduct from '../assets/hero_makeup_image.png';

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-secondary/10 py-20 lg:py-0">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=2000"
          alt="Hero Background"
          className="w-full h-full object-cover opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 w-full mt-10 lg:mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 pt-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-4 py-1.5 bg-accent text-white text-[10px] font-bold tracking-[0.2em] uppercase rounded-full mb-6 shadow-lg shadow-accent/20">
              NEW COLLECTION 2026
            </span>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif font-bold leading-[0.9] mb-6 md:mb-8 tracking-tighter">
              Radiance <br />
              <span className="italic font-normal text-accent">Redefined.</span>
            </h1>
            <p className="text-base md:text-xl text-primary/70 mb-8 md:mb-10 max-w-md leading-relaxed">
              Discover our curated collection of premium skincare and makeup designed to enhance your natural beauty.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Link to="/shop" className="px-10 py-5 bg-primary text-white font-bold rounded-full hover:bg-accent transition-all duration-300 flex items-center justify-center gap-3 group shadow-xl hover:shadow-accent/30 hover:-translate-y-1">
                SHOP NOW
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10">
              <div className="relative rounded-[40px] overflow-hidden shadow-2xl border-8 border-white/50 backdrop-blur-sm">
                <img
                  src={heroProduct}
                  alt="Premium Cosmetic Collection"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Decorative elements */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-10 -left-10 w-28 h-28 bg-white p-4 rounded-3xl shadow-2xl z-20 flex flex-col items-center justify-center border border-neutral/20"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-2">
                  <Sparkles className="text-accent" size={24} />
                </div>
                <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest text-center">Premium Quality</span>
              </motion.div>

              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-accent/10 rounded-full blur-3xl -z-10" />
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-secondary/20 rounded-full blur-[100px] -z-20" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Categories = () => {
  const categories = [
    { name: 'Skincare', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600', count: '120+ Products' },
    { name: 'Makeup', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600', count: '250+ Products' },
    { name: 'Haircare', image: 'https://images.unsplash.com/photo-1527799822344-42ad8c03efc3?auto=format&fit=crop&q=80&w=600', count: '80+ Products' },
    { name: 'Fragrance', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600', count: '45+ Products' },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 md:mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-2 md:mb-4">Shop by Category</h2>
            <p className="text-primary/60 text-sm md:text-base">Tailored beauty solutions for every need.</p>
          </div>
          <Link to="/shop" className="text-sm font-bold border-b-2 border-accent pb-1 hover:text-accent transition-colors">
            VIEW ALL
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <Link to={`/shop?category=${cat.name}`}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-4">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-serif font-bold mb-1">{cat.name}</h3>
                    <p className="text-xs font-medium opacity-80 uppercase tracking-widest">{cat.count}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TrendingProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      const data = await productService.getTrendingProducts(8);
      setProducts(data);
      setLoading(false);
    };
    fetchTrending();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-neutral/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-accent font-bold text-[10px] md:text-xs tracking-[0.3em] uppercase mb-2 md:mb-4 block">BEST SELLERS</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold">Trending Now</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12 md:py-20">
            <div className="w-8 h-8 md:w-10 md:h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-12">
            {products.length > 0 ? products.map((product) => (
              <ProductCard key={product.id} product={product} />
            )) : (
              // Placeholder products if DB is empty
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="group">
                  <div className="aspect-[3/4] bg-neutral rounded-xl md:rounded-2xl mb-3 md:mb-4 animate-pulse" />
                  <div className="h-3 md:h-4 w-2/3 bg-neutral rounded mb-2 animate-pulse" />
                  <div className="h-3 md:h-4 w-1/3 bg-neutral rounded animate-pulse" />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    { icon: <ShieldCheck size={32} />, title: 'Authentic Products', desc: '100% genuine beauty products sourced directly.' },
    { icon: <Truck size={32} />, title: 'Fast Delivery', desc: config.freeShippingLabel },
    { icon: <RotateCcw size={32} />, title: 'Easy Returns', desc: 'Hassle-free 7-day return policy for your peace of mind.' },
    { icon: <Sparkles size={32} />, title: 'Expert Advice', desc: 'Personalized beauty consultations from our experts.' },
  ];

  return (
    <section className="py-12 md:py-20 bg-white border-y border-neutral">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
        {features.map((f, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            <div className="text-accent mb-4 md:mb-6">{f.icon}</div>
            <h4 className="font-serif font-bold text-lg md:text-xl mb-1 md:mb-2">{f.title}</h4>
            <p className="text-xs md:text-sm text-primary/60 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const HomePage = () => {
  return (
    <div className="pt-0">
      <Hero />
      <Features />
      <Categories />
      <TrendingProducts />

      {/* About Section */}
      <section className="py-16 md:py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="relative">
              <div className="aspect-square rounded-2xl md:rounded-3xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1000"
                  alt="Our Philosophy"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 md:-bottom-8 md:-right-8 w-32 h-32 md:w-64 md:h-64 bg-secondary rounded-2xl md:rounded-3xl -z-10" />
            </div>
            <div>
              <span className="text-accent font-bold text-[10px] md:text-xs tracking-[0.3em] uppercase mb-2 md:mb-4 block">OUR PHILOSOPHY</span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 md:mb-8 leading-tight">Beauty that glows from within.</h2>
              <p className="text-base md:text-lg text-primary/70 mb-6 md:mb-8 leading-relaxed">
                At {config.appName}, we believe beauty is more than skin deep. It's about confidence, self-expression, and the ritual of self-care. Our products are carefully selected to ensure they meet the highest standards of quality and ethics.
              </p>
              <div className="grid grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-10">
                <div>
                  <h5 className="font-serif font-bold text-2xl md:text-3xl mb-1">100%</h5>
                  <p className="text-[10px] md:text-xs text-primary/40 uppercase tracking-widest">Cruelty Free</p>
                </div>
                <div>
                  <h5 className="font-serif font-bold text-2xl md:text-3xl mb-1">50k+</h5>
                  <p className="text-[10px] md:text-xs text-primary/40 uppercase tracking-widest">Happy Clients</p>
                </div>
              </div>
              <Link to="/shop" className="inline-flex items-center gap-2 font-bold border-b-2 border-primary pb-1 hover:text-accent hover:border-accent transition-all text-sm md:text-base">
                LEARN MORE ABOUT US <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
