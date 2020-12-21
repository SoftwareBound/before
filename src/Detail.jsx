import React, { useState, useEffect } from "react";
import useFetch from "./services/useFetch";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "./Spinner";
import PageNotFound from "./PageNotFound";
import { useCart } from "./cartContext";

export default function Detail() {
  const { dispatch } = useCart();
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, loading, error } = useFetch(`products/${id}`);
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState(0);
  useEffect(() => {
    if (product) setPrice(product.price);
  }, [product]);
  if (loading) return <Spinner />;
  if (!product) return <PageNotFound />;

  if (error) throw error;

  return (
    <div id="detail">
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p id="price">${product.price}</p>
      <select id="size" value={sku} onChange={(e) => setSku(e.target.value)}>
        <option value="">All sizes</option>
        {product.skus.map((s) => (
          <option key={s.sku} value={s.sku}>
            {s.size}
          </option>
        ))}
      </select>
      <p>
        <button
          className="btn btn-primary"
          onClick={() => {
            dispatch({ type: "add", id, sku, price });
            navigate("/cart");
          }}
          disabled={!sku}
        >
          Add to cart
        </button>
      </p>
      <img src={`/images/${product.image}`} alt={product.category} />
    </div>
  );
}
