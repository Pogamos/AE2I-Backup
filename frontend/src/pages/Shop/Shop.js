import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./components/ProductCard";
import FilterBar from "./components/FilterBar";
import "./Shop.css";

const Shop = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(Infinity);
  const [availableOnly, setAvailableOnly] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/articles")
      .then((response) => {
        setArticles(response.data.articles);
        setFilteredArticles(response.data.articles);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des articles :", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = articles;

    filtered = filtered.filter(
      (article) =>
        article.price >= minPrice && (maxPrice === Infinity || article.price <= maxPrice)
    );

    if (availableOnly) {
      filtered = filtered.filter((article) => article.available === true);
    }

    setFilteredArticles(filtered);
  }, [minPrice, maxPrice, availableOnly, articles]);

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1 className="shop-title">Boutique</h1>
      </div>
      <div className="shop-content">
        <div className="filter-and-cart">
          <FilterBar
            setMinPrice={setMinPrice}
            setMaxPrice={setMaxPrice}
            setAvailableOnly={setAvailableOnly}
          />
          <button className="view-cart-button">
            <svg
              width="42"
              height="42"
              viewBox="0 0 42 42"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8 0C3.58172 0 0 3.58172 0 8V34C0 38.4183 3.58172 42 8 42H34C38.4183 42 42 38.4183 42 34V8C42 3.58172 38.4183 0 34 0H8ZM29.8137 8.26549C30.5757 7.46586 31.8417 7.43538 32.6413 8.1974C33.4409 8.95942 33.4714 10.2254 32.7094 11.025C29.3672 14.5321 25.3805 16.4287 21.2152 16.4287C17.0564 16.4287 13.0194 14.5382 9.56388 11.0535C8.78612 10.2692 8.79145 9.00286 9.57577 8.2251C10.3601 7.44734 11.6264 7.45267 12.4042 8.23699C15.2731 11.1302 18.336 12.4287 21.2152 12.4287C24.0881 12.4287 27.0779 11.1363 29.8137 8.26549Z"
                fill="white"
              />
              <rect
                x="25.3477"
                y="30.7683"
                width="10.1388"
                height="5.06938"
                rx="1"
                fill="#D91663"
              />
            </svg>
            <span>Voir mon panier</span>
          </button>
        </div>
        {loading ? (
          <p>Chargement des articles...</p>
        ) : error ? (
          <p>Erreur : {error}</p>
        ) : filteredArticles.length > 0 ? (
          <div className="product-list">
            {filteredArticles.map((article) => (
              <ProductCard
                key={article._id}
                title={article.title}
                price={article.price}
                image={article.photo}
              />
            ))}
          </div>
        ) : (
          <p>Aucun article disponible.</p>
        )}
      </div>
    </div>
  );
};

export default Shop;
