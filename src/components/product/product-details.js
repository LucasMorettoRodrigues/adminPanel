import { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, Divider, Grid, TextField } from "@mui/material";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/router";
import { productsService } from "../../services/productsService";

const categories = [
  {
    value: "roupa",
    label: "Roupa",
  },
  {
    value: "calçado",
    label: "Calçado",
  },
  {
    value: "acessório",
    label: "Acessório",
  },
];

export const ProductDetails = (props) => {
  const router = useRouter();
  const { id } = router.query;
  const service = new productsService();

  const [isFetchingProduct, setIsFetchingProduct] = useState(id ? true : false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [error, setError] = useState(false);
  const [dataError, setDataError] = useState("");

  const [values, setValues] = useState({
    productName: "",
    price: "",
    description: "",
    stockQuantity: "",
    category: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await service.getProduct(id);
        if (!response.data) {
          setDataError("O produto não existe.");
          return;
        }

        setValues({
          productName: response.data.productName,
          price: response.data.price,
          description: response.data.description,
          stockQuantity: response.data.stockQuantity,
          category: response.data.category,
        });
      } catch (error) {
        setDataError("Desculpe, houve um erro no servidor.");
        console.log(error);
      } finally {
        setIsFetchingProduct(false);
      }
    };

    !!id && fetchProduct();
  }, [id]);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const updateOrAddProduct = async () => {
    setIsLoading(true);
    setIsCreated(false);
    setError(false);

    try {
      if (!id) {
        id = uuid();
      }

      await service.put(id, { ...values, id });

      setIsCreated(true);
    } catch (error) {
      setError(true);
    }

    setIsLoading(false);
  };

  if (isFetchingProduct) {
    return <>Aguarde...</>;
  }

  if (dataError) {
    return <p>{dataError}</p>;
  }

  return (
    <form autoComplete="off" noValidate {...props}>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                label="Nome do Produto"
                name="productName"
                onChange={handleChange}
                required
                value={values.productName}
                variant="outlined"
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                label="Preço do Produto"
                name="price"
                onChange={handleChange}
                required
                value={values.price}
                variant="outlined"
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                label="Descrição do Produto"
                name="description"
                onChange={handleChange}
                required
                value={values.description}
                variant="outlined"
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                label="Quantidade em estoque"
                name="stockQuantity"
                onChange={handleChange}
                type="number"
                value={values.stockQuantity}
                variant="outlined"
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                label="Seleciona a Categoria"
                name="category"
                onChange={handleChange}
                required
                select
                SelectProps={{ native: true }}
                value={values.category}
                variant="outlined"
              >
                {categories.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        {error && !isCreated && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "-15px",
              p: 1,
            }}
          >
            <p style={{ color: "red" }}>Desculpe, não foi possivel adicionar o produto.</p>
          </Box>
        )}
        {isCreated && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "-15px",
              p: 1,
            }}
          >
            <p style={{ color: "green" }}>O produto foi adicionado com sucesso.</p>
          </Box>
        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 2,
          }}
        >
          <Button
            disabled={isLoading ? true : false}
            onClick={updateOrAddProduct}
            color="primary"
            variant="contained"
          >
            {isLoading ? "Aguarde..." : "Salvar"}
          </Button>
        </Box>
      </Card>
    </form>
  );
};
