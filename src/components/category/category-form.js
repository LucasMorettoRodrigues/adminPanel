import { useState } from "react";
import { Box, Button, Card, CardContent, Divider, Grid, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { CategoriesService } from "../../services/CategoriesService";
import { useSetRecoilState } from "recoil";
import { alertState } from "../../atoms/alertState";
import { v4 as uuid } from "uuid";

export const CategoryForm = (props) => {
  const router = useRouter();
  const { id } = router.query;
  const service = new CategoriesService();
  const setAlert = useSetRecoilState(alertState);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [values, setValues] = useState({ category: "", id: "" });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const addCategory = async () => {
    setIsLoading(true);

    try {
      id = uuid();

      await service.put(id, { ...values, id });
      setAlert({
        message: `A categoria ${values.category} foi adicionada com sucesso.`,
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setAlert({
        message: `Não foi possível adicionar a categoria ${values.category}.`,
        severity: "error",
      });
    }

    setIsLoading(false);
  };

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
                label="Categoria"
                name="category"
                onChange={handleChange}
                required
                value={values.category}
                variant="outlined"
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
            onClick={addCategory}
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
