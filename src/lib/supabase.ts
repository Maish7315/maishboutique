import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = 'https://crbtwikhkqbhqkimyqay.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyYnR3aWtoa3FiaHFraW15cWF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MjYxMDksImV4cCI6MjA4NjIwMjEwOX0.rcAdNQyKYYRnWpuSifQZ4SgPp0JbIcZY1quzTAG0a14';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Order {
  id?: number;
  order_number: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_phone: string;
  customer_email?: string;
  shipping_county: string;
  shipping_town: string;
  shipping_address: string;
  shipping_instructions?: string;
  payment_method: string;
  payment_status: string;
  delivery_zone: string;
  delivery_price: number;
  delivery_status: string;
  subtotal: number;
  discount: number;
  total: number;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  id?: number;
  order_id?: number;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  selected_size: string;
  selected_color: string;
  color_hex?: string;
  image?: string;
}

// Order functions
export const saveOrder = async (order: Order, items: OrderItem[]) => {
  // Insert order
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single();

  if (orderError) throw orderError;

  // Insert order items with order_id
  const itemsWithOrderId = items.map(item => ({
    ...item,
    order_id: orderData.id
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(itemsWithOrderId);

  if (itemsError) throw itemsError;

  return orderData;
};

export const getOrders = async () => {
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (ordersError) throw ordersError;

  // Get items for each order
  const ordersWithItems = await Promise.all(
    (orders || []).map(async (order) => {
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id);

      if (itemsError) throw itemsError;

      return { ...order, items: items || [] };
    })
  );

  return ordersWithItems;
};

export const getOrdersByPhone = async (phone: string) => {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .ilike('customer_phone', `%${phone}%`)
    .order('created_at', { ascending: false });

  if (error) throw error;

  const ordersWithItems = await Promise.all(
    (orders || []).map(async (order) => {
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id);

      if (itemsError) throw itemsError;
      return { ...order, items: items || [] };
    })
  );

  return ordersWithItems;
};

export const updateOrderStatus = async (orderId: number, status: string) => {
  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId);

  if (error) throw error;
};

export const deleteOrder = async (orderId: number) => {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', orderId);

  if (error) throw error;
};
