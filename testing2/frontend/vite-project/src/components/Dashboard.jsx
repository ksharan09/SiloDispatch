import React, { useEffect, useState } from 'react';
import { supabase } from '../api/supabase';

export default function OrdersDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();

    // Subscribe to changes
    const subscription = supabase
      .channel('orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        console.log('Realtime change:', payload);
        fetchOrders(); // re-fetch when any change occurs
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase.from('orders').select('*');
    if (error) console.error(error);
    else setOrders(data);
  };

  return (
    <div>
      <h2>📦 Real-Time Order Dashboard</h2>
      <ul>
        {orders.map(order => (
          <li key={order.order_id}>
            {order.order_id} – {order.pincode} – {order.weight}kg
          </li>
        ))}
      </ul>
    </div>
  );
}
