import React, { useCallback, useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useNavigate } from "react-router-dom";
import "../css/shop.css";

function Shop() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [tag, setTag] = useState("");
  const [selected, setSelected] = useState("none");
  const [product, setProduct] = useState({});
  const [selectedColor, setSelectedColor] = useState(null);
  const [token, setToken] = useState("");
  const [role, setRole] = useState("user");
  const [ajoutArticle, setAjoutArticle] = useState("none");
  const [cart, setCart] = useState([]);
  const [id, setId] = useState("");
  const [modifArticle, setModifArticle] = useState("none");
  const navigate = useNavigate();

  const handleReload = () => {
    window.location.reload();
  };

  function getProduits() {
    fetch(`http://localhost:5001/api/articles/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data.articles);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  const login = () => {
    setToken(localStorage.getItem("token"));
  };

  const recupRole = useCallback(() => {
    const email = localStorage.getItem("email");

    if (!email) {
      console.error("Email not found in localStorage");
      return;
    }

    fetch(`http://localhost:5001/api/users/${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(error.message || "Network response was not ok");
          });
        }
        return response.json();
      })
      .then((data) => {
        setRole(data.user.role);
        setId(data.user._id);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [token]);

  const addArticle = () => {
    const title = document.getElementById("article-title").value;
    const description = document.getElementById("description-article").value;
    const tags = document.getElementById("tags").value;
    const price = document.getElementById("prix").value;
    const color1 = document.getElementById("color1").value;
    const colorCode1 = document.getElementById("color-code1").value;
    const color2 = document.getElementById("color2").value;
    const colorCode2 = document.getElementById("color-code2").value;
    const color3 = document.getElementById("color3").value;
    const colorCode3 = document.getElementById("color-code3").value;
    const color4 = document.getElementById("color4").value;
    const colorCode4 = document.getElementById("color-code4").value;
    const image = document.getElementById("image").files[0];

    const colors = [color1, color2, color3, color4].filter(
      (color) => color !== ""
    );
    const colors_code = [colorCode1, colorCode2, colorCode3, colorCode4].filter(
      (colorCode) => colorCode !== ""
    );

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", tags);
    formData.append("price", price);
    colors.forEach((color, index) => {
      formData.append(`colors`, color);
    });
    colors_code.forEach((color_code, index) => {
      formData.append(`colors_code`, color_code);
    });
    formData.append("image", image);

    fetch(`http://localhost:5001/api/articles/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(error.message || "Network response was not ok");
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        handleReload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  function handleSearchChange(event) {
    setSearch(event.target.value);
  }

  function handlePriceMinChange(event) {
    setPriceMin(event.target.value);
  }

  function handlePriceMaxChange(event) {
    setPriceMax(event.target.value);
  }

  function setSelectedProduct(value) {
    setSelected("flex");
    setProduct(value);
    setSelectedColor(null);
  }

  function handleAddToCart() {
    if (selectedColor) {
      const productToAdd = {
        productId: product._id,
        quantity: 1,
        price: product.price,
        color: selectedColor,
      };
      fetch(`http://localhost:5001/api/users/${id}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productToAdd),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((error) => {
              throw new Error(error.message || "Network response was not ok");
            });
          }
          return response.json();
        })
        .then((data) => {
          alert(
            `Produit ajouté au panier : ${product.title} - Couleur : ${selectedColor}`
          );
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      alert("Veuillez sélectionner une couleur avant d'ajouter au panier.");
    }
  }

  function getCart() {
    fetch(
      `http://localhost:5001/api/users/${localStorage.getItem("user_id")}/cart`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(error.message || "Network response was not ok");
          });
        }
        return response.json();
      })
      .then((data) => {
        setCart(data.cart);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function handleViewCart() {
    navigate("/cart");
  }

  function cardProduits() {
    return products
      .filter((product) => {
        const matchesSearch = product.title
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesMinPrice =
          priceMin === "" || product.price >= parseFloat(priceMin);
        const matchesMaxPrice =
          priceMax === "" || product.price <= parseFloat(priceMax);
        const matchesTag =
          tag === "" || (product.tags && product.tags.includes(tag));
        return (
          matchesSearch && matchesMinPrice && matchesMaxPrice && matchesTag
        );
      })
      .map((product, index) => {
        return (
          <div
            key={index}
            className="shop-card"
            id="card-article"
            onClick={() => setSelectedProduct(product)}
          >
            <img
              src={
                product.image_urls
                  ? `http://localhost:5001${product.image_urls[0]}`
                  : ""
              }
              alt={product.title}
            />
            <h1>{product.title}</h1>
            <p className="shop-price">{product.price}€</p>
          </div>
        );
      });
  }

  const updateArticle = () => {
    const title = document.getElementById("article-title-modif").value;
    const description = document.getElementById("description-article-modif").value;
    const tags = document.getElementById("tags-modif").value;
    const price = document.getElementById("prix-modif").value;
    const color1 = document.getElementById("color1-modif").value;
    const colorCode1 = document.getElementById("color-code1-modif").value;
    const color2 = document.getElementById("color2-modif").value;
    const colorCode2 = document.getElementById("color-code2-modif").value;
    const color3 = document.getElementById("color3-modif").value;
    const colorCode3 = document.getElementById("color-code3-modif").value;
    const color4 = document.getElementById("color4-modif").value;
    const colorCode4 = document.getElementById("color-code4-modif").value;
    const image = document.getElementById("image-modif").files[0];

    console.log(title);
    console.log(description);
    console.log(tags);
    console.log(price);

    const colors = [color1, color2, color3, color4].filter(
      (color) => color !== ""
    );
    const colors_code = [colorCode1, colorCode2, colorCode3, colorCode4].filter(
      (colorCode) => colorCode !== ""
    );

    if (
      !title ||
      !description ||
      !tags ||
      !price ||
      colors.length === 0 ||
      colors_code.length === 0
    ) {
      return alert("Tous les champs sont obligatoires.");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", tags);
    formData.append("price", price);
    colors.forEach((color, index) => {
      formData.append(`colors`, color);
    });
    colors_code.forEach((color_code, index) => {
      formData.append(`colors_code`, color_code);
    });
    if (image) {
      formData.append("image", image);
    }

    console.log(product._id);
    fetch(`http://localhost:5001/api/articles/${product._id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(error.message || "Network response was not ok");
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        handleReload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const supprimerArticle = () => {
    fetch(`http://localhost:5001/api/articles/${product._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(error.message || "Network response was not ok");
          }
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        handleReload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    getProduits();
    login();
    recupRole();
    getCart();
  }, [recupRole]);

  return (
    <div>
      <div className="shop-banner-top">
        <h1>Boutique</h1>
      </div>
      {selected === "flex" && (
        <div className="shop-overlay" onClick={() => setSelected("none")}></div>
      )}
      <div
        className={`card selected ${selected === "flex" ? "show" : ""}`}
        style={{ display: selected }}
      >
        <div className="shop-left">
          <Carousel
            showArrows={false}
            showStatus={false}
            showThumbs={true}
            showIndicators={false}
          >
            {product.image_urls && product.image_urls.length > 0 ? (
              product.image_urls.map((img, index) => (
                <div key={index}>
                  <img
                    src={`http://localhost:5001${img}`}
                    alt={`${product.title} ${index + 1}`}
                  />
                </div>
              ))
            ) : (
              <div>
                <img src="/path/to/default-image.jpg" alt="Default" />
              </div>
            )}
          </Carousel>
        </div>
        <div className="shop-right">
          <button
            className="shop-button-ajout-article"
            style={{ display: role === "admin" ? "block" : "none" }}
            onClick={() => setModifArticle("block")}
          >
            <h3>Modifier un article</h3>
          </button>
          <h1>{product.title}</h1>
          <p className="shop-price">{product.price}€</p>
          <div className="shop-colors">
            <h3>Couleurs</h3>
            <div className="shop-color-picker">
              {product.colors &&
              product.colors_code &&
              product.colors.length > 0 &&
              product.colors_code.length > 0 ? (
                product.colors.map((color, index) => (
                  <div key={index} className="shop-color-item">
                    <div
                      className="shop-color-box"
                      style={{
                        backgroundColor: product.colors_code[index],
                      }}
                    ></div>
                    <p
                      className={`color ${
                        selectedColor === color ? "selected" : ""
                      }`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </p>
                  </div>
                ))
              ) : (
                <p>Aucune couleur disponible</p>
              )}
            </div>
          </div>
          <div className="shop-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
          <button className="shop-button-ajout" onClick={handleAddToCart}>
            <h3>Ajouter au panier</h3>
          </button>
          <button className="shop-button-buy">
            <h3>Acheter maintenant {product.price}€</h3>
          </button>
        </div>
      </div>
      <div className="shop-tags">
        <ul className="shop-horizontal-tags">
          <li>
            <h4 onClick={() => setTag("")}>Tous</h4>
          </li>
          <li>
            <h4 onClick={() => setTag("Nouveau")}>Nouveautés</h4>
          </li>
          <li>
            <h4 onClick={() => setTag("Accessoire")}>Accessoires</h4>
          </li>
          <li>
            <h4 onClick={() => setTag("Vêtement")}>Vêtements</h4>
          </li>
          <li>
            <h4 onClick={() => setTag("Goodies")}>Goodies</h4>
          </li>
          <li>
            <h4 onClick={() => setTag("Promo")}>Promotions</h4>
          </li>
        </ul>
      </div>
      <button
        className="shop-button-ajout-article"
        style={{ display: role === "admin" ? "block" : "none" }}
        onClick={() => setAjoutArticle("block")}
      >
        <h3>Ajouter un article</h3>
      </button>
      <div className={`shop-secondary ${ajoutArticle === "block" ? "shop-hidden" : ""}`}>
        <div className="shop-card-secondaire" id="card-search">
          <input
            type="text"
            placeholder="Rechercher un article"
            className="shop-input-search"
            id="search"
            value={search}
            onChange={handleSearchChange}
          />
          <div className="shop-filter">
            <h4>Prix</h4>
            <div className="shop-price-range">
              <input
                type="number"
                placeholder="Min"
                value={priceMin}
                onChange={handlePriceMinChange}
              />
              <input
                type="number"
                placeholder="Max"
                value={priceMax}
                onChange={handlePriceMaxChange}
              />
            </div>
            <div className="shop-filter-dispo">
              <input type="checkbox" id="dispo" />
              <label htmlFor="dispo">Disponible</label>
            </div>
          </div>
        </div>
        <button className="shop-button-panier" onClick={handleViewCart}>
          <div className="shop-img">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 6C0 2.68629 2.68629 0 6 0H26C29.3137 0 32 2.68629 32 6V26C32 29.3137 29.3137 32 26 32H6C2.68629 32 0 29.3137 0 26V6ZM26.9275 4.82116C26.2765 4.30889 25.3334 4.4214 24.8212 5.07246C22.9097 7.50185 20.8958 8.5 19.0638 8.5C17.2245 8.5 15.162 7.49418 13.1606 5.04976C12.6358 4.40877 11.6908 4.31457 11.0498 4.83938C10.4088 5.36418 10.3146 6.30924 10.8394 6.95024C13.2046 9.83915 16.0439 11.5 19.0638 11.5C22.0911 11.5 24.894 9.83148 27.1788 6.92754C27.6911 6.27648 27.5786 5.33342 26.9275 4.82116ZM9.5 29H6C4.34315 29 3 27.6569 3 26V5.48811C3 4.66625 3.66625 4 4.48811 4C4.71231 4 4.9046 4.15997 4.94538 4.38044L9.5 29Z"
                fill="white"
              />
              <rect
                x="19.3125"
                y="23.4425"
                width="7.72477"
                height="3.86238"
                rx="1"
                fill="#D91663"
              />
            </svg>
          </div>
          <div className="shop-separator">
            <h3>Voir mon panier</h3>
            <p>{cart.length} articles</p>
          </div>
        </button>
      </div>
      <div className="shop-produits">{cardProduits()}</div>
      <div className="shop-ajout-shadow" style={{ display: ajoutArticle }}>
        <div className="shop-ajout-article">
          <button className="shop-fermer" onClick={() => setAjoutArticle("none")}>
            Fermer
          </button>
          <h3>Ajouter un article</h3>
          <div className="shop-inarticle">
            <h4 htmlFor="article-title">Titre</h4>
            <input type="text" id="article-title" name="article-title" />
            <h4 htmlFor="description-article">description</h4>
            <input
              type="text"
              id="description-article"
              name="description-article"
            />
            <div className="shop-spe-article">
              <div className="shop-block-tags">
                <h4 htmlFor="tags">Tags</h4>
                <input type="text" id="tags" name="tags" />
              </div>
              <div className="shop-block-prix">
                <h4 htmlFor="prix">Prix</h4>
                <input type="text" id="prix" name="prix" />
              </div>
            </div>
            <div className="shop-block-colors">
              <h4 htmlFor="color">Couleurs</h4>
              <div className="shop-input-colors">
                <div className="shop-color-pair">
                  <input
                    type="text"
                    id="color1"
                    name="color1"
                    placeholder="Couleur"
                  />
                  <input
                    type="text"
                    id="color-code1"
                    name="color-code1"
                    placeholder="Code hexa"
                  />
                  <input
                    type="text"
                    id="color2"
                    name="color2"
                    placeholder="Couleur"
                  />
                  <input
                    type="text"
                    id="color-code2"
                    name="color-code2"
                    placeholder="Code hexa"
                  />
                </div>
                <div className="shop-color-pair">
                  <input
                    type="text"
                    id="color3"
                    name="color3"
                    placeholder="Couleur"
                  />
                  <input
                    type="text"
                    id="color-code3"
                    name="color-code3"
                    placeholder="Code hexa"
                  />
                  <input
                    type="text"
                    id="color4"
                    name="color4"
                    placeholder="Couleur"
                  />
                  <input
                    type="text"
                    id="color-code4"
                    name="color-code4"
                    placeholder="Code hexa"
                  />
                </div>
              </div>
            </div>
            <div className="shop-block-image">
              <h4 htmlFor="image">Image</h4>
              <input
                type="file"
                id="image"
                className="shop-input-image"
                name="image"
              />
            </div>
            <button className="shop-enregistrer-article" onClick={addArticle}>
              <h3>Enregistrer l'article</h3>
            </button>
          </div>
        </div>
      </div>
      <div className="shop-ajout-shadow" style={{ display: modifArticle }}>
        <div className="shop-ajout-article">
          <button className="shop-fermer" onClick={() => setModifArticle("none")}>
            Fermer
          </button>
          <h3>Modifier un article</h3>
          <div className="shop-inarticle">
            <h4 htmlFor="article-title-modif">Titre</h4>
            <input
              type="text"
              id="article-title-modif"
              name="article-title-modif"
              value={product.title}
              onChange={(e) =>
                setProduct({ ...product, title: e.target.value })
              }
            />
            <h4 htmlFor="description-article-modif">description</h4>
            <input
              type="text"
              id="description-article-modif"
              name="description-article-modif"
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            />
            <div className="shop-spe-article">
              <div className="shop-block-tags">
                <h4 htmlFor="tags-modif">Tags</h4>
                <input
                  type="text"
                  id="tags-modif"
                  name="tags-modif"
                  value={product.tags}
                  onChange={(e) =>
                    setProduct({ ...product, tags: e.target.value })
                  }
                />
              </div>
              <div className="shop-block-prix">
                <h4 htmlFor="prix-modif">Prix</h4>
                <input
                  type="text"
                  id="prix-modif"
                  name="prix-modif"
                  value={product.price}
                  onChange={(e) =>
                    setProduct({ ...product, price: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="shop-block-colors">
              <h4 htmlFor="color-modif">Couleurs</h4>
              <div className="shop-input-colors">
                <div className="shop-color-pair">
                  <input
                    type="text"
                    id="color1-modif"
                    name="color1-modif"
                    placeholder="Couleur"
                    value={product.colors ? product.colors[0] : ""}
                    onChange={(e) => {
                      const newColors = [...product.colors];
                      newColors[0] = e.target.value;
                      setProduct({ ...product, colors: newColors });
                    }}
                  />
                  <input
                    type="text"
                    id="color-code1-modif"
                    name="color-code1-modif"
                    placeholder="Code hexa"
                    value={product.colors_code ? product.colors_code[0] : ""}
                    onChange={(e) => {
                      const newColorsCode = [...product.colors_code];
                      newColorsCode[0] = e.target.value;
                      setProduct({ ...product, colors_code: newColorsCode });
                    }}
                  />
                  <input
                    type="text"
                    id="color2-modif"
                    name="color2-modif"
                    placeholder="Couleur"
                    value={product.colors ? product.colors[1] : ""}
                    onChange={(e) => {
                      const newColors = [...product.colors];
                      newColors[1] = e.target.value;
                      setProduct({ ...product, colors: newColors });
                    }}
                  />
                  <input
                    type="text"
                    id="color-code2-modif"
                    name="color-code2-modif"
                    placeholder="Code hexa"
                    value={product.colors_code ? product.colors_code[1] : ""}
                    onChange={(e) => {
                      const newColorsCode = [...product.colors_code];
                      newColorsCode[1] = e.target.value;
                      setProduct({ ...product, colors_code: newColorsCode });
                    }}
                  />
                </div>
                <div className="shop-color-pair">
                  <input
                    type="text"
                    id="color3-modif"
                    name="color3-modif"
                    placeholder="Couleur"
                    value={product.colors ? product.colors[2] : ""}
                    onChange={(e) => {
                      const newColors = [...product.colors];
                      newColors[2] = e.target.value;
                      setProduct({ ...product, colors: newColors });
                    }}
                  />
                  <input
                    type="text"
                    id="color-code3-modif"
                    name="color-code3-modif"
                    placeholder="Code hexa"
                    value={product.colors_code ? product.colors_code[2] : ""}
                    onChange={(e) => {
                      const newColorsCode = [...product.colors_code];
                      newColorsCode[2] = e.target.value;
                      setProduct({ ...product, colors_code: newColorsCode });
                    }}
                  />
                  <input
                    type="text"
                    id="color4-modif"
                    name="color4-modif"
                    placeholder="Couleur"
                    value={product.colors ? product.colors[3] : ""}
                    onChange={(e) => {
                      const newColors = [...product.colors];
                      newColors[3] = e.target.value;
                      setProduct({ ...product, colors: newColors });
                    }}
                  />
                  <input
                    type="text"
                    id="color-code4-modif"
                    name="color-code4-modif"
                    placeholder="Code hexa"
                    value={product.colors_code ? product.colors_code[3] : ""}
                    onChange={(e) => {
                      const newColorsCode = [...product.colors_code];
                      newColorsCode[3] = e.target.value;
                      setProduct({ ...product, colors_code: newColorsCode });
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="shop-block-image">
              <h4 htmlFor="image">Image</h4>
              <input
                type="file"
                id="image-modif"
                className="shop-input-image"
                name="image"
              />
            </div>
            <button className="shop-enregistrer-article" onClick={updateArticle}>
              <h3>Modifier l'article</h3>
            </button>
            <button className="shop-supprimer-article" onClick={supprimerArticle}>
              <h3>Supprimer l'article</h3>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shop;
