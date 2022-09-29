import Head from "next/head";
import { Box, Container, Grid, Pagination } from "@mui/material";
import { ProductListToolbar } from "../components/product/product-list-toolbar";
import { DashboardLayout } from "../components/dashboard-layout";
import { ListProducts } from "../components/product/list-products";
import { useEffect, useState } from "react";
import { productsService } from "../services/productsService";
import { useSetRecoilState } from "recoil";
import { alertState } from "../atoms/alertState";

const Page = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const service = new productsService();
  const setAlert = useSetRecoilState(alertState);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await service.getAll();
        if (response.status === 200 && response.data) {
          setProducts(Object.values(response.data));
        }
      } catch (error) {
        console.error(error);
        setAlert({ message: "Não foi possível conectar com o servidor.", severity: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    setIsLoading(true);

    try {
      const response = await service.delete(id);
      if (response.status === 200) {
        setProducts(products.filter((product) => product.id !== id));
        setAlert({ message: "Produto removido com sucesso.", severity: "success" });
      }
    } catch (error) {
      console.error(error);
      setAlert({ message: "Não foi possível remover o produto.", severity: "error" });
    }

    setIsLoading(false);
  };

  return (
    <>
      <Head>
        <title>Produtos</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <ProductListToolbar />
          {isLoading && <p style={{ marginTop: "20px" }}>Aguarde...</p>}
          <Box sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              {!isLoading && <ListProducts products={products} deleteProduct={deleteProduct} />}
            </Grid>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              pt: 3,
            }}
          >
            <Pagination color="primary" count={3} size="small" />
          </Box>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
