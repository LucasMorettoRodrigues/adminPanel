import Head from "next/head";
import { Box, Container } from "@mui/material";
import { CategoryListResults } from "../components/category/category-list-results";
import { CategoryListToolbar } from "../components/category/category-list-toolbar";
import { DashboardLayout } from "../components/dashboard-layout";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { alertState } from "../atoms/alertState";
import { CategoriesService } from "../services/CategoriesService";

const Page = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const service = new CategoriesService();
  const setAlert = useSetRecoilState(alertState);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await service.getAll();
        if (response.status === 200 && response.data) {
          setCategories(Object.values(response.data));
          setFilteredCategories(Object.values(response.data));
        }
      } catch (error) {
        console.error(error);
        setAlert({
          message: "Não foi possível obter as categorias do servidor.",
          severity: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, []);

  const searchCategories = (e) => {
    setFilteredCategories(
      categories.filter((category) =>
        category.category.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  const deleteCategory = async (id) => {
    setIsLoading(true);

    try {
      const response = await service.delete(id);
      if (response.status === 200) {
        setCategories(categories.filter((category) => category.id !== id));
        setFilteredCategories(categories.filter((category) => category.id !== id));
        setAlert({ message: "Categoria removida com sucesso.", severity: "success" });
      }
    } catch (error) {
      console.error(error);
      setAlert({ message: "Não foi possível remover a categoria.", severity: "error" });
    }

    setIsLoading(false);
  };

  return (
    <>
      <Head>
        <title>Categorias</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <CategoryListToolbar searchCategories={searchCategories} />
          {isLoading && <p style={{ marginTop: "20px" }}>Aguarde...</p>}
          <Box sx={{ mt: 3 }}>
            {!isLoading && (
              <CategoryListResults
                categories={filteredCategories}
                deleteCategory={deleteCategory}
              />
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
