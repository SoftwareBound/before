import React, { useState, useEffect } from "react";
import { saveShippingAddress } from "./services/shippingService";

import { useNavigate } from "react-router-dom";
import { useCheckout } from "./checkoutContext";

// Declaring outside component to avoid recreation on each render

const STATUS = {
  IDLE: "IDLE",
  SUBMITTED: "SUBMITTED",
  SUBMITTING: "SUBMITTING",
  COMPLETED: "COMPLETED",
};
const customerDetails = {
  city: "",
  country: "",
  billingInfo: "",
  payment: "",
};

export default function Checkout() {
  const { checkout, dispatch } = useCheckout();
  const [details, setDetails] = useState(checkout);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [saveError, setSaveError] = useState(null);
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  //dervied stats
  const errors = getErrors(details);
  const isValid = Object.keys(errors).length === 0;

  useEffect(() => {
    if (status === STATUS.COMPLETED) navigate("/order-confirmation");
  }, [status]);

  function handleChange(e) {
    e.persist();
    setDetails((customerDetails) => {
      return {
        ...customerDetails,
        [e.target.id]: e.target.value,
      };
    });
  }

  function handleBlur(event) {
    event.persist();
    dispatch({
      type: "update",
      field: event.target.id,
      value: event.target.value,
    });
    setTouched((cur) => {
      return { ...cur, [event.target.id]: true };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus(STATUS.SUBMITTING);
    if (isValid) {
      try {
        await saveShippingAddress(details);
        setStatus(STATUS.COMPLETED);
        dispatch({ type: "test" });
      } catch (e) {
        setSaveError(e);
      }
    } else {
      setStatus(STATUS.SUBMITTED);
    }
  }
  function getErrors(details) {
    const result = {};
    if (!details.city) result.city = "City is required";
    if (!details.country) result.country = "Country is required";
    if (!details.billingInfo) result.billingInfo = "Billing Info is required";
    if (!details.payment) result.payment = "Payment is required";
    return result;
  }
  if (saveError) throw saveError;

  return (
    <>
      <h1>Shipping Info</h1>
      {!isValid && status === STATUS.SUBMITTED && (
        <div role="alert">
          <p>Please fix the following errors</p>
          <ul>
            {Object.keys(errors).map((key) => {
              return <li key={key}>{errors[key]}</li>;
            })}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="city">City</label>
          <br />
          <input
            id="city"
            type="text"
            value={details.city}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <p role="alert">
            {(touched.city ||
              status === STATUS.SUBMITTED ||
              checkout.city.length > 0) &&
              errors.city}
          </p>
        </div>

        <div>
          <label htmlFor="country">Country</label>
          <br />
          <select
            id="country"
            value={details.country}
            onBlur={handleBlur}
            onChange={handleChange}
          >
            <option value="">Select Country</option>
            <option value="China">China</option>
            <option value="India">India</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="USA">USA</option>
          </select>
          <p role="alert">
            {(touched.country ||
              status === STATUS.SUBMITTED ||
              checkout.country.length > 0) &&
              errors.country}
          </p>
        </div>
        <div>
          <label htmlFor="billingInfo">Billing Info</label>
          <br />
          <input
            id="billingInfo"
            type="text"
            value={details.billingInfo}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <p role="alert">
            {(touched.billingInfo ||
              status === STATUS.SUBMITTED ||
              checkout.billingInfo.length > 0) &&
              errors.billingInfo}
          </p>
        </div>
        <div>
          <label htmlFor="payment">Payment</label>
          <br />
          <input
            id="payment"
            type="text"
            value={details.payment}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <p role="alert">
            {(touched.payment ||
              status === STATUS.SUBMITTED ||
              checkout.payment.length > 0) &&
              errors.payment}
          </p>
        </div>

        <div>
          <input
            type="submit"
            className="btn btn-primary"
            value="Save Shipping Info"
            disabled={status === STATUS.SUBMITTING}
          />
        </div>
      </form>
    </>
  );
}
