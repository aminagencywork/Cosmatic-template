import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCartStore } from '../store/useCartStore';
import { formatPrice, generateWhatsAppLink } from '../lib/utils';
import { config } from '../config';

const CartPage = () => {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const total = getTotal();
  const shipping = total > config.shippingThreshold ? 0 : 99;
  
  const handleWhatsAppOrder = () => {
    const phone = config.whatsappNumber;
    const shopName = config.appName;
    const link = generateWhatsAppLink(phone, items, shopName);
    window.open(link, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="pt-40 pb-20 text-center px-4">
        <div className="w-24 h-24 bg-neutral rounded-full flex items-center justify-center mx-auto mb-8 text-primary/20">
          <ShoppingBag size={48} />
        </div>
        <h1 className="text-4xl font-serif font-bold mb-4">Your bag is empty</h1>
        <p className="text-primary/60 mb-10 max-w-md mx-auto">Looks like you haven't added anything to your bag yet. Start exploring our premium collection.</p>
        <Link to="/shop" className="inline-flex items-center gap-2 px-10 py-4 bg-primary text-white rounded-full font-bold hover:bg-accent transition-all">
          START SHOPPING <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-serif font-bold mb-12">Your Bag ({items.length})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div 
                  key={`${item.id}-${item.shade}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex gap-6 pb-8 border-b border-neutral group"
                >
                  <div className="w-24 sm:w-32 aspect-[3/4] rounded-2xl overflow-hidden bg-neutral flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-grow flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-lg group-hover:text-accent transition-colors">{item.name}</h3>
                        <button 
                          onClick={() => removeItem(item.id, item.shade)}
                          className="p-2 text-primary/20 hover:text-accent transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      {item.shade && (
                        <p className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-4">SHADE: {item.shade}</p>
                      )}
                      <p className="font-bold text-lg">{formatPrice(item.price)}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-4 border border-neutral rounded-xl p-1">
                        <button 
                          onClick={() => updateQuantity(item.id, item.shade, item.quantity - 1)}
                          className="p-2 hover:bg-neutral rounded-lg transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.shade, item.quantity + 1)}
                          className="p-2 hover:bg-neutral rounded-lg transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-neutral/50 rounded-3xl p-8 sticky top-32">
              <h2 className="text-2xl font-serif font-bold mb-8">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-primary/60">Subtotal</span>
                  <span className="font-bold">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-primary/60">Shipping</span>
                  <span className="font-bold">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] text-accent font-bold uppercase tracking-widest">
                    Add {formatPrice(config.shippingThreshold - total)} more for FREE shipping
                  </p>
                )}
                <div className="pt-4 border-t border-neutral flex justify-between items-end">
                  <span className="font-bold">Total</span>
                  <span className="text-2xl font-bold text-accent">{formatPrice(total + shipping)}</span>
                </div>
              </div>

              <button 
                onClick={handleWhatsAppOrder}
                className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-600/20 mb-4"
              >
                <MessageCircle size={20} />
                ORDER VIA WHATSAPP
              </button>
              
              <p className="text-[10px] text-center text-primary/40 uppercase tracking-widest leading-relaxed">
                By clicking "Order via WhatsApp", you will be redirected to WhatsApp to complete your purchase.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
