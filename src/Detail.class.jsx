import React from "react";
//import useFetch from "./services/useFetch";
import { useNavigate, useParams } from "react-router-dom";
import { Fetch } from "./services/useFetch";
import Spinner from "./Spinner";
import PageNotFound from "./PageNotFound";
//import { useCart } from "./cartContext";
import { CartContext } from "./cartContext";

export default function DetailWrapper() {
  const { id } = useParams();
  const navigate = useNavigate();

  return <Detail id={id} navigate={useNavigate()} />;
}

class Detail extends React.Component {
  state = {
    sku: "",
  };

  render() {
    const { id, navigate } = this.props;

    const { sku } = this.state;

    return (
      <CartContext.Consumer>
        {({ dispatch }) => {
          return (
            <Fetch url={`products/${id}`}>
              {(product, loading, error) => {
                if (loading) return <Spinner />;
                if (!product) return <PageNotFound />;
                if (error) throw error;
                return (
                  <div id="detail">
                    <h1>{product.name}</h1>
                    <p>{product.description}</p>
                    <p id="price">${product.price}</p>
                    <select
                      id="size"
                      value={sku}
                      onChange={(e) => this.setState({ sku: e.target.value })}
                    >
                      <option value="">All sizes</option>
                      {product.skus.map((s) => (
                        <option key={s.sku} value={s.size}>
                          {s.size}
                        </option>
                      ))}
                    </select>
                    <p>
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          this.context.dispatch({ type: "add", id, sku });
                          navigate("/cart");
                        }}
                        disabled={!sku}
                      >
                        Add to cart
                      </button>
                    </p>
                    <img
                      src={`/images/${product.image}`}
                      alt={product.category}
                    />
                  </div>
                );
              }}
            </Fetch>
          );
        }}
      </CartContext.Consumer>
    );
  }
}
