import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingBag, Heart, Share2, ChevronRight, Star, Minus, Plus, Check, Info, ShieldCheck, Truck } from 'lucide-react';
import { productService } from '../services/productService';
import { Product } from '../lib/supabase';
import { formatPrice, cn } from '../lib/utils';
import { useCartStore } from '../store/useCartStore';
import { toast } from 'sonner';
import ProductCard from '../components/ProductCard';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedShade, setSelectedShade] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      const data = await productService.getProductById(id);
      
      if (data) {
        setProduct(data);
        if (data.shades && data.shades.length > 0) {
          setSelectedShade(data.shades[0]);
        }
        
        // Fetch similar products
        const similar = await productService.getSimilarProducts(data, 4);
        setSimilarProducts(similar);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      shade: selectedShade || undefined,
      quantity: quantity
    });
    
    toast.success('Added to cart', {
      description: `${product.name} has been added to your bag.`,
      action: {
        label: 'View Cart',
        onClick: () => window.location.href = '/cart'
      }
    });
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 flex justify-center">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-20 text-center">
        <h2 className="text-3xl font-serif font-bold mb-4">Product not found</h2>
        <Link to="/shop" className="text-accent font-bold">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="pt-20 md:pt-24 pb-12 md:pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] md:text-xs font-medium text-primary/40 uppercase tracking-widest mb-6 md:mb-8">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight size={10} className="md:w-3 md:h-3" />
          <Link to="/shop" className="hover:text-primary">Shop</Link>
          <ChevronRight size={10} className="md:w-3 md:h-3" />
          <Link to={`/shop?category=${product.category}`} className="hover:text-primary">{product.category}</Link>
          <ChevronRight size={10} className="md:w-3 md:h-3" />
          <span className="text-primary truncate max-w-[100px] md:max-w-none">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 mb-16 md:mb-24">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden bg-neutral relative group">
              <img 
                src={product.images[selectedImage] || 'https://picsum.photos/seed/beauty/800/1000'} 
                alt={product.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button className="absolute top-4 right-4 md:top-6 md:right-6 p-2 md:p-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100">
                <Heart size={18} className="md:w-5 md:h-5" />
              </button>
            </div>
            <div className="flex lg:grid lg:grid-cols-4 gap-3 md:gap-4 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={cn(
                    "flex-shrink-0 w-20 h-20 md:w-auto md:h-auto aspect-square rounded-xl overflow-hidden border-2 transition-all",
                    selectedImage === idx ? "border-accent" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-6 md:mb-8">
              <span className="text-accent font-bold text-[10px] md:text-xs tracking-[0.3em] uppercase mb-2 md:mb-4 block">{product.brand}</span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-3 md:mb-4 leading-tight">{product.name}</h1>
              <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="flex items-center gap-1 text-accent">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} className="md:w-4 md:h-4" fill={i <= 4 ? "currentColor" : "none"} />)}
                  <span className="text-[10px] md:text-xs font-bold text-primary ml-1">4.8 (120 reviews)</span>
                </div>
                <span className="text-neutral-400 hidden sm:inline">|</span>
                <span className="text-[10px] md:text-xs font-bold text-green-600">IN STOCK</span>
              </div>
              <div className="flex items-center gap-3 md:gap-4">
                <span className="text-2xl md:text-3xl font-bold">{formatPrice(product.price)}</span>
                {product.original_price > product.price && (
                  <>
                    <span className="text-lg md:text-xl text-primary/40 line-through">{formatPrice(product.original_price)}</span>
                    <span className="px-2 py-1 bg-accent/10 text-accent text-[9px] md:text-[10px] font-bold rounded tracking-tighter">SAVE {product.discount}%</span>
                  </>
                )}
              </div>
            </div>

            <p className="text-sm md:text-base text-primary/70 leading-relaxed mb-8 md:mb-10">
              {product.description}
            </p>

            {/* Shade Selector */}
            {product.shades && product.shades.length > 0 && (
              <div className="mb-8 md:mb-10">
                <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-widest mb-3 md:mb-4">Select Shade: <span className="text-primary/40 font-medium">{selectedShade}</span></h4>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {product.shades.map((shade) => (
                    <button
                      key={shade}
                      onClick={() => setSelectedShade(shade)}
                      className={cn(
                        "px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm border transition-all",
                        selectedShade === shade ? "bg-primary text-white border-primary" : "bg-white text-primary border-neutral hover:border-primary"
                      )}
                    >
                      {shade}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-8 md:mb-10">
              <div className="flex items-center justify-between border border-neutral rounded-xl md:rounded-2xl p-1 w-full sm:w-32">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 md:p-3 hover:bg-neutral rounded-lg md:rounded-xl transition-colors"
                >
                  <Minus size={14} className="md:w-4 md:h-4" />
                </button>
                <span className="font-bold text-sm md:text-base">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 md:p-3 hover:bg-neutral rounded-lg md:rounded-xl transition-colors"
                >
                  <Plus size={14} className="md:w-4 md:h-4" />
                </button>
              </div>
              <button 
                onClick={handleAddToCart}
                className="flex-grow py-3.5 md:py-4 bg-primary text-white rounded-xl md:rounded-2xl text-sm md:text-base font-bold hover:bg-accent transition-all flex items-center justify-center gap-3"
              >
                <ShoppingBag size={18} className="md:w-5 md:h-5" />
                ADD TO BAG
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 md:gap-6 pt-8 md:pt-10 border-t border-neutral">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="p-2 md:p-3 bg-neutral rounded-lg md:rounded-xl text-accent flex-shrink-0"><Truck size={18} className="md:w-5 md:h-5" /></div>
                <div>
                  <h5 className="text-xs md:text-sm font-bold mb-0.5 md:mb-1">Free Shipping</h5>
                  <p className="text-[10px] md:text-xs text-primary/40">On orders over ₹999</p>
                </div>
              </div>
              <div className="flex items-start gap-3 md:gap-4">
                <div className="p-2 md:p-3 bg-neutral rounded-lg md:rounded-xl text-accent flex-shrink-0"><ShieldCheck size={18} className="md:w-5 md:h-5" /></div>
                <div>
                  <h5 className="text-xs md:text-sm font-bold mb-0.5 md:mb-1">Secure Payment</h5>
                  <p className="text-[10px] md:text-xs text-primary/40">100% safe checkout</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-16 md:mb-24">
          <div className="flex border-b border-neutral mb-6 md:mb-8 overflow-x-auto scrollbar-hide">
            <button className="px-6 md:px-8 py-3 md:py-4 text-xs md:text-sm font-bold border-b-2 border-primary whitespace-nowrap">INGREDIENTS</button>
            <button className="px-6 md:px-8 py-3 md:py-4 text-xs md:text-sm font-bold text-primary/40 hover:text-primary transition-colors whitespace-nowrap">HOW TO USE</button>
            <button className="px-6 md:px-8 py-3 md:py-4 text-xs md:text-sm font-bold text-primary/40 hover:text-primary transition-colors whitespace-nowrap">BENEFITS</button>
          </div>
          <div className="max-w-3xl">
            <p className="text-sm md:text-base text-primary/70 leading-relaxed">
              {product.ingredients || "Aqua, Glycerin, Butylene Glycol, Niacinamide, Sodium Hyaluronate, Centella Asiatica Extract, Polygonum Cuspidatum Root Extract, Scutellaria Baicalensis Root Extract, Camellia Sinensis Leaf Extract, Glycyrrhiza Glabra (Licorice) Root Extract, Chamomilla Recutita (Matricaria) Flower Extract, Rosmarinus Officinalis (Rosemary) Leaf Extract, Adenosine, Panthenol, Allantoin, Carbomer, Arginine, PEG-60 Hydrogenated Castor Oil, Disodium EDTA, Phenoxyethanol, Fragrance."}
            </p>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-8 md:mb-12">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
