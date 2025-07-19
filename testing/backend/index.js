// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { clusterOrdersAndSaveBatches } = require('./kmeans');
const { supabase } = require('./supabaseClient');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/generate-batches', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('status', 'open');

    if (error) throw error;

    const batches = await clusterOrdersAndSaveBatches(data);

    res.status(200).json({ batches });
  } catch (err) {
    console.error(err);
    res.status(500).send('Batch generation failed');
  }
});

app.get('/batches/today', async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('batches')
    .select('*')
    .gte('created_at', `${today}T00:00:00`);

  if (error) return res.status(500).send(error.message);
  res.status(200).json(data);
});
app.post('/generate-batches-from-upload', async (req, res) => {
  try {
    const { orders } = req.body;

    if (!orders || !Array.isArray(orders)) {
      return res.status(400).send('Invalid or missing orders data');
    }

    console.log('Received orders:', orders.length);

    const insertResult = await supabase
      .from('orders')
      .insert(
        orders.map(order => ({
          order_id: order.order_id,
          lat: order.lat,
          lng: order.lng,
          pincode: order.pincode,
          weight: order.weight,
        }))
      );

    if (insertResult.error) {
      console.error('Insert error:', insertResult.error);
      return res.status(500).send('Error saving orders');
    }

    const batches = await clusterOrdersAndSaveBatches(insertResult.data);
    res.status(200).json({ batches });

  } catch (err) {
    console.error('Upload batch generation failed:', err);
    res.status(500).send('Batch generation from upload failed');
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
