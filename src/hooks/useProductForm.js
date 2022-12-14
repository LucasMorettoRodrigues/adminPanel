import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { alertState } from "../atoms/alertState";
import { ProductsService } from "../services/ProductsService";
import { formatPrice } from "../utils/functions";

export const useProductForm = () => {
  const router = useRouter();
  const { id } = router.query;
  const productsService = new ProductsService();
  const setAlert = useSetRecoilState(alertState);
  const [isFetchingProducts, setIsFetchingProducts] = useState(id ? true : false);
  const [error, setError] = useState("");

  const [values, setValues] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    images: [],
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
          images: response.data.images || [],
          category: response.data.category,
          genre: response.data.genre,
          brand: response.data.brand,
        });
      } catch (error) {
        setAlert({ message: "Não foi possível conectar com o servidor.", severity: "error" });
        console.error(error);
      } finally {
        setIsFetchingProducts(false);
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

  return { error, isFetchingProducts, values, setValues, handleChange };
};
