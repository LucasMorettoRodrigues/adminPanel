import Head from "next/head";
import NextLink from "next/link";
import Router from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Container, Link, TextField, Typography } from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useSetRecoilState } from "recoil";
import { alertState } from "../atoms/alertState";

const Login = () => {
  const setAlert = useSetRecoilState(alertState);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
      password: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: (_, actions) => {
      signInWithEmailAndPassword(auth, formik.values.email, formik.values.password)
        .then((userCredential) => {
          // Signed in
          console.log(userCredential);
          const user = userCredential.user;
          Router.push("/").catch(console.error);
        })
        .catch((error) => {
          actions.setSubmitting(false);
          let errorMessage = error.code.split("/")[1].replaceAll("-", " ") + ".";
          errorMessage = errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1);
          setAlert({ message: errorMessage, severity: "error" });
        });
    },
  });

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: "center",
          display: "flex",
          flexGrow: 1,
          minHeight: "100%",
        }}
      >
        <Container maxWidth="sm">
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ my: 3 }}>
              <Typography color="textPrimary" variant="h4">
                Entrar
              </Typography>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Faça login na sua conta.
              </Typography>
            </Box>
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
            <TextField
              error={Boolean(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Senha"
              margin="normal"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
              variant="outlined"
            />
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Entrar
              </Button>
            </Box>
            <Typography color="textSecondary" variant="body2">
              Não possue uma conta?{" "}
              <NextLink href="/register">
                <Link
                  to="/register"
                  variant="subtitle2"
                  underline="hover"
                  sx={{
                    cursor: "pointer",
                  }}
                >
                  Registrar
                </Link>
              </NextLink>
            </Typography>
          </form>
        </Container>
      </Box>
    </>
  );
};

export default Login;
