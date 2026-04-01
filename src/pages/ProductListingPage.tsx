import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, ChevronDown, SlidersHorizontal, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { productService } from '../services/productService';
import { Product } from '../lib/supabase';
import { formatPrice } from '../lib/utils';
import ProductCard from '../components/ProductCard';

const ProductListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Filter states
  const category = searchParams.get('category') || 'All';
  const brand = searchParams.get('brand') || 'All';
  const skinType = searchParams.get('skinType') || 'All';
  const sortBy = searchParams.get('sort') || 'newest';

  const categories = ['All', 'Skincare', 'Makeup', 'Haircare', 'Fragrance'];
  const skinTypes = ['All', 'Oily', 'Dry', 'Combination', 'Sensitive'];
  const brands = ['All', 'Lumière Essentials', 'Glow Lab', 'Pure Bloom', 'Velvet Touch'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await productService.getAllProducts({
        category,
        brand,
        skinType,
        sort: sortBy
      });
      setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, [category, brand, skinType, sortBy]);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'All') newParams.delete(key);
    else newParams.set(key, value);
    setSearchParams(newParams);
  };

  return (
    <div className="pt-24 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-2 md:mb-4">{category === 'All' ? 'Shop All' : category}</h1>
          <p className="text-sm md:text-base text-primary/60">Discover our collection of {products.length} premium beauty products.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0 space-y-10">
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest mb-6">Categories</h4>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateFilter('category', cat)}
                    className={`block text-sm transition-colors ${category === cat ? 'text-accent font-bold' : 'text-primary/60 hover:text-primary'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest mb-6">Skin Type</h4>
              <div className="space-y-3">
                {skinTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => updateFilter('skinType', type)}
                    className={`block text-sm transition-colors ${skinType === type ? 'text-accent font-bold' : 'text-primary/60 hover:text-primary'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest mb-6">Brands</h4>
              <div className="space-y-3">
                {brands.map((b) => (
                  <button
                    key={b}
                    onClick={() => updateFilter('brand', b)}
                    className={`block text-sm transition-colors ${brand === b ? 'text-accent font-bold' : 'text-primary/60 hover:text-primary'}`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-grow">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral">
              <button 
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 text-sm font-bold"
              >
                <Filter size={18} /> FILTERS
              </button>
              
              <div className="hidden lg:flex items-center gap-4 text-xs text-primary/40 uppercase tracking-widest">
                <span>Showing {products.length} results</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary/40 uppercase tracking-widest hidden sm:inline">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="text-sm font-bold bg-transparent outline-none cursor-pointer"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-12">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-neutral rounded-xl md:rounded-2xl mb-3 md:mb-4" />
                    <div className="h-3 md:h-4 w-2/3 bg-neutral rounded mb-2" />
                    <div className="h-3 md:h-4 w-1/3 bg-neutral rounded" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-12">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-2xl font-serif font-bold mb-2">No products found</h3>
                <p className="text-primary/60 mb-8">Try adjusting your filters or search terms.</p>
                <button 
                  onClick={() => setSearchParams({})}
                  className="px-8 py-3 bg-primary text-white rounded-full font-bold"
                >
                  CLEAR ALL FILTERS
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 h-[80vh] bg-white z-[70] rounded-t-3xl p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-serif font-bold">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-neutral rounded-full">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-10">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-widest mb-4">Category</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => updateFilter('category', cat)}
                        className={`px-4 py-2 rounded-full text-sm border transition-all ${category === cat ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-neutral'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-xs uppercase tracking-widest mb-4">Skin Type</h4>
                  <div className="flex flex-wrap gap-2">
                    {skinTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => updateFilter('skinType', type)}
                        className={`px-4 py-2 rounded-full text-sm border transition-all ${skinType === type ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-neutral'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-xs uppercase tracking-widest mb-4">Brand</h4>
                  <div className="flex flex-wrap gap-2">
                    {brands.map((b) => (
                      <button
                        key={b}
                        onClick={() => updateFilter('brand', b)}
                        className={`px-4 py-2 rounded-full text-sm border transition-all ${brand === b ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-neutral'}`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold mt-12"
              >
                APPLY FILTERS
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductListingPage;
