import { CreditCard, Delete } from "@mui/icons-material";
import {
  Button,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { config } from "../App";
import Cart, {
  getTotalCartValue,
  generateCartItemsFrom,
} from "./Cart";
import "./Checkout.css";
import Footer from "./Footer";
import Header from "./Header";

const AddNewAddressView = ({
  token,
  newAddress,
  handleNewAddress,
  addAddress,
}) => {
  return (
    <Box display="flex" flexDirection="column">
      <TextField
        multiline
        minRows={4}
        placeholder="Enter your complete address"
        value={newAddress.value}
        onChange={(e) =>
          handleNewAddress({
            ...newAddress,
            value: e.target.value,
          })
        }
      />
      <Stack direction="row" my="1rem" spacing={2}>
        <Button
          variant="contained"
          onClick={() => addAddress(token, newAddress)}
        >
          Add
        </Button>
        <Button
          variant="text"
          onClick={() =>
            handleNewAddress({
              isAddingNewAddress: false,
              value: "",
            })
          }
        >
          Cancel
        </Button>
      </Stack>
    </Box>
  );
};

const Checkout = () => {
  const token = localStorage.getItem("token");
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState({
    all: [],
    selected: "",
  });

  const [newAddress, setNewAddress] = useState({
    isAddingNewAddress: false,
    value: "",
  });

  
  useEffect(() => {
    if (!token) {
      enqueueSnackbar(
        "You must be logged in to access checkout page",
        { variant: "info" }
      );
      history.push("/login");
    } else {
      getAddresses(token);
    }
  }, [token]);

 
  useEffect(() => {
    const onLoad = async () => {
      const productsRes = await axios.get(
        `${config.endpoint}/products`
      );
      setProducts(productsRes.data);

      const cartRes = await axios.get(
        `${config.endpoint}/cart`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const cartItems = generateCartItemsFrom(
        cartRes.data,
        productsRes.data
      );
      setItems(cartItems);
    };

    if (token) onLoad();
  }, []);

  const getAddresses = async (token) => {
    try {
      const response = await axios.get(
        `${config.endpoint}/user/addresses`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAddresses({
        ...addresses,
        all: response.data,
      });
    } catch {
      enqueueSnackbar("Failed to fetch addresses", {
        variant: "error",
      });
    }
  };

 
  const addAddress = async (token, newAddress) => {
    if (!newAddress.value.trim()) {
      enqueueSnackbar("Address cannot be empty", {
        variant: "warning",
      });
      return;
    }

    try {
      const response = await axios.post(
        `${config.endpoint}/user/addresses`,
        { address: newAddress.value },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAddresses({
        all: response.data,
        selected: "",
      });

      setNewAddress({
        isAddingNewAddress: false,
        value: "",
      });
    } catch (e) {
      enqueueSnackbar(
        e.response?.data?.message || "Failed to add address",
        { variant: "error" }
      );
    }
  };

 
  const deleteAddress = async (token, addressId) => {
    try {
      const response = await axios.delete(
        `${config.endpoint}/user/addresses/${addressId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAddresses({
        all: response.data,
        selected: "",
      });
    } catch (e) {
      enqueueSnackbar(
        e.response?.data?.message || "Failed to delete address",
        { variant: "error" }
      );
    }
  };

 
  const validateRequest = (items, addresses) => {
    const totalAmount = getTotalCartValue(items);
    const balance = Number(localStorage.getItem("balance"));

    if (totalAmount > balance) {
      enqueueSnackbar(
        "You do not have enough balance in your wallet for this purchase",
        { variant: "warning" }
      );
      return false;
    }

    if (!addresses.all.length) {
      enqueueSnackbar(
        "Please add a new address before proceeding.",
        { variant: "warning" }
      );
      return false;
    }

    if (!addresses.selected) {
      enqueueSnackbar(
        "Please select one shipping address to proceed.",
        { variant: "warning" }
      );
      return false;
    }

    return true;
  };

  const performCheckout = async () => {
    if (!validateRequest(items, addresses)) return;

    try {
      await axios.post(
        `${config.endpoint}/cart/checkout`,
        { addressId: addresses.selected },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      enqueueSnackbar("Order placed successfully!", {
        variant: "success",
      });

      history.push("/thanks");
    } catch (e) {
      enqueueSnackbar(
        e.response?.data?.message ||
          "Wallet balance not sufficient to place order",
        { variant: "error" }
      );
    }
  };

  return (
    <>
      <Header />
      <Grid container>
        <Grid item xs={12} md={9}>
          <Box className="shipping-container" minHeight="100vh">
            <Typography variant="h4" my="1rem">
              Shipping
            </Typography>

            <Divider />

            <Box mt={2}>
              {addresses.all.length === 0 ? (
                <Typography>
                  No addresses found for this account.
                </Typography>
              ) : (
                addresses.all.map((address) => (
                  <Box
                    key={address._id}
                    className={`address-item ${
                      addresses.selected === address._id
                        ? "selected"
                        : "not-selected"
                    }`}
                    onClick={() =>
                      setAddresses({
                        ...addresses,
                        selected: address._id,
                      })
                    }
                  >
                    <Typography>{address.address}</Typography>

                    <Button
                      startIcon={<Delete />}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAddress(token, address._id);
                      }}
                    >
                      DELETE
                    </Button>
                  </Box>
                ))
              )}
            </Box>

            {!newAddress.isAddingNewAddress ? (
              <Button
                variant="contained"
                id="add-new-btn"
                onClick={() =>
                  setNewAddress({
                    ...newAddress,
                    isAddingNewAddress: true,
                  })
                }
              >
                Add new address
              </Button>
            ) : (
              <AddNewAddressView
                token={token}
                newAddress={newAddress}
                handleNewAddress={setNewAddress}
                addAddress={addAddress}
              />
            )}

            <Divider sx={{ my: 3 }} />

            <Typography variant="h4" my="1rem">
              Payment
            </Typography>

            <Typography>
              Pay ${getTotalCartValue(items)} of available $
              {localStorage.getItem("balance")}
            </Typography>

            <Button
              startIcon={<CreditCard />}
              variant="contained"
              sx={{ mt: 2 }}
              onClick={performCheckout}
            >
              PLACE ORDER
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={3} bgcolor="#E9F5E1">
          <Cart readonly products={products} items={items} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default Checkout;