import { useEffect, useState } from "react";
import { CategoriesService } from "../services/CategoriesService";

export const useCategories = () => {
  const categoriesService = new CategoriesService();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesService.getAll();
        if (response.status === 200 && response.data) {
          setCategories(Object.values(response.data));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  return { categories };
};
