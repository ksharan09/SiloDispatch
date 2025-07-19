import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from '../lib/supabase';

export default function AdminPanel() {
  const [file, setFile] = useState(null);
  const [batches, setBatches] = useState([]);

  const uploadCSV = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    await axios.post('http://localhost:8000/upload', formData);
    alert('Uploaded!');
  };

  const generateBatches = async () => {
    await axios.post('http://localhost:8000/batches/generate?n_clusters=3');
    alert('Batches generated!');
  };
const deleteAllBatches = async () => {
  // Delete all orders
  const { error: orderError } = await supabase
    .from('orders')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  // Delete all batches
  const { error: batchError } = await supabase
    .from('batches')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (!orderError && !batchError) {
    alert('All batches and orders deleted!');
    fetchBatches();
  } else {
    alert('Error deleting batches or orders');
    console.error(orderError, batchError);
  }
};

  const fetchBatches = async () => {
    const { data, error } = await supabase
      .from('batches')
      .select('id, name, created_at, orders (id, order_id, lat, lng, weight)');
    if (!error) setBatches(data);
  };

  useEffect(() => {
    fetchBatches();
  }, []);

return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Admin Panel</h2>
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <input type="file" onChange={e => setFile(e.target.files[0])} />
            <button onClick={uploadCSV}>Upload CSV</button>
            <button onClick={generateBatches}>Generate Batches</button>
            <button onClick={deleteAllBatches}>Delete All Batches</button>
        </div>
        <hr />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginTop: 24 }}>
            {batches.map(batch => (
                <div
                    key={batch.id}
                    style={{
                        background: '',
                        border: '1px solid #e0e0e0',
                        borderRadius: 8,
                        padding: 16,
                        minWidth: 250,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}
                >
                    <h3 style={{ marginTop: 0, marginBottom: 12 }}>{batch.name}</h3>
                    <div style={{ fontSize: 12, color: 'black', marginBottom: 8 }}>
                        Created: {new Date(batch.created_at).toLocaleString()}
                    </div>
                    <ul style={{ paddingLeft: 16, margin: 0 }}>
                        {batch.orders.map(order => (
                            <li key={order.id} style={{ marginBottom: 6 }}>
                                <strong>{order.order_id}</strong>
                                <br />
                                {order.lat}, {order.lng}
                                <br />
                               {order.weight}kg
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    </div>
);
}
