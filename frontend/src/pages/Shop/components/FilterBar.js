import React, { useState } from "react";
import "./FilterBar.css";

const FilterBar = ({ setMinPrice, setMaxPrice, setAvailableOnly }) => {
  const [localMinPrice, setLocalMinPrice] = useState("");
  const [localMaxPrice, setLocalMaxPrice] = useState("");

  const handleMinPriceChange = (e) => {
    const value = parseFloat(e.target.value);
    setLocalMinPrice(e.target.value);
    setMinPrice(isNaN(value) ? 0 : value);
  };

  const handleMaxPriceChange = (e) => {
    const value = parseFloat(e.target.value);
    setLocalMaxPrice(e.target.value);
    setMaxPrice(isNaN(value) ? Infinity : value);
  };

  const handleAvailabilityChange = (e) => {
    setAvailableOnly(e.target.checked);
  };

  return (
    <div className="filter-bar">
      <div className="filter-item">
        <label htmlFor="min-price">Prix minimum :</label>
        <input
          id="min-price"
          type="number"
          value={localMinPrice}
          onChange={handleMinPriceChange}
          placeholder="Min €"
        />
      </div>
      <div className="filter-item">
        <label htmlFor="max-price">Prix maximum :</label>
        <input
          id="max-price"
          type="number"
          value={localMaxPrice}
          onChange={handleMaxPriceChange}
          placeholder="Max €"
        />
      </div>
      <div className="filter-item">
        <label htmlFor="availability">Disponibles uniquement :</label>
        <input
          id="availability"
          type="checkbox"
          onChange={handleAvailabilityChange}
        />
      </div>
    </div>
  );
};

export default FilterBar;
