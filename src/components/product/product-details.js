import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import { productsService } from "../../services/ProductsService";
import { useSetRecoilState } from "recoil";
import { alertState } from "../../atoms/alertState";
import { v4 as uuid } from "uuid";

const categories = ["Roupa", "Calçado", "Acessório"];

export const ProductDetails = (props) => {
  const router = useRouter();
  const { id } = router.query;
  const service = new ProductsService();
  const setAlert = useSetRecoilState(alertState);

  const [isFetchingProduct, setIsFetchingProduct] = useState(id ? true : false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [values, setValues] = useState({
    productName: "",
    price: "",
    description: "",
    stockQuantity: "",
    categories: [],
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
          categories: response.data.categories,
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
    if (event.name === "categories") {
      setValues({
        ...values,
        categories: typeof event.target.value === "string" ? value.split(",") : event.target.value,
      });
      return;
    }

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
      console.error(error);
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
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="categories-input-label">Categorias</InputLabel>
                <Select
                  name="categories"
                  labelId="categories-input-label"
                  id="categories-input"
                  multiple
                  value={values.categories}
                  onChange={handleChange}
                  input={<OutlinedInput id="select-multiple-categories" label="Categorias" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 48 * 4.5 + 8,
                        width: 250,
                      },
                    },
                  }}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
