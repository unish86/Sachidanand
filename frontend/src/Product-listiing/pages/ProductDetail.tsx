import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Product, Rating } from "../../types";

// Star rating helper component
interface StarRatingProps {
  rating?: Rating;
}

function StarRating({ rating }: StarRatingProps) {
  if (!rating) return null;
  const rate = rating.rate || 0;
  const count = rating.count || 0;

  return (
    <div className="d-flex align-items-center gap-1 my-2">
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => {
          const fill = star <= Math.round(rate);
          return (
            <span key={star} style={{ color: fill ? "#eab308" : "#cbd5e1" }}>
              ★
            </span>
          );
        })}
      </div>
      <span className="text-muted small ms-2" style={{ fontSize: "0.9rem" }}>
        {rate.toFixed(1)} / 5.0 ({count} customer reviews)
      </span>
    </div>
  );
}

// Skeleton loading layout matching the actual details page structure
function DetailSkeleton() {
  return (
    <div className="row g-4 align-items-center">
      <div className="col-md-6">
        <div className="detail-img-container skeleton" style={{ minHeight: "400px" }}></div>
      </div>
      <div className="col-md-6 d-flex flex-column gap-3">
        <div className="skeleton skeleton-text" style={{ width: "30%", height: "20px" }}></div>
        <div className="skeleton skeleton-title" style={{ width: "90%", height: "35px" }}></div>
        <div className="skeleton skeleton-text" style={{ width: "50%", height: "20px" }}></div>
        <div className="skeleton skeleton-text" style={{ width: "25%", height: "32px", marginTop: "15px" }}></div>
        <div className="mt-3">
          <div className="skeleton skeleton-text" style={{ width: "100%" }}></div>
          <div className="skeleton skeleton-text" style={{ width: "100%" }}></div>
          <div className="skeleton skeleton-text" style={{ width: "85%" }}></div>
        </div>
        <div className="skeleton mt-4" style={{ width: "200px", height: "45px", borderRadius: "8px" }}></div>
      </div>
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);

  const fetchProductDetail = () => {
    setLoading(true);
    setError(null);
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch product details from server.");
        }
        return response.json();
      })
      .then((data: Product) => {
        if (!data) {
          throw new Error("Product not found.");
        }
        setProduct(data);
        setLoading(false);
      })
      .catch((err: any) => {
        setError(err.message || "An error occurred while loading details.");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (id) {
      fetchProductDetail();
    }
  }, [id]);

  // Helper to match category specific badges style class
  const getBadgeClass = (category?: string) => {
    if (!category) return "badge-default";
    const lower = category.toLowerCase();
    if (lower.includes("electronics")) return "badge-electronics";
    if (lower.includes("jewelery")) return "badge-jewelery";
    if (lower.includes("men's clothing")) return "badge-mens";
    if (lower.includes("women's clothing")) return "badge-womens";
    return "badge-default";
  };

  const handleAddToCart = () => {
    setAddedToCart(true);
    // Reset to "Add to Cart" state after 2.5 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 2500);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="flex-grow-1 py-5 bg-light">
        <div className="container">
          {/* Back Navigation Button */}
          <button
            className="btn btn-outline-secondary back-btn border-2 mb-4"
            onClick={() => navigate("/")}
          >
            ← Back to products
          </button>

          {loading ? (
            <div className="card border-0 shadow-sm p-4 detail-card">
              <DetailSkeleton />
            </div>
          ) : error || !product ? (
            <div className="card border-danger bg-white text-center py-5 px-4 shadow-sm mx-auto" style={{ maxWidth: "500px", borderRadius: "12px" }}>
              <h4 className="text-danger mb-3">Unable to Load Product</h4>
              <p className="text-muted mb-4">{error || "Product not found"}</p>
              <button className="btn btn-primary px-4 align-self-center" onClick={fetchProductDetail}>
                Try Again
              </button>
            </div>
          ) : (
            <div className="card border-0 shadow-sm p-4 detail-card">
              <div className="row g-5 align-items-center">
                {/* Product Image Column */}
                <div className="col-md-6 text-center">
                  <div className="detail-img-container">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="detail-img"
                    />
                  </div>
                </div>

                {/* Product Information Column */}
                <div className="col-md-6">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className={`badge-category ${getBadgeClass(product.category)}`}>
                      {product.category}
                    </span>
                    <span className="badge bg-success-subtle text-success border border-success-subtle rounded px-2 py-1 small">
                      In Stock
                    </span>
                  </div>

                  <h1 className="h2 fw-bold text-dark mb-2">{product.title}</h1>

                  <StarRating rating={product.rating} />

                  <h2 className="text-primary fw-bold my-4">${product.price.toFixed(2)}</h2>

                  <hr className="my-4" />

                  <h5 className="fw-semibold text-dark">Description</h5>
                  <p className="text-muted lh-lg" style={{ fontSize: "0.95rem" }}>
                    {product.description}
                  </p>

                  <div className="mt-4 pt-2">
                    <button
                      className={`btn btn-lg px-5 py-3 ${addedToCart ? "btn-success" : "btn-primary"} fw-semibold`}
                      style={{ borderRadius: "8px", transition: "all 0.3s ease" }}
                      onClick={handleAddToCart}
                    >
                      {addedToCart ? "Added to Cart ✓" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ProductDetail;
