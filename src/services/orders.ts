import { supabase } from '../config/supabase';

// Order interface
export interface Order {
  id: string;
  session_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_company?: string;
  items: string[]; // Array of item names only
  total: number;
  project_description?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

// Generate a unique session ID for anonymous users
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Create a new order
export const createOrder = async (orderData: {
  sessionId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerCompany?: string;
  items: any[];
  total: number;
  projectDescription?: string;
}): Promise<Order> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        session_id: orderData.sessionId,
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail,
        customer_phone: orderData.customerPhone,
        customer_company: orderData.customerCompany,
        items: orderData.items,
        total: orderData.total,
        project_description: orderData.projectDescription,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};

// Get orders by session ID (for anonymous users)
export const getOrdersBySession = async (sessionId: string): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    throw error;
  }
};

// Get orders by email (for finding orders across sessions)
export const getOrdersByEmail = async (email: string): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_email', email)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<Order> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};
