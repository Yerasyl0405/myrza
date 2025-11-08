import React, { useState } from 'react';
import './BreadCard.css';

const BreadCard = ({ bread, onAddToOrder }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (quantity > 0) {
      onAddToOrder(bread.id, quantity);
      setQuantity(1);
    }
  };

  return (
    <div className="bread-card">
      <div className="bread-image">
        <img
          src={bread.imageUrl || '/default-bread.jpg'}
          alt={bread.name}
          onError={(e) => {
            e.target.src = '/default-bread.jpg';
          }}
        />
      </div>
      <div className="bread-info">
        <h3 className="bread-name">{bread.name}</h3>
        <p className="bread-description">{bread.description}</p>
        <div className="bread-price">{bread.price} ₽</div>

        <div className="quantity-controls">
          <button
            className="quantity-btn"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            -
          </button>
          <span className="quantity">{quantity}</span>
          <button
            className="quantity-btn"
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </button>
        </div>

        <button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
        >
          Добавить в заказ
        </button>
      </div>
    </div>
  );
};

export default BreadCard;