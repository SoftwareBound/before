import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import ErrorBoundary from "./ErrorBoundary";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./cartContext";
import { CheckoutProvider } from "./checkoutContext";

ReactDOM.render(
  <ErrorBoundary>
    <BrowserRouter>
      <CartProvider>
        <CheckoutProvider>
          <App />
        </CheckoutProvider>
      </CartProvider>
    </BrowserRouter>
  </ErrorBoundary>,
  document.getElementById("root")
);
