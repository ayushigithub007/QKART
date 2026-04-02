import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import Cart from "./Cart";
import "./Products.css";
import { generateCartItemsFrom } from "./Cart";


const Products = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");


  const token = localStorage.getItem("token");
  const isLoggedIn = token && token !== "null";




  const performAPICall = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.endpoint}/products`);
      setProducts(response.data);
    } catch (err) {
      enqueueSnackbar(
        "Something went wrong. Check backend connection.",
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async (text) => {
    if (!text.trim()) {
      performAPICall();
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      setProducts(response.data || []);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setProducts([]);
      } else {
        enqueueSnackbar("Search failed", { variant: "error" });
      }
    } finally {
      setLoading(false);
    }
  };


  const fetchCart = async () => {
    if (!token) return;

    try {
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const fullCartItems = generateCartItemsFrom(
        response.data,
        products
      );
  
      setCartItems(fullCartItems);
    } catch (err) {
      enqueueSnackbar("Could not fetch cart details", {
        variant: "error",
      });
    }
  };


  const addToCart = async (
    productId,
    qty,
    options = {}
  ) => {
  
    if (
      options.preventDuplicate &&
      isItemInCart(cartItems, productId)
    ) {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        { variant: "warning" }
      );
      return;
    }
  
    try {
      const response = await axios.post(
        `${config.endpoint}/cart`,
        { productId, qty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const updatedCart = generateCartItemsFrom(
        response.data,
        products
      );
  
      setCartItems(updatedCart);
  
    } catch (err) {
      enqueueSnackbar("Could not update cart", {
        variant: "error",
      });
    }
  };
  

  // Load products + cart on page load
  useEffect(() => {
    performAPICall();
  }, []);
  
  useEffect(() => {
    if (token && products.length > 0) {
      fetchCart();
    }
  }, [products]);
  

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchText);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  const isItemInCart = (items, productId) => {
    return items.some((item) => item.productId === productId);
  };
  
  

  const displayProducts = () => {
    if (loading) {
      return (
        <Box textAlign="center" mt={5}>
          <CircularProgress />
          <Typography mt={2}>Loading Products</Typography>
        </Box>
      );
    }

    if (products.length === 0) {
      return (
        <Box
          width="100%"
          textAlign="center"
          mt={5}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <SentimentDissatisfied fontSize="large" />
          <Typography>No products found</Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item key={product._id} xs={6} md={3}>
            <ProductCard
              product={product}
              handleAddToCart={() =>
                addToCart(product._id, 1, { preventDuplicate: true })
              }              
            />
          </Grid>
        ))}
      </Grid>
    );
  };



  return (
    <div>
      <Header hasHiddenAuthButtons={false}>
        <TextField
          className="search-desktop"
          size="small"
          placeholder="Search for items/categories"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
        />
      </Header>

      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        placeholder="Search for items/categories"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
      />

      <Box className="hero">
        <p className="hero-heading">
          India’s <span className="hero-highlight">FASTEST DELIVERY</span> to your
          door step
        </p>
      </Box>

      <Grid container spacing={2} padding={2}>
        {/* PRODUCTS */}
        <Grid item md={isLoggedIn ? 9 : 12} xs={12} mt={2}>
          {displayProducts()}
        </Grid>

        {/* CART — ONLY WHEN LOGGED IN */}
        {token && (
          <Grid item xs={12} md={3} mt={2}>
            <Cart
              products={products}
              items={cartItems}
              handleQuantity={(productId, qty) =>
                addToCart(productId, qty)
              }
            />
          </Grid>
        )}
      </Grid>

      <Footer />
    </div>
  );
};

export default Products;
