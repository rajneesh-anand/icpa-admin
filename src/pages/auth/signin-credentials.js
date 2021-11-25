import React, { useState, useEffect } from "react";
import { signIn, getCsrfToken, getSession } from "next-auth/client";
import { useRouter } from "next/router";
import Seo from "@/components/Seo";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "next/link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { useForm, Controller } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="secondary"
      align="center"
      {...props}
      style={{ marginTop: 32 }}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://icpaglobalconsultant.com/">
        ICPA GLOBAL CONSULTANT
      </Link>{" "}
      {new Date().getFullYear()}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

export default function SignInCredentialPage({ csrfToken }) {
  const [message, setMessage] = React.useState();
  const router = useRouter();
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
      callbackUrl: `${process.env.PUBLIC_URL}`,
    });
    if (res?.error) setMessage(res.error);
    if (res.url) router.push(res.url);
  };

  React.useEffect(() => {
    if (router.query.error) {
      setMessage(router.query.error);
      setEmail(router.query.email);
    }
  }, [router]);

  return (
    <div className="signin-area">
      <Seo
        title="Sign In | ICPA Global Consultant"
        description="ICPA Global Consultants - Sign In"
        canonical={`${process.env.PUBLIC_URL}/auth/signin`}
      />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            // marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className="logo">
            <img src="/img/logo.png" alt="logo" />
          </div>

          <Typography component="h1" variant="h5">
            Sign In
          </Typography>

          {message && (
            <Typography component="h6" variant="h6" color="error">
              {message}
            </Typography>
          )}

          <Box component="form" noValidate sx={{ mt: 1 }}>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  margin="normal"
                  fullWidth
                  label="Enter your email address *"
                  autoFocus
                  value={value}
                  onChange={onChange}
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
              rules={{
                required: "Email is required !",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Invalid email address !",
                },
              }}
            />
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  margin="normal"
                  fullWidth
                  type="password"
                  label="Enter your password *"
                  value={value}
                  onChange={onChange}
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
              rules={{
                required: "Password is required !",
              }}
            />

            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              //   className={classes.button}
              onClick={handleSubmit(onSubmit)}
            >
              Sign In
            </Button>
            {/* <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit(onSubmit)}
            >
              Sign In
            </Button> */}
            <Grid container justifyContent="center">
              <Grid item>
                <Link href="/auth/forgot-password" variant="body2">
                  <a> Forgot password? </a>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </div>
  );
}

export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context);
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: { csrfToken },
  };
}
