import React from "react";
import "./ProductCard.css";

const ProductCard = ({ title, price, image }) => {
  const handleAddToFavorites = () => {
    console.log(`${title} ajouté aux favoris !`);
    // Ajoutez ici votre logique pour gérer les favoris
  };

  return (
    <div className="product-card">
      <img src={image} alt={title} className="product-image" />
      <h3 className="product-title">{title}</h3>
      <p className="product-price">{price.toFixed(2)} €</p>
      <button className="add-to-favorites" onClick={handleAddToFavorites}>
        ★
      </button>
    </div>
  );
};

export default ProductCard;
