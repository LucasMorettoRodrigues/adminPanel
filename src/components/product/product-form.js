import { useState } from "react";
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
import { ProductsService } from "../../services/ProductsService";
import { useSetRecoilState } from "recoil";
import { alertState } from "../../atoms/alertState";
import { v4 as uuid } from "uuid";
import { ImageUploader } from "../ImageUploader";
import { storage } from "../../firebase";
import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";
import { useCategories } from "../../hooks/useCategories";
import { useProductForm } from "../../hooks/useProductForm";
import { useRouter } from "next/router";
import {
  currencyMask,
  deleteImagesFromStorage,
  formatPrice,
  uploadImageToStorage,
} from "../../utils/functions";

export const ProductForm = (props) => {
  const router = useRouter();
  const { id } = router.query;
  const productsService = new ProductsService();
  const setAlert = useSetRecoilState(alertState);
  const { categories } = useCategories();
  const { error, isFetchingProducts, values, setValues, handleChange } = useProductForm();

  const [isLoading, setIsLoading] = useState(false);
  const [localImages, setLocalImages] = useState([]);
  const [storageImagesToDelete, setStorageImagesToDelete] = useState([]);

  // Add local image to localImages
  const handleImage = async (fileUploaded) => {
    setLocalImages((localImage) => [
      ...localImage,
      { file: fileUploaded, url: URL.createObjectURL(fileUploaded) },
    ]);
  };

  const updateOrAddProduct = async () => {
    setIsLoading(true);

    let action = "editar";

    try {
      if (!id) {
        action = "adicionar";
        id = uuid();
      }

      const imagesURL = await uploadImageToStorage(localImages);
      await productsService.put(id, {
        ...values,
        id,
        price: Number(values.price.replace(".", "")),
        stock: Number(values.stock),
        brand: values.brand.toLowerCase(),
        images: [...values.images, ...imagesURL],
      });
      setAlert({
        message: `O produto foi ${action === "editar" ? "editado" : "adicionado"} com sucesso.`,
        severity: "success",
      });
      deleteImagesFromStorage(storageImagesToDelete);
    } catch (error) {
      console.error(error);
      setAlert({
        message: `Não foi possível ${action === "editar" ? "editar" : "adicionar"} o produto.`,
        severity: "error",
      });
    }

    setIsLoading(false);
  };

  // Delete image from localImages or Add image to list of images to be removed from storage
  const deleteImage = async (e, location, imageURL) => {
    e.preventDefault();
    if (!imageURL) return;

    if (location === "storage") {
      setStorageImagesToDelete((storageImagesToDelete) => [...storageImagesToDelete, imageURL]);
      setValues((values) => ({
        ...values,
        images: values.images.filter((image) => image !== imageURL),
      }));
    }

    if (location === "local") {
      setLocalImages((localImages) => localImages.filter((image) => image.url !== imageURL));
    }
  };

  if (isFetchingProducts) {
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
                onChange={(e) => handleChange(currencyMask(e))}
                type="text"
                required
                value={
                  typeof values.price === "string"
                    ? values.price
                    : formatPrice(values.price).substring(2).replace(",", ".")
                }
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
                localImages={localImages}
                storageImages={values.images}
                deleteImage={deleteImage}
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
