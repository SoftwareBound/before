import React, { useReducer, useEffect, useContext } from "react";
import checkoutReducer from "./checkoutReducer";

export const CheckoutContext = React.createContext(null);

let initialCheckout;

try {
  initialCheckout = JSON.parse(localStorage.getItem("checkout")) ?? {
    city: "",
    country: "",
    billingInfo: "",
    payment: "",
  };
} catch {
  console.error("The checkout could not be parsed intoJSON");
  initialCheckout = [];
}
export function CheckoutProvider(props) {
  const [checkout, dispatch] = useReducer(checkoutReducer, initialCheckout);
  useEffect(() => {
    localStorage.setItem("checkout", JSON.stringify(checkout));
  }, [checkout]);
  const contextValue = {
    checkout,
    dispatch,
  };
  return (
    <CheckoutContext.Provider value={contextValue}>
      {props.children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
}
