import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Product, Rating } from "../../types";

// Star rating component to display review score and count
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
          // Fill star if active rating is close to it
          const fill = star <= Math.round(rate);
          return (
            <span key={star} style={{ color: fill ? "#eab308" : "#cbd5e1" }}>
              ★
            </span>
          );
        })}
      </div>
      <span className="text-muted small ms-1" style={{ fontSize: "0.85rem" }}>
        {rate.toFixed(1)} ({count} reviews)
      </span>
    </div>
  );
}

// Skeleton component to show while data is fetching
function SkeletonCard() {
  return (
    <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
      <div className="card h-100 product-card border-0 shadow-sm">
        <div className="product-img-wrapper skeleton" style={{ height: "240px" }}></div>
        <div className="card-body d-flex flex-column gap-2 p-3">
          <div className="skeleton skeleton-text" style={{ width: "40%", height: "15px" }}></div>
          <div className="skeleton skeleton-title" style={{ width: "85%", height: "22px" }}></div>
          <div className="skeleton skeleton-text" style={{ width: "60%", height: "15px" }}></div>
          <div className="skeleton skeleton-text mt-2" style={{ width: "35%", height: "24px" }}></div>
          <div className="skeleton mt-auto" style={{ width: "100%", height: "38px", borderRadius: "8px" }}></div>
        </div>
      </div>
    </div>
  );
}

function Productlisting() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortOption, setSortOption] = useState<string>("default");

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Fetch data on component mount
  const fetchProducts = () => {
    setLoading(true);
    setError(null);
    fetch("https://fakestoreapi.com/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch product data from server.");
        }
        return response.json();
      })
      .then((data: Product[]) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err: any) => {
        setError(err.message || "An error occurred while loading products.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle client-side search query debounce filtering with loading spinner simulation
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setIsSearching(false);
    }, 300); // 300ms debounce
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page number on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, selectedCategory, sortOption]);

  // Extract unique categories dynamically from products
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  // Helper to match category specific badges style class
  const getBadgeClass = (category: string) => {
    if (!category) return "badge-default";
    const lower = category.toLowerCase();
    if (lower.includes("electronics")) return "badge-electronics";
    if (lower.includes("jewelery")) return "badge-jewelery";
    if (lower.includes("men's clothing")) return "badge-mens";
    if (lower.includes("women's clothing")) return "badge-womens";
    return "badge-default";
  };

  // Perform filtering and sorting
  const processedProducts = products
    .filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOption === "price-low-high") return a.price - b.price;
      if (sortOption === "price-high-low") return b.price - a.price;
      if (sortOption === "rating-high-low") {
        const ratingA = a.rating ? a.rating.rate : 0;
        const ratingB = b.rating ? b.rating.rate : 0;
        return ratingB - ratingA;
      }
      return 0; // Default sorting (no change)
    });

  // Paginated chunk calculation
  const totalItems = processedProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = processedProducts.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="container py-5">
      {/* Header section */}
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold mb-2">Discover Our Products</h1>
        <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
          Browse through our curated collection of electronics, jewelery, and clothing with premium quality items.
        </p>
      </div>

      {/* Control bar: Search, Sort, Filter */}
      <div className="card shadow-sm border-0 p-4 mb-4" style={{ borderRadius: "12px" }}>
        <div className="row g-3 align-items-center">
          {/* Search bar */}
          <div className="col-lg-4 col-md-6 col-12">
            <div className="input-group position-relative">
              <input
                type="text"
                className="form-control search-control"
                placeholder="Search products by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {isSearching ? (
                <div
                  className="spinner-border spinner-border-sm text-secondary"
                  role="status"
                  style={{
                    position: "absolute",
                    right: "12px",
                    zIndex: 10,
                    top: "50%",
                    marginTop: "-8px",
                  }}
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : searchQuery ? (
                <button
                  className="btn btn-outline-secondary border-0"
                  type="button"
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: "absolute",
                    right: "12px",
                    zIndex: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    color: "#94a3b8",
                  }}
                >
                  ✕
                </button>
              ) : null}
            </div>
          </div>

          {/* Sort selection */}
          <div className="col-lg-3 col-md-6 col-12 ms-auto text-end">
            <div className="d-flex align-items-center justify-content-md-end gap-2">
              <span className="text-muted text-nowrap" style={{ fontSize: "0.9rem" }}>Sort by:</span>
              <select
                className="form-select sort-select w-auto"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="default">Featured</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="rating-high-low">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        {!loading && !error && (
          <div className="mt-4 pt-3 border-top">
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <span className="text-muted me-2" style={{ fontSize: "0.9rem" }}>Category:</span>
              {categories.map((category) => (
                <button
                  key={category}
                  className={`filter-btn ${selectedCategory === category ? "active" : ""}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main content display states */}
      {loading ? (
        // Rendering skeletons during fetch state
        <div className="row">
          {Array.from({ length: itemsPerPage }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : error ? (
        // Error display card with retry option
        <div className="card border-danger bg-light text-center py-5 px-4 my-4 shadow-sm mx-auto" style={{ maxWidth: "500px", borderRadius: "12px" }}>
          <h4 className="text-danger mb-3">Oops, something went wrong!</h4>
          <p className="text-muted mb-4">{error}</p>
          <button className="btn btn-primary px-4 align-self-center" onClick={fetchProducts}>
            Try Again
          </button>
        </div>
      ) : currentProducts.length === 0 ? (
        // Empty query results state
        <div className="text-center py-5 my-4">
          <div className="fs-1 text-muted mb-3">🔍</div>
          <h4>No Products Found</h4>
          <p className="text-muted">
            We couldn't find anything matching "{debouncedSearchQuery}". Try refining your search query or filters.
          </p>
          <button
            className="btn btn-sm btn-outline-primary mt-2"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setSortOption("default");
            }}
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        // Render current page items
        <>
          <div className="row">
            {currentProducts.map((product) => (
              <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4" key={product.id}>
                <div className="card h-100 product-card shadow-sm border-0 d-flex flex-column">
                  <div className="product-img-wrapper">
                    <img
                      src={product.image}
                      className="product-img"
                      alt={product.title}
                      loading="lazy"
                    />
                  </div>

                  <div className="card-body d-flex flex-column p-3">
                    <span className={`badge-category ${getBadgeClass(product.category)} mb-2`}>
                      {product.category}
                    </span>

                    <h5
                      className="card-title text-dark mb-1"
                      style={{
                        fontSize: "0.95rem",
                        lineHeight: "1.4",
                        height: "40px",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                      title={product.title}
                    >
                      {product.title}
                    </h5>

                    <StarRating rating={product.rating} />

                    <h4 className="text-dark fw-bold mt-2 mb-3">${product.price.toFixed(2)}</h4>

                    <Link to={`/product/${product.id}`} className="btn btn-outline-primary btn-sm mt-auto w-100 py-2 border-2" style={{ borderRadius: "8px", fontWeight: "600" }}>
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <nav className="d-flex justify-content-center mt-4">
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    &laquo; Prev
                  </button>
                </li>
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <li key={pageNum} className={`page-item ${currentPage === pageNum ? "active" : ""}`}>
                      <button className="page-link" onClick={() => setCurrentPage(pageNum)}>
                        {pageNum}
                      </button>
                    </li>
                  );
                })}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage((prev) => Math.max(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next &raquo;
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
}

export default Productlisting;
