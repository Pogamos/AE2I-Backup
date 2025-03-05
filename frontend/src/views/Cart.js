import React, { useState, useEffect } from 'react';
import "../css/Cart.css"

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const fetchCartData = async () => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    try {
      const response = await fetch(`http://localhost:5000/api/users/${email}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const currentUser = data.user;

      const articlesResponse = await fetch('http://localhost:5000/api/articles', {
        headers: {
          "Accept": "application/json"
        }
      });
      
      if (!articlesResponse.ok) {
        throw new Error(`HTTP error! status: ${articlesResponse.status}`);
      }

      const articlesData = await articlesResponse.json();
      const articles = articlesData.articles;

      const enrichedCartItems = currentUser.cart.map((cartItem, index) => {
        const article = articles.find(art => art._id === cartItem.productId);
        if (!article) {
          console.warn(`Article not found for productId: ${cartItem.productId}`);
          return null;
        }
        return {
          ...cartItem,
          ...article,
          photo: article.photo[0],
          color: cartItem.color,
          totalItemPrice: parseFloat(cartItem.price) * cartItem.quantity,
          cartIndex: index
        };
      }).filter(Boolean); // Remove null items

      setCartItems(enrichedCartItems);
      const total = enrichedCartItems.reduce(
        (sum, item) => sum + item.totalItemPrice, 
        0
      );
      setTotalPrice(total);
      setError(null);
    } catch (error) {
      console.error("Error fetching cart data:", error);
      setError("Erreur lors du chargement du panier");
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const removeFromCart = async (productId, cartIndex) => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
  
    try {
      const userResponse = await fetch(`http://localhost:5000/api/users/${email}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
      });

      if (!userResponse.ok) {
        throw new Error(`HTTP error! status: ${userResponse.status}`);
      }

      const userData = await userResponse.json();
      
      const updatedCart = userData.user.cart.filter((_, index) => index !== cartIndex)
        .map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          color: item.color
        }));
  
      const updateResponse = await fetch(`http://localhost:5000/api/users/${userData.user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify({
          cart: updatedCart
        })
      });
  
      if (!updateResponse.ok) {
        throw new Error(`HTTP error! status: ${updateResponse.status}`);
      }

      await fetchCartData();
      setError(null);
    } catch (error) {
      console.error("Error removing from cart:", error);
      setError("Erreur lors de la suppression de l'article");
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setError("Votre panier est vide");
      return;
    }

    setIsProcessing(true);
    setError(null);
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    try {
      const userResponse = await fetch(`http://localhost:5000/api/users/${email}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
      });

      if (!userResponse.ok) {
        throw new Error(`HTTP error! status: ${userResponse.status}`);
      }

      const userData = await userResponse.json();
      const userId = userData.user._id;

      const commandResponse = await fetch('http://localhost:5000/api/commands/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify({
          user_id: userId,
          items: cartItems.map(item => item.productId),
          total_price: totalPrice
        })
      });

      if (!commandResponse.ok) {
        throw new Error(`HTTP error! status: ${commandResponse.status}`);
      }

      const clearCartResponse = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify({
          cart: []
        })
      });

      if (!clearCartResponse.ok) {
        throw new Error(`HTTP error! status: ${clearCartResponse.status}`);
      }

      alert('Commande validée avec succès !');
      setCartItems([]);
      setTotalPrice(0);
      setError(null);
    } catch (error) {
      console.error('Error during checkout:', error);
      setError('Une erreur est survenue lors de la validation de votre commande');
    } finally {
      setIsProcessing(false);
    }
  };
     
  return (
    <div className="page">
      <div className="banner-top py-6">
        <h1 className="text-4xl font-bold text-left">Mon panier</h1>
      </div>
      {error && (
        <div className="error-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="cart-container">
        <div className="cart-items-section">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={`${item.productId}-${item.cartIndex}`} className="cart-item">
                <div className="item-details">
                  <img 
                    src={`/uploads/${item.photo}`} 
                    alt={item.title} 
                    className="cart-item-image"
                  />
                  <div className="item-info">
                    <span>{item.title}</span>
                    <div className="item-options">
                      <span>Couleur: {item.color || 'N/A'}</span>
                    </div>
                    <span>Prix : {item.totalItemPrice.toFixed(2)}€</span>
                    <button 
                      onClick={() => removeFromCart(item.productId, item.cartIndex)}
                      disabled={isProcessing}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="cart-payment-section">
          <div className="total">
            <span>Total</span>
            <span>{totalPrice.toFixed(2)}€</span>
          </div>
          <button 
            className="validate-cart disabled:opacity-50"
            onClick={handleCheckout}
            disabled={isProcessing || cartItems.length === 0}
          >
            {isProcessing ? 'Traitement en cours...' : 'Valider mon panier'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;