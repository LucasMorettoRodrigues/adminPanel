import { useState } from "react";
import { Box, Button, Card, CardContent, CardHeader, Divider, TextField } from "@mui/material";
import { updatePassword } from "firebase/auth";
import { useSetRecoilState } from "recoil";
import { alertState } from "../../atoms/alertState";
import { auth } from "../../firebase";

export const SettingsPassword = (props) => {
  const setAlert = useSetRecoilState(alertState);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    password: "",
    confirm: "",
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdatePassword = () => {
    setLoading(true);

    if (values.password.length < 6) {
      setAlert({
        message: "A senha deve conter no mínimo 6 caracteres.",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    if (values.password !== values.confirm) {
      setAlert({
        message: "A senha confirmada não é a mesma.",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    updatePassword(auth.currentUser, values.password)
      .then(() => {
        setAlert({
          message: "A senha foi atualizada com sucesso.",
          severity: "success",
        });
      })
      .catch((error) => {
        console.error(error);
        setAlert({
          message: "Não foi possível atualizar a senha, faça login denovo e tente novamente.",
          severity: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form {...props}>
      <Card>
        <CardHeader subheader="Troca Senha" title="Senha" />
        <Divider />
        <CardContent>
          <TextField
            fullWidth
            label="Nova Senha"
            margin="normal"
            name="password"
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
            required
          />
          <TextField
            fullWidth
            label="Confirmar Nova Senha"
            margin="normal"
            name="confirm"
            onChange={handleChange}
            type="password"
            value={values.confirm}
            variant="outlined"
            required
          />
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
            onClick={handleUpdatePassword}
            color="primary"
            variant="contained"
            disbled={loading ? true : false}
          >
            Salvar
          </Button>
        </Box>
      </Card>
    </form>
  );
};
