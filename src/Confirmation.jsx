import React, { useState, useEffect } from "react";
import { getProduct } from "./services/productService";
import { useCart } from "./cartContext";
import useFetchAll from "./services/useFetchAll";
import Spinner from "./Spinner";

export default function Confirmation() {
  const { cart, dispatch } = useCart();
  const urls = cart.map((i) => `products/${i.id}`);
  const [flag, setFlag] = useState(false);
  const { data: products, loading, error } = useFetchAll(urls);

  useEffect(() => {
    if (flag) {
      dispatch({ type: "empty" });
    }
  }, [flag]);

  function getData(itemInCart) {
    const { id, sku, quantity } = itemInCart;
    const { price, name, image, skus } = products.find(
      (p) => p.id === parseInt(id)
    );

    const { size } = skus.find((s) => s.sku === sku);
    return (
      <li key={sku} className="cart-item">
        <img src={`/images/${image}`} alt={name} />
        <div>
          <h3>{name}</h3>
          <p>${price * quantity}</p>
          <p>Size: {size}</p>
          <p>Quantity: {quantity}</p>
        </div>
      </li>
    );
  }
  if (loading) return <Spinner />;
  if (flag) {
    return <h1>Order Placed!</h1>;
  }

  return (
    <>
      <h1>Order Confirmation</h1>
      <section id="cart">
        <ul>{cart.map(getData)}</ul>
      </section>
      <section hidden={flag}>
        <div>
          Total Price: {cart.reduce((total, item) => total + item.price, 0)} $
        </div>
        <button onClick={() => setFlag(true)}>Place your order</button>
      </section>
    </>
  );
}
