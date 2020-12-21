export default function cartReducer(cart, action) {
  switch (action.type) {
    case "empty":
      return [];
    case "add":
      const { id, sku, price } = action;
      const itemInCart = cart.find((i) => i.sku === sku);
      if (itemInCart) {
        return cart.map((i) =>
          i.sku === sku ? { ...i, quantity: i.quantity + 1, price } : i
        );
      } else {
        return [...cart, { id, sku, price, quantity: 1 }];
      }
    case "updateQuantity": {
      const { sku, quantity, price } = action;
      if (!quantity) {
        return cart.filter((i) => i.sku !== sku);
      }

      return cart.map((i) =>
        i.sku === sku ? { ...i, quantity, price: price } : i
      );
    }

    default:
      throw new Error("Unhandled action" + action.type);
  }
}
