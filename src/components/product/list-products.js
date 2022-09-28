import { Grid } from "@mui/material"
import { ProductCard } from "./product-card"

export const ListProducts = ({ products, deleteProduct }) => {
  return (
    <>
      {products.length === 0 &&
        <Grid
          item
        >
          <p>Nenhum produto cadastrado.</p>
        </Grid>
      }
      {products.map((product) => (
        <Grid
          item
          key={product.id}
          lg={4}
          md={6}
          xs={12}
        >
          <ProductCard product={product} deleteProduct={deleteProduct} />
        </Grid>
      ))}
    </>
  )
}
