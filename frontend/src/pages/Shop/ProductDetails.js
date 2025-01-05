import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProductDetails.css";

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ID du produit (à remplacer dynamiquement plus tard si nécessaire)
  const id = "677a5d33145e2dcae317698b"; // Exemple d'ID

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/articles")
      .then((response) => {
        const foundProduct = response.data.articles.find((article) => article._id === id);
        setProduct(foundProduct);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des détails du produit :", error);
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="product-details-container">
      <div className="product-details-header">
        <h1 className="product-details-title">Boutique</h1>
      </div>
      <div className="product-details-content">
        {loading ? (
          <p>Chargement des détails...</p>
        ) : error ? (
          <p>Erreur : {error}</p>
        ) : product ? (
          <div className="product-details">
            <img src={product.photo} alt={product.title} className="product-details-image" />
            <div className="product-details-info">
              <h2>{product.title}</h2>
              <p className="product-details-price">{product.price.toFixed(2)} €</p>
              <p className="product-details-description">{product.description}</p>
              <button className="add-to-cart">Ajouter au panier</button>
            </div>
          </div>
        ) : (
          <p>Produit introuvable.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
