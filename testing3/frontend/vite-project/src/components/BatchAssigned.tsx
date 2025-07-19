import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
import { supabase } from '../lib/supabase';

type Order = {
  id: string;
  order_id: string;
  lat: number;
  lng: number;
};

type Batch = {
  id: string;
  name: string;
  created_at: string;
  orders: Order[];
};

export default function BatchAssigned() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBoRxVMYaC0UPdfLDQyY6PApRoI-B8kUys"
  });

  const fetchBatches = async () => {
    const { data, error } = await supabase
      .from("batches")
      .select(`id, name, created_at, orders (id, order_id, lat, lng)`);
    if (!error && data) setBatches(data as any);
  };

  useEffect(() => {
    fetchBatches();

    // Subscribe to changes in batches and orders
    const batchSub = supabase
      .channel('batches-and-orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'batches' },
        () => fetchBatches()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => fetchBatches()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(batchSub);
    };
  }, []);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap center={{ lat: 12.97, lng: 77.59 }} zoom={11} mapContainerStyle={{ height: "90vh", width: "100%" }}>
      {batches.map((batch, index) => (
        <React.Fragment key={batch.id}>
          {batch.orders.map(order => (
            <Marker key={order.id} position={{ lat: order.lat, lng: order.lng }} label={order.order_id} />
          ))}
          <Polyline
            path={batch.orders.map(o => ({ lat: o.lat, lng: o.lng }))}
            options={{ strokeColor: ["red", "blue", "green"][index % 3], strokeOpacity: 0.7 }}
          />
        </React.Fragment>
      ))}
    </GoogleMap>
  );
}