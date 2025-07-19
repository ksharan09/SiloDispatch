import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
  InfoWindow,
} from "@react-google-maps/api";

const API = "http://localhost:8000"; // FastAPI backend URL
const GOOGLE_MAPS_API_KEY = "AIzaSyBoRxVMYaC0UPdfLDQyY6PApRoI-B8kUys";

const colors = [
  "#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231",
  "#911eb4", "#46f0f0", "#f032e6", "#bcf60c", "#fabebe"
];

const App = () => {
  const [file, setFile] = useState(null);
  const [batchOrders, setBatchOrders] = useState([]);
  const [ordersMap, setOrdersMap] = useState({});
  const [selected, setSelected] = useState(null);

  const center = { lat: 12.9716, lng: 77.5946 };

  const uploadCSV = async () => {
    const form = new FormData();
    form.append("file", file);
    await axios.post(`${API}/upload`, form);
    alert("CSV Uploaded");
  };

  const generateBatches = async () => {
    await axios.post(`${API}/generate-batches`);
    loadBatches();
  };

  const loadBatches = async () => {
    const { data: batchData } = await axios.get(`${API}/batches`);
    const { data: orders } = await axios.get(`${API}/orders`);
    const map = {};
    orders.forEach(o => map[o.order_id] = o);
    setBatchOrders(batchData);
    setOrdersMap(map);
  };

  useEffect(() => {
    loadBatches();
  }, []);

  const grouped = batchOrders.reduce((acc, cur) => {
    const order = ordersMap[cur.order_id];
    if (!order || isNaN(order.lat) || isNaN(order.lng)) return acc;
    if (!acc[cur.batch_id]) acc[cur.batch_id] = [];
    acc[cur.batch_id].push(order);
    return acc;
  }, {});

  return (
    <div style={{ padding: 20 }}>
      <h2>Delivery Batch Viewer</h2>
      <input type="file" accept=".csv" onChange={e => setFile(e.target.files[0])} />
      <button onClick={uploadCSV}>Upload</button>
      <button onClick={generateBatches}>Generate Batches</button>

      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={{ height: "500px", width: "100%" }}
          center={center}
          zoom={11}
        >
          {Object.entries(grouped).map(([batchId, orders], i) => (
            <React.Fragment key={batchId}>
              <Polyline
                path={orders.map(o => ({ lat: parseFloat(o.lat), lng: parseFloat(o.lng) }))}
                options={{
                  strokeColor: colors[i % colors.length],
                  strokeWeight: 3,
                }}
              />
              {orders.map((order, idx) => (
                <Marker
                  key={`${batchId}-${idx}`}
                  position={{ lat: parseFloat(order.lat), lng: parseFloat(order.lng) }}
                  onClick={() => setSelected(order)}
                />
              ))}
            </React.Fragment>
          ))}

          {selected && (
            <InfoWindow
              position={{ lat: parseFloat(selected.lat), lng: parseFloat(selected.lng) }}
              onCloseClick={() => setSelected(null)}
            >
              <div>
                <strong>{selected.order_id}</strong><br />
                Weight: {selected.weight}kg<br />
                Pincode: {selected.pincode}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default App;
