import Head from 'next/head';
import { Box, Container, Grid, Pagination } from '@mui/material';
import { ProductListToolbar } from '../components/product/product-list-toolbar';
import { DashboardLayout } from '../components/dashboard-layout';
import { ListProducts } from '../components/product/list-products';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Page = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios
          .get("https://ecommerce-87e77-default-rtdb.firebaseio.com/products.json")
        setProducts(Object.values(response.data))
        console.log(Object.values(response.data))
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const deleteProduct = async (id) => {
    setMessage('')
    setIsLoading(true)

    try {
      const response = await axios
        .delete(`https://ecommerce-87e77-default-rtdb.firebaseio.com/products/${id}.json`)
      if (response.status === 200) {
        setProducts(products.filter(product => product.id !== id))
      }
    } catch (error) {
      setMessage('Não foi possivel remover o produto.')
    }

    setIsLoading(false)
  }

  return (
    <>
      <Head>
        <title>
          Products | Material Kit
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth={false}>
          <ProductListToolbar />
          {message && <p style={{ color: 'red', marginTop: '20px' }}>{message}</p>}
          {isLoading && <p style={{ marginTop: '20px' }}>Aguarde...</p>}
          <Box sx={{ pt: 3 }}>
            <Grid
              container
              spacing={3}
            >
              {!isLoading &&
                <ListProducts products={products} deleteProduct={deleteProduct} />
              }
            </Grid>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              pt: 3
            }}
          >
            <Pagination
              color="primary"
              count={3}
              size="small"
            />
          </Box>
        </Container>
      </Box>
    </>
  )
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
