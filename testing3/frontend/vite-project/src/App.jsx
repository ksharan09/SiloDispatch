import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BatchMap from "./components/BatchMap";
import AdminPanel from "./components/AdminPanel";
import BatchAssigned from "./components/BatchAssigned";
import NewBatches from "./components/NewBatches";

function App() {
  return (
    <BrowserRouter>
      <AdminPanel />
      <Routes>
        <Route path="/" element={<BatchAssigned />} />
        <Route path="/map" element={<BatchMap />} />
        <Route path="/new-batches" element={<NewBatches />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
