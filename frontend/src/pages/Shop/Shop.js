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

  // États pour les filtres
  const [minPrice, setMinPrice] = useState(0); // Prix minimum
  const [maxPrice, setMaxPrice] = useState(Infinity); // Prix maximum
  const [availableOnly, setAvailableOnly] = useState(false); // Disponibilité

  // Récupération des articles depuis l'API
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

  // Application des filtres
  useEffect(() => {
    let filtered = articles;

    // Filtrer par prix
    filtered = filtered.filter(
      (article) =>
        article.price >= minPrice && (maxPrice === Infinity || article.price <= maxPrice)
    );

    // Filtrer par disponibilité (si applicable)
    if (availableOnly) {
      filtered = filtered.filter((article) => article.available === true); // Assurez-vous que les données incluent `available`
    }

    setFilteredArticles(filtered);
  }, [minPrice, maxPrice, availableOnly, articles]);

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1 className="shop-title">Boutique</h1>
      </div>
      <div className="shop-content">
        <FilterBar
          setMinPrice={setMinPrice} // Définit le prix minimum
          setMaxPrice={setMaxPrice} // Définit le prix maximum
          setAvailableOnly={setAvailableOnly} // Filtre disponibilité
        />
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
                description={article.description}
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
