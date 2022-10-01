import PropTypes from "prop-types";
import { Avatar, Box, Button, Card, CardContent, Divider, Grid, Typography } from "@mui/material";
import NextLink from "next/link";

export const ProductCard = ({ product, deleteProduct, ...rest }) => (
  <Card
    sx={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
    }}
    {...rest}
  >
    <CardContent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          pb: 3,
        }}
      >
        <Avatar alt={`${product.name} Image`} src={product.image} variant="square" />
      </Box>
      <Typography align="center" color="textPrimary" gutterBottom variant="h5">
        {product.productName}
      </Typography>
      <Typography style={{ margin: "20px" }} align="center" color="textPrimary" variant="body2">
        {product.categories?.map((category) => (
          <span
            key={category}
            style={{
              padding: "8px 16px",
              backgroundColor: "lightgray",
              borderRadius: "20px",
              margin: "0 5px",
            }}
          >
            {category}
          </span>
        ))}
      </Typography>
      <Typography align="center" color="textPrimary" gutterBottom variant="h6">
        R$ {product.price}
      </Typography>
      <Typography align="center" color="textSecondary" variant="body2">
        Em estoque: {product.stockQuantity}
      </Typography>
    </CardContent>
    <Box sx={{ flexGrow: 1 }} />
    <Divider />
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2} sx={{ justifyContent: "space-between" }}>
        <Grid
          item
          sx={{
            alignItems: "center",
            display: "flex",
          }}
        >
          <NextLink href={`/products/editProduct/${product.id}`} passHref>
            <Button sx={{ p: 0 }}>Editar</Button>
          </NextLink>
        </Grid>
        <Grid
          item
          sx={{
            alignItems: "center",
            display: "flex",
          }}
        >
          <Button onClick={() => deleteProduct(product.id)} sx={{ p: 0, color: "#D14343;" }}>
            Remover
          </Button>
        </Grid>
      </Grid>
    </Box>
  </Card>
);

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};
