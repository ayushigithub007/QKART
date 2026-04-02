import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack,Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";


 
export const generateCartItemsFrom = (cartData, productsData) => {
  if (!cartData || !productsData) return [];

  return cartData
    .map((cartItem) => {
      const product = productsData.find(
        (p) => p._id === cartItem.productId
      );

      if (!product) return null;

      return {
        productId: cartItem.productId,
        qty: cartItem.qty,
        name: product.name,
        category: product.category,
        cost: product.cost,
        rating: product.rating,
        image: product.image,
      };
    })
    .filter(Boolean);
};




export const getTotalCartValue = (items = []) => {
  return items.reduce((total, item) => {
    return total + item.cost * item.qty;
  }, 0);
};

export const getTotalItems = (items = []) => {
  return items.reduce((total, item) => {
    return total + item.qty;
  }, 0);
};




const ItemQuantity = ({
  value,
  handleAdd,
  handleDelete,
}) => {
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

/**
 * Component to display the Cart view
 * 
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 * 
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 * 
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const Cart = ({
  products,
  items = [],
  handleQuantity,
  readonly=false,
}) => {
  const history = useHistory();

  return (
    <Box className="cart">

      {/* EMPTY MESSAGE */}
      {!items.length ? (
        <Box className="empty">
          <ShoppingCartOutlined className="empty-cart-icon" />
          <Box color="#aaa" textAlign="center">
            Cart is empty. Add more items to the cart to checkout.
          </Box>
        </Box>
      ) : (
        <>
          {/* CART ITEMS */}
          {items.map((item) => (
            <Box
              key={item.productId}
              display="flex"
              alignItems="center"
              padding="1rem"
              borderBottom="1px solid #ddd"
            >
              <Box
                component="img"
                src={item.image}
                alt={item.name}
                width="80px"
                height="80px"
                marginRight="1rem"
              />

              <Box flexGrow={1}>
                <Typography fontWeight="500">{item.name}</Typography>

                {readonly ? (
                          <Typography>
                            Qty: {item.qty}
                          </Typography>
                        ) : (
                          <ItemQuantity
                            value={item.qty}
                            handleAdd={() =>
                              handleQuantity(item.productId, item.qty + 1)
                            }
                            handleDelete={() =>
                              handleQuantity(item.productId, item.qty - 1)
                            }
                          />
                        )}
              </Box>
              <Box textAlign="right">
  {/* Always show unit price */}
  <Typography>
    {`$${item.cost}`}
  </Typography>

  {/* Show line total ONLY if qty > 1 */}
  {item.qty > 1 && (
    <Typography fontWeight="600">
      {`$${item.cost * item.qty}`}
    </Typography>
  )}
</Box>

            </Box>
          ))}

          {/* ORDER TOTAL */}
          <Box
            padding="1rem"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box fontWeight="500">Order total</Box>
            <Box
              fontWeight="700"
              fontSize="1.5rem"
              data-testid="cart-total"
            >
              ${getTotalCartValue(items)}
            </Box>
          </Box>
        </>
      )}
      {readonly && (
  <Box padding="1rem" borderTop="1px solid #ddd">
    <Typography variant="h6" gutterBottom>
      Order Details
    </Typography>

    <Box display="flex" justifyContent="space-between">
      <Typography>Total Items</Typography>
      <Typography>
        {getTotalItems(items)}
      </Typography>
    </Box>

    <Box display="flex" justifyContent="space-between" mt={1}>
      <Typography>Total Amount</Typography>
      <Typography fontWeight="700">
        {`$${getTotalCartValue(items)}`}
      </Typography>
    </Box>
  </Box>
)}


      {/* CHECKOUT BUTTON — ALWAYS RENDERED */}
      {!readonly && (
  <Box display="flex" justifyContent="flex-end" padding="1rem">
    <Button
      color="primary"
      variant="contained"
      startIcon={<ShoppingCart />}
      className="checkout-btn"
      onClick={() => history.push("/checkout")}
    >
      Checkout
    </Button>
  </Box>
)}
    </Box>
  );
};

export default Cart;