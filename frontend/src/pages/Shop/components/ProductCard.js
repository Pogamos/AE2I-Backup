import React from "react";
import "./ProductCard.css";

const ProductCard = ({ title, description, price, image }) => {
  return (
    <div className="product-card">
      <img src={image} alt={title} className="product-image" />
      <h3 className="product-title">{title}</h3>
      <p className="product-description">{description}</p>
      <p className="product-price">{price.toFixed(2)} €</p>
      <button className="add-to-cart">Ajouter au panier</button>
    </div>
  );
};

export default ProductCard;
