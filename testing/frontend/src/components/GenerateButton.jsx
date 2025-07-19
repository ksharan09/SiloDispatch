import React, { useState } from 'react';
import axios from '../services/api';

const GenerateButton = () => {
  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState([]);

  const handleGenerate = async () => {
    setLoading(true);
    const res = await axios.post('/generate-batches');
    setBatches(res.data.batches);
    setLoading(false);
  };

  return (
    <div>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Batches'}
      </button>
      <div>
        {batches.map((b, idx) => (
          <p key={idx}>✅ {b.batch_no} - {b.batchWeight} kg</p>
        ))}
      </div>
    </div>
  );
};

export default GenerateButton;
