export default function checkoutReducer(checkout, action) {
  switch (action.type) {
    case "empty":
      return [];
    case "test":
      return {
        city: "",
        country: "",
        billingInfo: "",
        payment: "",
      };
    case "update":
      const { field, value } = action;

      return { ...checkout, [field]: value };

    /*   return checkout.map((row) =>
        Object.keys(row)[0] === field ? { [field]: value } : row
      ); */

    default:
      throw new Error("Unhandled action" + action.type);
  }
}
