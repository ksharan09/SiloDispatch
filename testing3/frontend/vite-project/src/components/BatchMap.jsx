import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Polyline,
  InfoWindow,
} from "@react-google-maps/api";
import axios from "axios";

const containerStyle = {
  width: "100%",
  height: "80vh",
};

const center = {
  lat: 12.9716,
  lng: 77.5946,
};

const BatchMap = () => {
  const [batches, setBatches] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBoRxVMYaC0UPdfLDQyY6PApRoI-B8kUys", // Replace this
  });

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    const res = await axios.get("http://localhost:8000/batches/with-orders");
    setBatches(res.data.batches);
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={11}>
      {batches.map((batch, batchIdx) => {
        const path = batch.orders.map((o) => ({
          lat: o.lat,
          lng: o.lng,
        }));

        return (
          <React.Fragment key={batch.id}>
            <Polyline
              path={path}
              options={{
                strokeColor: ["#FF0000", "#0000FF", "#00FF00"][batchIdx % 3],
                strokeOpacity: 0.8,
                strokeWeight: 3,
              }}
            />
            {batch.orders.map((order, i) => (
              <Marker
                key={order.order_id}
                position={{ lat: order.lat, lng: order.lng }}
                onClick={() => setSelectedOrder(order)}
                label={(i + 1).toString()}
              />
            ))}
          </React.Fragment>
        );
      })}

      {selectedOrder && (
        <InfoWindow
          position={{ lat: selectedOrder.lat, lng: selectedOrder.lng }}
          onCloseClick={() => setSelectedOrder(null)}
        >
          <div>
            <strong>Order ID:</strong> {selectedOrder.order_id}<br />
            <strong>Pincode:</strong> {selectedOrder.pincode}<br />
            <strong>Weight:</strong> {selectedOrder.weight} kg
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default BatchMap;
