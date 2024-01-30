import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
  Grid,
  Box,
  Stack
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  const { name, image, category, cost, rating, _id } = product;
  return (
    <Grid item xs={6} md={3}>
      <Card className="card">
        <CardMedia
          component="img"
          height="194"
          image={image} />
        <CardContent>
          <Typography>{product.name}</Typography>
          <Typography>{`$${product.cost}`}</Typography>
          <Rating
            name="read-only"
            value={product.rating}
            // sx={{mb:1}}
            precision={0.5}
            readOnly />
        </CardContent>
        <CardActions>
          <Button className="card-button"
            fullWidth
            variant="contained"
            startIcon={<AddShoppingCartOutlined />}
            onClick={() => handleAddToCart(_id)}>
            ADD TO CART
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default ProductCard;
