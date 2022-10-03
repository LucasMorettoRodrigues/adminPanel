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
import { ProductsService } from "../../services/ProductsService";
import { CategoriesService } from "../../services/CategoriesService";
import { useSetRecoilState } from "recoil";
import { alertState } from "../../atoms/alertState";
import { v4 as uuid } from "uuid";
import { ImageUploader } from "../ImageUploader";
import { storage } from "../../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

export const ProductForm = (props) => {
  const router = useRouter();
  const { id } = router.query;
  const productsService = new ProductsService();
  const categoriesService = new CategoriesService();
  const setAlert = useSetRecoilState(alertState);

  const [isFetchingProduct, setIsFetchingProduct] = useState(id ? true : false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [localImage, setLocalImage] = useState(null);
  const [categories, setCategories] = useState([]);

  const [values, setValues] = useState({
    productName: "",
    price: "",
    description: "",
    stockQuantity: "",
    image: "",
    categories: [],
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productsService.getProduct(id);
        if (!response.data) {
          setError("O produto não foi encontrado.");
          return;
        }

        setValues({
          productName: response.data.productName,
          price: response.data.price,
          description: response.data.description,
          stockQuantity: response.data.stockQuantity,
          image: response.data.image,
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await categoriesService.getAll();
        if (response.status === 200 && response.data) {
          setCategories(Object.values(response.data));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  const handleImage = async (fileUploaded) => {
    setLocalImage({ file: fileUploaded, url: URL.createObjectURL(fileUploaded) });
  };

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

  const uploadImage = async () => {
    if (!localImage) return;
    const storageRef = ref(storage, `products/${uuid()}`);
    let response = await uploadBytesResumable(storageRef, localImage.file);
    const imageURL = await getDownloadURL(response.ref);
    return imageURL;
  };

  const updateOrAddProduct = async () => {
    setIsLoading(true);

    let action = "editar";

    try {
      if (!id) {
        action = "adicionar";
        id = uuid();
      }

      const imageURL = await uploadImage();

      await productsService.put(id, { ...values, id, image: imageURL || values.image });
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
                  {categories.map((item) => (
                    <MenuItem key={item.id} value={item.category}>
                      {item.category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={12} xs={12}>
              <ImageUploader
                handleImage={handleImage}
                image={localImage ? localImage.url : values.image}
              />
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
