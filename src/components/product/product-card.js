import PropTypes from "prop-types";
import { Box, Button, Card, CardContent, Divider, Grid, Typography } from "@mui/material";
import NextLink from "next/link";
import { formatPrice } from "../../utils/functions";

export const ProductCard = ({ product, deleteProduct, ...rest }) => (
  <Card
    sx={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
    }}
    {...rest}
  >
    <CardContent sx={{ pb: 2 }}>
      <div style={{ height: "180px", textAlign: "center", paddingBottom: "15px" }}>
        <img
          style={{ height: "100%", maxWidth: "280px", objectFit: "cover" }}
          alt={`${product.name} Image`}
          src={product.images ? product.images[0] : ""}
        />
      </div>
      <Typography align="center" color="textPrimary" gutterBottom variant="h5">
        {product.name}
      </Typography>
      <Typography style={{ margin: "12px" }} align="center" color="textPrimary" variant="body2">
        {product.categories?.map((category) => (
          <span
            key={category}
            style={{
              fontSize: "12px",
              padding: "5px 10px",
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
        {formatPrice(product.price)}
      </Typography>
      <Typography align="center" color="textSecondary" variant="body2">
        Em estoque: {product.stock}
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
          <Button onClick={() => deleteProduct(product)} sx={{ p: 0, color: "#D14343;" }}>
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
