import React, { useState } from 'react';
import Papa from 'papaparse';
import api from '../services/api';

const CsvUploader = () => {
  const [file, setFile] = useState(null);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) return alert('Please select a CSV file');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async function (results) {
        const orders = results.data;

        // Optional: parse lat/lng/weight as float
        const cleanOrders = orders.map(o => ({
          order_id: o.order_id,
          pincode: o.pincode,
          lat: parseFloat(o.lat),
          lng: parseFloat(o.lng),
          weight: parseFloat(o.weight),
        }));

        setLoading(true);

        try {
          const res = await api.post('/generate-batches-from-upload', {
            orders: cleanOrders,
          });

          setBatches(res.data.batches);
        } catch (err) {
          console.error('Clustering failed', err);
          alert('Batch generation failed');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <div>
      <h2>Upload Orders CSV</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Clustering...' : 'Upload & Cluster'}
      </button>

      {batches.length > 0 && (
        <div>
          <h3>Batches</h3>
          {batches.map((b, idx) => (
            <p key={idx}>✅ {b.batch_no} - {b.batchWeight} kg</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default CsvUploader;
