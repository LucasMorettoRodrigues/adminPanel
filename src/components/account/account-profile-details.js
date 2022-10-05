import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
import { auth } from "../../firebase";
import { updateEmail, updateProfile } from "firebase/auth";
import { useSetRecoilState } from "recoil";
import { alertState } from "../../atoms/alertState";
import { useFormik } from "formik";
import * as Yup from "yup";

export const AccountProfileDetails = (props) => {
  const setAlert = useSetRecoilState(alertState);

  const formik = useFormik({
    initialValues: {
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
    },
    validationSchema: Yup.object({
      displayName: Yup.string().max(255),
      email: Yup.string().email("Must be a valid email").max(255).required("Campo obrigatório."),
    }),
    onSubmit: async (_, actions) => {
      const editedName = formik.values.displayName !== auth.currentUser.displayName;
      const editedEmail = formik.values.email !== auth.currentUser.email;
      let success = true;

      if (editedName) {
        updateProfile(auth.currentUser, { displayName: formik.values.displayName })
          .then(() => {
            if (editedEmail) {
              updateEmail(auth.currentUser, formik.values.email)
                .then(() => {
                  setAlert({
                    message: "As informações foram atualizadas com sucesso.",
                    severity: "success",
                  });
                })
                .catch((error) => {
                  success = false;
                  console.error(error);
                  setAlert({
                    message:
                      "Não foi possível atualizar o email, faça login denovo e tente novamente.",
                    severity: "error",
                  });
                });
            } else {
              setAlert({
                message: "O nome foi atualizado com sucesso.",
                severity: "success",
              });
            }
          })
          .catch((error) => {
            success = false;
            console.error(error);
            setAlert({
              message: "Não foi possível atualizar o nome, faça login denovo e tente novamente.",
              severity: "error",
            });
          });
      }

      if (!editedName && editedEmail) {
        updateEmail(auth.currentUser, formik.values.email)
          .then(() => {
            setAlert({
              message: "O email foi atualizado com sucesso.",
              severity: "success",
            });
          })
          .catch((error) => {
            console.error(error);
            setAlert({
              message: "Não foi possível atualizar o email, faça login denovo e tente novamente.",
              severity: "error",
            });
          });
      }

      actions.setSubmitting(false);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card>
        <CardHeader title="Profile" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
              <TextField
                error={Boolean(formik.touched.displayName && formik.errors.displayName)}
                fullWidth
                helperText={formik.touched.displayName && formik.errors.displayName}
                label="Nome"
                margin="normal"
                name="displayName"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.displayName}
                variant="outlined"
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                error={Boolean(formik.touched.email && formik.errors.email)}
                fullWidth
                helperText={formik.touched.email && formik.errors.email}
                label="Email"
                margin="normal"
                name="email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="email"
                value={formik.values.email}
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
            color="primary"
            disabled={formik.isSubmitting}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
          >
            Salvar Detalhes
          </Button>
        </Box>
      </Card>
    </form>
  );
};
