import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart, { generateCartItemsFrom } from "./Cart"



const Products = () => {
  const token = localStorage.getItem("token");
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [isProductsLoading, setProductsLoading] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  useEffect(() => {
    performAPICall();
  }, []);
  useEffect(() => {
    fetchCart(token).then((cartData) => generateCartItemsFrom(cartData, products)).then((cartItems) => {
      setItems(cartItems);
    });
  }, [products])
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    setProductsLoading(true);
    try {
      const response = await axios.get(`${config.endpoint}/products`);
      setProductsLoading(false);
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      if (error.response && error.response.status === 500) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
        return null;
      } else {
        enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.", { variant: "error" });
      }
      setProductsLoading(false);
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    try {
      const response = await axios.get(`${config.endpoint}/products/search?value=${text}`);
      setFilteredProducts(response.data);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setFilteredProducts([]);
        }
        if (error.response.status === 500) {
          enqueueSnackbar(error.response.data.message, { variant: "error" });
          setFilteredProducts(products);
        }
      } else {
        enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.", { variant: "error" });
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    const value = event.target.value;
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(async () => {
      await performSearch(value);
    }, 500)
    setDebounceTimeout(timeout);
  };

  const isItemInCart = (items, productId) => {
    return items.findIndex((item) => item.productId === productId) !== -1
  }

  const addToCart = async (token, cartItems, productId, products, qty, options) => {
    if (!token) {
      enqueueSnackbar("Please log in to add item to cart", { variant: "warning" });
      return;
    }
    if (options.preventDuplicate && isItemInCart(cartItems, productId)) {
      enqueueSnackbar("Item already in cart. Use the cart sidebar to update quanity or remove item", { variant: "warning" });
      return;
    }
    try {
      const response = await axios.post(
        `${config.endpoint}/cart`,
        {
          productId,
          qty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const items = generateCartItemsFrom(response.data, products);
      setItems(items);
    } catch (error) {
      console.log(error.response.data);
      enqueueSnackbar("Could not fetch cart Details. Check that the backend is running,reachable and returns valid JSON.", { variant: "error" })
      return;
    }
  }

  const fetchCart = async (token) => {
    if (!token) return;
    try {
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      enqueueSnackbar("Could not fetch cart Details. Check that the backend is running,reachable and returns valid JSON.", { variant: "error" })
      return
    }
  }

  return (
    <div>
      <Header children debounceSearch={debounceSearch} debounceTimeout={debounceTimeout}>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
      </Header>
      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={e => debounceSearch(e, debounceTimeout)}
      />
      <Grid container>
        <Grid item md={token ? 9 : 12} sx={12} sm={12}>
          <Grid item className="product-grid">
            <Box className="hero">
              <p className="hero-heading">
                India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
            </Box>
          </Grid>
          {isProductsLoading ?
            <Box className="loading">
              <CircularProgress />
              <h4>Loading Products</h4>
            </Box>
            :
            (filteredProducts.length ?
              <Grid container sx={{ px: 1, my: 2 }} spacing={1}>{filteredProducts.map((product) => <ProductCard product={product} key={product._id} handleAddToCart={(product_id) => addToCart(token, items, product_id, products, 1, { preventDuplicate: true })
              } />)}</Grid>
              : <Box className="loading">
                <SentimentDissatisfied color="action" />
                <h4 style={{ color: "#636363" }}>No products found</h4>
              </Box>)}
        </Grid>

        {token ?
          <Grid item md={3} sx={12} sm={12} bgcolor="#E9F5E1">
            <Cart products={products} items={items} handleQuantity={addToCart} />
          </Grid> :
          null}
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
