/**
 * Order Service - Handles order management with Supabase
 */

import { projectId, publicAnonKey } from './info';
import type { Order, OrderItem } from '../sanity/types';

const SUPABASE_URL = `https://${projectId}.supabase.co`;
const ORDERS_TABLE = 'orders';

/**
 * Create a new order in Supabase
 */
export async function createOrder(orderData: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  paymentMethod: 'mpesa' | 'bank_transfer' | 'paypal' | 'pesapal';
  totalAmount: number;
  items: OrderItem[];
  mpesaTransactionId?: string;
  pesapalTransactionId?: string;
}): Promise<Order> {
  try {
    const order = {
      customer_name: orderData.customerName,
      customer_email: orderData.customerEmail,
      customer_phone: orderData.customerPhone,
      delivery_address: orderData.deliveryAddress,
      payment_method: orderData.paymentMethod,
      total_amount: orderData.totalAmount,
      items: orderData.items,
      status: 'pending' as const,
      mpesa_transaction_id: orderData.mpesaTransactionId,
      pesapal_transaction_id: orderData.pesapalTransactionId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const response = await fetch(`${SUPABASE_URL}/rest/v1/${ORDERS_TABLE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': publicAnonKey,
        'Authorization': `Bearer ${publicAnonKey}`,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create order: ${error}`);
    }

    const [createdOrder] = await response.json();
    console.log('✅ Order created successfully:', createdOrder.id);
    
    return createdOrder;
  } catch (error) {
    console.error('❌ Error creating order:', error);
    throw error;
  }
}

/**
 * Fetch all orders (for admin)
 */
export async function fetchOrders(): Promise<Order[]> {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/${ORDERS_TABLE}?order=created_at.desc`,
      {
        headers: {
          'apikey': publicAnonKey,
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }

    const orders = await response.json();
    console.log(`✅ Fetched ${orders.length} orders`);
    
    return orders;
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    throw error;
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: Order['status']
): Promise<Order> {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/${ORDERS_TABLE}?id=eq.${orderId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': publicAnonKey,
          'Authorization': `Bearer ${publicAnonKey}`,
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          status,
          updated_at: new Date().toISOString(),
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update order: ${response.statusText}`);
    }

    const [updatedOrder] = await response.json();
    console.log(`✅ Order ${orderId} updated to ${status}`);
    
    return updatedOrder;
  } catch (error) {
    console.error('❌ Error updating order:', error);
    throw error;
  }
}

/**
 * Fetch order by ID
 */
export async function fetchOrderById(orderId: string): Promise<Order | null> {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/${ORDERS_TABLE}?id=eq.${orderId}`,
      {
        headers: {
          'apikey': publicAnonKey,
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch order: ${response.statusText}`);
    }

    const [order] = await response.json();
    return order || null;
  } catch (error) {
    console.error('❌ Error fetching order:', error);
    return null;
  }
}