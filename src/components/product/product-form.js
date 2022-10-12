import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
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
    name: "",
    price: "",
    description: "",
    stock: "",
    image: "",
    category: "",
    genre: "",
    brand: "",
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
          name: response.data.name,
          price: response.data.price,
          description: response.data.description,
          stock: response.data.stock,
          image: response.data.image,
          category: response.data.category,
          genre: response.data.genre,
          brand: response.data.brand,
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
                name="name"
                onChange={handleChange}
                required
                value={values.name}
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
                label="Preço do Produto em Reais"
                name="price"
                onChange={handleChange}
                type="number"
                required
                value={values.price}
                variant="outlined"
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                label="Quantidade em Estoque"
                name="stock"
                onChange={handleChange}
                type="number"
                value={values.stock}
                variant="outlined"
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                label="Marca do Produto"
                name="brand"
                onChange={handleChange}
                required
                value={values.brand}
                variant="outlined"
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Categoria</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={values.category}
                  label="Categoria"
                  name="category"
                  onChange={handleChange}
                >
                  {categories.map((item) => (
                    <MenuItem key={item.id} value={item.category}>
                      {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={12} xs={12}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Genero</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={values.genre}
                  label="Genero"
                  name="genre"
                  onChange={handleChange}
                >
                  <MenuItem value="masculino">Masculino</MenuItem>
                  <MenuItem value="feminino">Feminino</MenuItem>
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
