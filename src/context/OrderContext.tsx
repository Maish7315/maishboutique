import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  colorHex?: string;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
  shipping: {
    county: string;
    town: string;
    address: string;
    instructions: string;
  };
  items: OrderItem[];
  payment: {
    method: string;
    status: 'pending' | 'paid' | 'cod';
  };
  delivery: {
    zone: string;
    price: number;
    status: 'pending' | 'shipped' | 'delivered';
  };
  pricing: {
    subtotal: number;
    discount: number;
    delivery: number;
    total: number;
  };
  createdAt: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrder: (orderId: string) => Order | undefined;
  getOrdersByPhone: (phone: string) => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY = 'maish_orders';

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    
    // Log to console for testing
    console.log('📦 New Order Received:', newOrder);
    
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const getOrder = (orderId: string) => {
    return orders.find((order) => order.id === orderId);
  };

  const getOrdersByPhone = (phone: string) => {
    return orders.filter((order) => 
      order.customer.phone.includes(phone)
    );
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, getOrder, getOrdersByPhone }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
