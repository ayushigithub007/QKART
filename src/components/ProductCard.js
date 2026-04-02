import { AddShoppingCartOutlined,ShoppingCart } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
  CardActionArea
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import "./ProductCard.css";


const ProductCard = ({ product, handleAddToCart }) => {
  const { name, image, cost, rating, category } = product;
  return (
    <Card className="card">
      <CardActionArea>
        <CardMedia
          component="img"
          height="200"
          image={image}
          alt={name}
        />
        <CardContent> 
          <Typography gutterBottom variant="body1" fontWeight="bold">
            {name}
          </Typography> 
          <Typography variant="body2" color="text.secondary">
            {category}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Rating value={rating} readOnly size="small" />
          </Box>
          <Typography variant="h6" sx={{ mt: 1 }}>
          {`$${product.cost}`}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
      <Button
  fullWidth
  color="primary"
  variant="contained"
  startIcon={<ShoppingCart />}
  onClick={() => handleAddToCart(product._id, 1, { preventDuplicate: true })}
>
  ADD TO CART
</Button>

      </CardActions>
    </Card>
  );
};

export default  ProductCard;