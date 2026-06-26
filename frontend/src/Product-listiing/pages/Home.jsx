import React from "react";
import Navbar from "./Navbar";
import Productlisting from "./Productlisting";
import Footer from "./Footer";

const Home = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Productlisting />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
