import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Heart, Search, Instagram, Facebook, Twitter, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';

// Pages
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';

// Components
import { useCartStore } from './store/useCartStore';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-8">
          <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-1.5 md:p-2 hover:bg-neutral rounded-full transition-colors">
            <Menu size={20} className="md:w-6 md:h-6" />
          </button>
          <Link to="/" className="text-xl md:text-2xl font-serif font-bold tracking-tighter text-primary whitespace-nowrap">
            LUMIÈRE
          </Link>
          {/* <div className="hidden lg:flex items-center gap-6">
            <Link to="/shop" className="text-sm font-medium hover:text-accent transition-colors">SHOP ALL</Link>
            <Link to="/shop?category=Skincare" className="text-sm font-medium hover:text-accent transition-colors">SKINCARE</Link>
            <Link to="/shop?category=Makeup" className="text-sm font-medium hover:text-accent transition-colors">MAKEUP</Link>
            <Link to="/shop?category=Haircare" className="text-sm font-medium hover:text-accent transition-colors">HAIRCARE</Link>
          </div> */}
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-neutral rounded-full transition-colors hidden sm:block">
            <Search size={20} />
          </button>
          <Link to="/admin" className="p-2 hover:bg-neutral rounded-full transition-colors">
            <User size={20} />
          </Link>
          <Link to="/cart" className="p-2 hover:bg-neutral rounded-full transition-colors relative">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-accent text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white z-[70] p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-serif font-bold">LUMIÈRE</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-neutral rounded-full">
                  <X size={24} />
                </button>
              </div>
              <div className="flex flex-col gap-6">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium border-b border-neutral pb-2">HOME</Link>
                <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium border-b border-neutral pb-2">SHOP ALL</Link>
                <Link to="/shop?category=Skincare" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium border-b border-neutral pb-2">SKINCARE</Link>
                <Link to="/shop?category=Makeup" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium border-b border-neutral pb-2">MAKEUP</Link>
                <Link to="/shop?category=Haircare" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium border-b border-neutral pb-2">HAIRCARE</Link>
                <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium border-b border-neutral pb-2">ADMIN PANEL</Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div>
          <h3 className="text-2xl font-serif font-bold mb-6 tracking-tighter">LUMIÈRE</h3>
          <p className="text-white/60 text-sm leading-relaxed mb-6">
            Elevating beauty through science and nature. Our curated collection of premium cosmetics is designed to make you feel as radiant as you look.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-all">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-all">
              <Facebook size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-all">
              <Twitter size={18} />
            </a>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-6">SHOP</h4>
          <ul className="space-y-4 text-sm text-white/60">
            <li><Link to="/shop?category=Skincare" className="hover:text-white transition-colors">Skincare</Link></li>
            <li><Link to="/shop?category=Makeup" className="hover:text-white transition-colors">Makeup</Link></li>
            <li><Link to="/shop?category=Haircare" className="hover:text-white transition-colors">Haircare</Link></li>
            <li><Link to="/shop?category=Fragrance" className="hover:text-white transition-colors">Fragrance</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-6">SUPPORT</h4>
          <ul className="space-y-4 text-sm text-white/60">
            <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-6">CONTACT</h4>
          <ul className="space-y-4 text-sm text-white/60">
            <li className="flex items-center gap-3">
              <Phone size={16} />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-3">
              <Instagram size={16} />
              <span>@lumiere.beauty</span>
            </li>
            <li className="mt-6">
              <p className="text-xs uppercase tracking-widest text-white/40 mb-2">Visit Us</p>
              <p>123 Beauty Lane, Fashion District<br />Mumbai, MH 400001</p>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
        <p>© 2026 Lumière Beauty. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-white transition-colors">PRIVACY</a>
          <a href="#" className="hover:text-white transition-colors">TERMS</a>
          <a href="#" className="hover:text-white transition-colors">COOKIES</a>
        </div>
      </div>
    </footer>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ProductListingPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
