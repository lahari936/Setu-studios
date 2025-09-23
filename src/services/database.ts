import { supabase, User, CartItem } from '../config/supabase';

export type { User, CartItem };

// User management functions
export const createUser = async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>, userId?: string) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const { data, error } = await supabase
    .from('users')
    .insert([{ ...userData, id: userId }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUser = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

export const updateUser = async (userId: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Cart management functions
export const getCartItems = async (userId: string) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const { data, error } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const addToCart = async (userId: string, item: Omit<CartItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  // Check if item already exists in cart
  const { data: existingItem } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId)
    .eq('name', item.name)
    .eq('type', item.type)
    .single();

  if (existingItem) {
    // Update quantity if item exists
    const { data, error } = await supabase
      .from('cart_items')
      .update({ 
        quantity: existingItem.quantity + item.quantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingItem.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    // Add new item to cart
    const { data, error } = await supabase
      .from('cart_items')
      .insert([{
        ...item,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export const updateCartItem = async (itemId: string, updates: Partial<CartItem>) => {
  const { data, error } = await supabase
    .from('cart_items')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', itemId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const removeFromCart = async (itemId: string) => {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId);

  if (error) throw error;
};

export const clearCart = async (userId: string) => {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId);

  if (error) throw error;
};

export const getCartTotal = async (userId: string) => {
  const { data, error } = await supabase
    .from('cart_items')
    .select('price, quantity')
    .eq('user_id', userId);

  if (error) throw error;
  
  return data?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;
};

// Order management functions
export interface Order {
  id: string;
  user_id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export const createOrder = async (userId: string, items: CartItem[], total: number) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([{
      user_id: userId,
      items: items,
      total: total,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getOrders = async (userId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};
