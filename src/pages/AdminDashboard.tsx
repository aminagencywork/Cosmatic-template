import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Image as ImageIcon, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ChevronRight,
  ExternalLink,
  ShoppingBag,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase, Product, Banner } from '../lib/supabase';
import { formatPrice, cn } from '../lib/utils';
import { config as appConfig } from '../config';

// Sub-components
const DashboardHome = () => {
  const [stats, setStats] = useState({ products: 0, banners: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const { count: pCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
      const { count: bCount } = await supabase.from('banners').select('*', { count: 'exact', head: true });
      setStats({ products: pCount || 0, banners: bCount || 0 });
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-serif font-bold">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-neutral">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center mb-4 md:mb-6">
            <Package size={20} className="md:w-6 md:h-6" />
          </div>
          <p className="text-[10px] md:text-xs font-bold text-primary/40 uppercase tracking-widest mb-1">Total Products</p>
          <h3 className="text-3xl md:text-4xl font-bold">{stats.products}</h3>
        </div>
        <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-neutral">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center mb-4 md:mb-6">
            <ImageIcon size={20} className="md:w-6 md:h-6" />
          </div>
          <p className="text-[10px] md:text-xs font-bold text-primary/40 uppercase tracking-widest mb-1">Active Banners</p>
          <h3 className="text-3xl md:text-4xl font-bold">{stats.banners}</h3>
        </div>
        <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-neutral">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center mb-4 md:mb-6">
            <ShoppingBag size={20} className="md:w-6 md:h-6" />
          </div>
          <p className="text-[10px] md:text-xs font-bold text-primary/40 uppercase tracking-widest mb-1">Orders Tracked</p>
          <h3 className="text-3xl md:text-4xl font-bold">0</h3>
        </div>
      </div>

      <div className="bg-primary text-white p-6 md:p-10 rounded-2xl md:rounded-3xl relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-3 md:mb-4">Welcome to {appConfig.appName} Admin</h2>
          <p className="text-sm md:text-base text-white/60 mb-6 md:mb-8 leading-relaxed">Manage your premium cosmetic store with ease. Add new products, update banners, and configure your shop settings from this central hub.</p>
          <Link to="/admin/dashboard/products/new" className="px-6 md:px-8 py-2.5 md:py-3 bg-white text-primary rounded-full text-sm md:text-base font-bold hover:bg-accent hover:text-white transition-all inline-flex items-center gap-2">
            ADD NEW PRODUCT <Plus size={16} className="md:w-4 md:h-4" />
          </Link>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </div>
    </div>
  );
};

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error && data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      toast.success('Product deleted');
      fetchProducts();
    } else {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-serif font-bold">Product Management</h1>
        <Link to="/admin/dashboard/products/new" className="px-5 md:px-6 py-2.5 md:py-3 bg-primary text-white rounded-xl md:rounded-2xl text-sm md:text-base font-bold flex items-center justify-center gap-2 hover:bg-accent transition-all">
          <Plus size={18} /> ADD PRODUCT
        </Link>
      </div>

      <div className="bg-white rounded-2xl md:rounded-3xl border border-neutral overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="bg-neutral/30 border-b border-neutral">
                <th className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary/60">Product</th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary/60">Category</th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary/60">Price</th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary/60">Brand</th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary/60 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral">
              {loading ? (
                <tr><td colSpan={5} className="px-4 md:px-6 py-8 md:py-12 text-center text-primary/40">Loading products...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={5} className="px-4 md:px-6 py-8 md:py-12 text-center text-primary/40">No products found.</td></tr>
              ) : products.map((p) => (
                <tr key={p.id} className="hover:bg-neutral/10 transition-colors">
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <div className="flex items-center gap-3 md:gap-4">
                      <img src={p.images[0]} alt={p.name} className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover bg-neutral" referrerPolicy="no-referrer" />
                      <span className="font-bold text-xs md:text-sm truncate max-w-[150px] md:max-w-none">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-primary/60">{p.category}</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 font-bold text-xs md:text-sm">{formatPrice(p.price)}</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-primary/60">{p.brand}</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                    <div className="flex items-center justify-end gap-1 md:gap-2">
                      <Link to={`/product/${p.id}`} target="_blank" className="p-1.5 md:p-2 hover:bg-neutral rounded-lg transition-colors text-primary/40 hover:text-primary">
                        <ExternalLink size={16} className="md:w-[18px] md:h-[18px]" />
                      </Link>
                      <button className="p-1.5 md:p-2 hover:bg-neutral rounded-lg transition-colors text-primary/40 hover:text-blue-500">
                        <Edit2 size={16} className="md:w-[18px] md:h-[18px]" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 md:p-2 hover:bg-neutral rounded-lg transition-colors text-primary/40 hover:text-accent">
                        <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ProductForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    original_price: '',
    discount: '0',
    description: '',
    ingredients: '',
    images: [] as string[],
    skin_types: [] as string[],
    shades: [] as string[]
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('products').select('category');
      if (data) {
        const uniqueCategories = Array.from(new Set(data.map(p => p.category))).filter(Boolean);
        setCategories(uniqueCategories);
      }
    };
    fetchCategories();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files) as File[];
    setImageFiles(prev => [...prev, ...files]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
    
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
    
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const uploadImagesToSupabase = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    // Check if Supabase is properly configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Settings.');
    }

    for (const file of imageFiles) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          if (uploadError.message?.includes('not found')) {
            throw new Error('Storage bucket "products" not found. Please create it in your Supabase dashboard.');
          } else {
            throw new Error(`Upload failed for ${file.name}: ${uploadError.message}`);
          }
        }

        const { data } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);
        
        if (data?.publicUrl) {
          uploadedUrls.push(data.publicUrl);
        }
      } catch (err: any) {
        throw new Error(err.message || `Network error uploading ${file.name}.`);
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageFiles.length === 0 && formData.images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }
    
    setLoading(true);

    try {
      // 1. Upload new images to Supabase Storage
      let finalImageUrls = [...formData.images];
      if (imageFiles.length > 0) {
        toast.info('Uploading images to Supabase...');
        const newUploadedUrls = await uploadImagesToSupabase();
        finalImageUrls = [...finalImageUrls, ...newUploadedUrls];
      }

      // 2. Prepare product data
      const productData = {
        ...formData,
        images: finalImageUrls,
        price: parseFloat(formData.price),
        original_price: parseFloat(formData.original_price || formData.price),
        discount: parseInt(formData.discount),
      };

      // 3. Insert into database
      const { error } = await supabase.from('products').insert([productData]);

      if (!error) {
        toast.success('Product created successfully');
        navigate('/admin/dashboard/products');
      } else {
        throw new Error('Failed to create product: ' + error.message);
      }
    } catch (err: any) {
      console.error('Submit error:', err);
      toast.error(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleSkinType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      skin_types: prev.skin_types.includes(type) 
        ? prev.skin_types.filter(t => t !== type)
        : [...prev.skin_types, type]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/dashboard/products" className="p-2 hover:bg-neutral rounded-full transition-colors">
          <X size={24} />
        </Link>
        <h1 className="text-3xl font-serif font-bold">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl md:rounded-3xl border border-neutral p-6 md:p-10 space-y-8 md:space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-4 md:space-y-6">
            <div>
              <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Product Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 md:px-6 py-3 md:py-4 bg-neutral rounded-xl md:rounded-2xl border-none focus:ring-2 focus:ring-accent outline-none text-sm md:text-base"
              />
            </div>
            <div>
              <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Brand</label>
              <input 
                type="text" 
                required
                value={formData.brand}
                onChange={e => setFormData({...formData, brand: e.target.value})}
                className="w-full px-4 md:px-6 py-3 md:py-4 bg-neutral rounded-xl md:rounded-2xl border-none focus:ring-2 focus:ring-accent outline-none text-sm md:text-base"
              />
            </div>
            <div>
              <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Category</label>
              <input 
                type="text" 
                required
                list="category-suggestions"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                placeholder="Type or select category..."
                className="w-full px-4 md:px-6 py-3 md:py-4 bg-neutral rounded-xl md:rounded-2xl border-none focus:ring-2 focus:ring-accent outline-none text-sm md:text-base"
              />
              <datalist id="category-suggestions">
                {categories.map(cat => (
                  <option key={cat} value={cat} />
                ))}
                <option value="Skincare" />
                <option value="Makeup" />
                <option value="Haircare" />
                <option value="Fragrance" />
              </datalist>
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Price (₹)</label>
                <input 
                  type="number" 
                  required
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  className="w-full px-4 md:px-6 py-3 md:py-4 bg-neutral rounded-xl md:rounded-2xl border-none focus:ring-2 focus:ring-accent outline-none text-sm md:text-base"
                />
              </div>
              <div>
                <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Original Price</label>
                <input 
                  type="number" 
                  value={formData.original_price}
                  onChange={e => setFormData({...formData, original_price: e.target.value})}
                  className="w-full px-4 md:px-6 py-3 md:py-4 bg-neutral rounded-xl md:rounded-2xl border-none focus:ring-2 focus:ring-accent outline-none text-sm md:text-base"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Discount (%)</label>
              <input 
                type="number" 
                value={formData.discount}
                onChange={e => setFormData({...formData, discount: e.target.value})}
                className="w-full px-4 md:px-6 py-3 md:py-4 bg-neutral rounded-xl md:rounded-2xl border-none focus:ring-2 focus:ring-accent outline-none text-sm md:text-base"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary/60 mb-4">Skin Types</label>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {['Oily', 'Dry', 'Combination', 'Sensitive', 'All Skin Types'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => toggleSkinType(type)}
                className={cn(
                  "px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-bold border transition-all",
                  formData.skin_types.includes(type) ? "bg-primary text-white border-primary" : "bg-white text-primary border-neutral"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Description</label>
          <textarea 
            rows={4}
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 md:px-6 py-3 md:py-4 bg-neutral rounded-xl md:rounded-2xl border-none focus:ring-2 focus:ring-accent outline-none resize-none text-sm md:text-base"
          />
        </div>

        <div>
          <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary/60 mb-4">Product Images</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 mb-4">
            {/* Existing Images */}
            {formData.images.map((img, idx) => (
              <div key={`existing-${idx}`} className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden bg-neutral group">
                <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <button 
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 p-1 bg-accent text-white rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            
            {/* Local Previews */}
            {imagePreviews.map((preview, idx) => (
              <div key={`preview-${idx}`} className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden bg-neutral group border-2 border-accent/20">
                <img src={preview} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <span className="text-[8px] md:text-[10px] font-bold text-white uppercase tracking-widest bg-accent px-2 py-1 rounded">Pending Upload</span>
                </div>
                <button 
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 p-1 bg-accent text-white rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            <label className="aspect-square rounded-xl md:rounded-2xl border-2 border-dashed border-neutral flex flex-col items-center justify-center cursor-pointer hover:border-accent transition-colors">
              <ImageIcon size={20} className="md:w-6 md:h-6 text-primary/20 mb-1 md:mb-2" />
              <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-primary/40">Upload</span>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
              />
            </label>
          </div>
          {loading && imageFiles.length > 0 && <p className="text-[10px] md:text-xs text-accent animate-pulse font-bold">Uploading images to Supabase...</p>}
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-4 md:py-5 bg-primary text-white rounded-xl md:rounded-2xl font-bold hover:bg-accent transition-all disabled:opacity-50 text-sm md:text-base"
        >
          {loading ? 'PROCESSING...' : 'SAVE PRODUCT'}
        </button>
      </form>
    </div>
  );
};

const BannerManagement = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBannerUrl, setNewBannerUrl] = useState('');

  const fetchBanners = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('banners').select('*');
    if (!error && data) setBanners(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleAddBanner = async () => {
    if (!newBannerUrl) return;
    const { error } = await supabase.from('banners').insert([{ image_url: newBannerUrl, is_active: true }]);
    if (!error) {
      toast.success('Banner added');
      setNewBannerUrl('');
      fetchBanners();
    }
  };

  const toggleBanner = async (id: string, active: boolean) => {
    const { error } = await supabase.from('banners').update({ is_active: !active }).eq('id', id);
    if (!error) fetchBanners();
  };

  const deleteBanner = async (id: string) => {
    const { error } = await supabase.from('banners').delete().eq('id', id);
    if (!error) fetchBanners();
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <h1 className="text-2xl md:text-3xl font-serif font-bold">Banner Management</h1>
      <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl border border-neutral flex flex-col sm:flex-row gap-4">
        <input 
          type="url" 
          placeholder="Banner Image URL" 
          value={newBannerUrl}
          onChange={e => setNewBannerUrl(e.target.value)}
          className="flex-grow px-4 md:px-6 py-3 md:py-4 bg-neutral rounded-xl md:rounded-2xl border-none focus:ring-2 focus:ring-accent outline-none text-sm md:text-base"
        />
        <button onClick={handleAddBanner} className="px-6 md:px-8 py-3 md:py-4 bg-primary text-white rounded-xl md:rounded-2xl font-bold text-sm md:text-base whitespace-nowrap">ADD BANNER</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {banners.map(banner => (
          <div key={banner.id} className="bg-white rounded-2xl md:rounded-3xl border border-neutral overflow-hidden group">
            <div className="aspect-video relative">
              <img src={banner.image_url} alt="Banner" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute top-2 md:top-4 right-2 md:right-4 flex gap-2">
                <button onClick={() => toggleBanner(banner.id, banner.is_active)} className={cn("px-3 py-1.5 md:p-2 rounded-lg transition-colors text-[10px] md:text-xs font-bold", banner.is_active ? "bg-green-500 text-white" : "bg-neutral text-primary/40")}>
                  {banner.is_active ? 'ACTIVE' : 'INACTIVE'}
                </button>
                <button onClick={() => deleteBanner(banner.id)} className="p-1.5 md:p-2 bg-accent text-white rounded-lg"><Trash2 size={16} className="md:w-[18px] md:h-[18px]" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SettingsManagement = () => {
  const [config, setConfig] = useState<any>({
    shopName: appConfig.appName,
    whatsappNumber: appConfig.whatsappNumber,
    address: '123 Beauty Lane, Mumbai',
    aboutText: 'Elevating beauty through science and nature.'
  });

  const handleSave = () => {
    toast.success('Settings saved locally (Supabase integration pending)');
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-2xl">
      <h1 className="text-2xl md:text-3xl font-serif font-bold">Shop Settings</h1>
      <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-3xl border border-neutral space-y-4 md:space-y-6">
        <div>
          <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Shop Name</label>
          <input 
            type="text" 
            value={config.shopName}
            onChange={e => setConfig({...config, shopName: e.target.value})}
            className="w-full px-4 md:px-6 py-3 md:py-4 bg-neutral rounded-xl md:rounded-2xl border-none focus:ring-2 focus:ring-accent outline-none text-sm md:text-base"
          />
        </div>
        <div>
          <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">WhatsApp Number</label>
          <input 
            type="text" 
            value={config.whatsappNumber}
            onChange={e => setConfig({...config, whatsappNumber: e.target.value})}
            className="w-full px-4 md:px-6 py-3 md:py-4 bg-neutral rounded-xl md:rounded-2xl border-none focus:ring-2 focus:ring-accent outline-none text-sm md:text-base"
          />
        </div>
        <div>
          <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">About Text</label>
          <textarea 
            rows={4}
            value={config.aboutText}
            onChange={e => setConfig({...config, aboutText: e.target.value})}
            className="w-full px-4 md:px-6 py-3 md:py-4 bg-neutral rounded-xl md:rounded-2xl border-none focus:ring-2 focus:ring-accent outline-none resize-none text-sm md:text-base"
          />
        </div>
        <button onClick={handleSave} className="w-full py-3.5 md:py-4 bg-primary text-white rounded-xl md:rounded-2xl font-bold text-sm md:text-base">SAVE SETTINGS</button>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/check');
        const data = await response.json();
        
        if (!data.authenticated) {
          localStorage.removeItem('admin_authenticated');
          navigate('/admin');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Fallback to local storage if API fails
        const localAuth = localStorage.getItem('admin_authenticated') === 'true';
        if (!localAuth) navigate('/admin');
      } finally {
        setChecking(false);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    // Just clear local auth for Vercel compatibility
    localStorage.removeItem('admin_authenticated');
    toast.success('Logged out');
    navigate('/admin');
  };

  if (checking) return null;

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Overview', path: '/admin/dashboard' },
    { icon: <Package size={20} />, label: 'Products', path: '/admin/dashboard/products' },
    { icon: <ImageIcon size={20} />, label: 'Banners', path: '/admin/dashboard/banners' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/admin/dashboard/settings' },
  ];

  return (
    <div className="min-h-screen bg-neutral/30 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-neutral px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="text-xl font-serif font-bold tracking-tighter text-primary">
          LUMIÈRE
        </Link>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-neutral rounded-lg transition-colors"
        >
          {isSidebarOpen ? <X size={24} /> : <LayoutDashboard size={24} />}
        </button>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-72 bg-white border-r border-neutral flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 border-b border-neutral flex items-center justify-between">
          <div>
            <Link to="/" className="text-2xl font-serif font-bold tracking-tighter text-primary">
              LUMIÈRE
            </Link>
            <p className="text-[10px] font-bold text-accent uppercase tracking-widest mt-1">Admin Portal</p>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-neutral rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-grow p-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={cn(
                "flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all",
                location.pathname === item.path ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-primary/40 hover:bg-neutral/50 hover:text-primary"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-neutral">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold text-accent hover:bg-accent/10 transition-all"
          >
            <LogOut size={20} />
            LOGOUT
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-12 overflow-y-auto">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/products" element={<ProductManagement />} />
          <Route path="/products/new" element={<ProductForm />} />
          <Route path="/banners" element={<BannerManagement />} />
          <Route path="/settings" element={<SettingsManagement />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
