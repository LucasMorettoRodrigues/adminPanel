import { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, Divider, Grid, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { productsService } from "../../services/productsService";
import { useSetRecoilState } from "recoil";
import { alertState } from "../../atoms/alertState";
import { v4 as uuid } from "uuid";

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
  const setAlert = useSetRecoilState(alertState);

  const [isFetchingProduct, setIsFetchingProduct] = useState(id ? true : false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
          setError("O produto não foi encontrado.");
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
        setAlert({ message: "Não foi possível conectar com o servidor.", severity: "error" });
        console.error(error);
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

    let action = "editar";

    try {
      if (!id) {
        action = "adicionar";
        id = uuid();
      }
      await service.put(id, { ...values, id });
      setAlert({
        message: `O produto foi ${action === "editar" ? "editado" : "adicionado"} com sucesso.`,
        severity: "success",
      });
    } catch (error) {
      setAlert({
        message: `Não foi possível ${action === "editar" ? "editar" : "adicionar"} o produto.`,
        severity: "error",
      });
    }

    setIsLoading(false);
  };

  if (isFetchingProduct) {
    return <>Aguarde...</>;
  }

  if (error) {
    return <p>{error}</p>;
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
