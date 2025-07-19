import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function NewBatches() {
  const [unassignedBatches, setUnassignedBatches] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [assigning, setAssigning] = useState(false);

  // Fetch all batches that do not have a driver assigned
  const fetchUnassignedBatches = async () => {
    const { data, error } = await supabase
      .from('batches')
      .select('*')
      .is('driver_id', null);

    if (error) {
      console.error('Error fetching batches:', error);
    } else {
      setUnassignedBatches(data);
    }
  };

  // Fetch drivers who are available
  const fetchAvailableDrivers = async () => {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('assigned', false);

    if (error) {
      console.error('Error fetching drivers:', error);
    } else {
      setAvailableDrivers(data);
    }
  };

  useEffect(() => {
    fetchUnassignedBatches();
    fetchAvailableDrivers();
  }, []);

  // Assign driver to batch
  const handleAssignDriver = async (batchId, driverId) => {
    setAssigning(true);

    const { error: batchError } = await supabase
      .from('batches')
      .update({ driver_id: driverId })
      .eq('id', batchId);

    const { error: driverError } = await supabase
      .from('drivers')
      .update({ assigned: true })
      .eq('id', driverId);

    if (batchError || driverError) {
      console.error('Error assigning driver:', batchError || driverError);
    } else {
      await fetchUnassignedBatches();
      await fetchAvailableDrivers();
    }

    setAssigning(false);
  };

  return (
    <div>
      <h2>Assign Drivers to Batches</h2>

      {unassignedBatches.length === 0 && <p>✅ All batches are assigned!</p>}

      {unassignedBatches.map((batch) => (
        <div
          key={batch.id}
          style={{
            border: '1px solid #ccc',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '8px',
          }}
        >
          <h4>🧾 Batch: {batch.name}</h4>

          <label>Assign Driver: </label>
          <select
            defaultValue=""
            onChange={(e) => handleAssignDriver(batch.id, e.target.value)}
            disabled={assigning}
          >
            <option value="" disabled>Select a driver</option>
            {availableDrivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name} ({driver.phone})
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
