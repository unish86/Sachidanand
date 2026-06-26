import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ProductDetail from "../pages/ProductDetail";

const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route
          path="*"
          element={
            <div className="container py-5 text-center">
              <h2 className="mb-3">Page Not Found</h2>
              <p className="text-muted mb-4">The page you are looking for does not exist.</p>
              <a href="/" className="btn btn-primary">Go to Homepage</a>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;
