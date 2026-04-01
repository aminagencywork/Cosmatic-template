import { supabase, Product } from '../lib/supabase';
import localProducts from '../data/product-data.json';

export const productService = {
  async getAllProducts(filters?: { category?: string; brand?: string; skinType?: string; sort?: string }): Promise<Product[]> {
    try {
      let query = supabase.from('products').select('*');

      if (filters?.category && filters.category !== 'All') query = query.eq('category', filters.category);
      if (filters?.brand && filters.brand !== 'All') query = query.eq('brand', filters.brand);
      if (filters?.skinType && filters.skinType !== 'All') query = query.contains('skin_types', [filters.skinType]);

      if (filters?.sort === 'price-low') query = query.order('price', { ascending: true });
      else if (filters?.sort === 'price-high') query = query.order('price', { ascending: false });
      else query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      
      // Fallback to local data if Supabase is empty or fails
      if (error || !data || data.length === 0) {
        console.log('Using local product data fallback');
        let filtered = [...(localProducts as Product[])];
        
        if (filters?.category && filters.category !== 'All') {
          filtered = filtered.filter(p => p.category === filters.category);
        }
        if (filters?.brand && filters.brand !== 'All') {
          filtered = filtered.filter(p => p.brand === filters.brand);
        }
        if (filters?.skinType && filters.skinType !== 'All') {
          filtered = filtered.filter(p => p.skin_types.includes(filters.skinType!));
        }
        
        if (filters?.sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
        else if (filters?.sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
        
        return filtered;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return localProducts as Product[];
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error || !data) {
        return (localProducts as Product[]).find(p => p.id === id) || null;
      }
      
      return data;
    } catch (error) {
      return (localProducts as Product[]).find(p => p.id === id) || null;
    }
  },

  async getTrendingProducts(limit: number = 8): Promise<Product[]> {
    const products = await this.getAllProducts();
    return products.slice(0, limit);
  },

  async getSimilarProducts(product: Product, limit: number = 4): Promise<Product[]> {
    const all = await this.getAllProducts();
    return all
      .filter(p => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
      .slice(0, limit);
  }
};
