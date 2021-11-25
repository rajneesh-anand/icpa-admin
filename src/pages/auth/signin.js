import React, { useEffect, useState } from "react";
import { signIn, getCsrfToken, getSession } from "next-auth/client";
import Seo from "@/components/Seo";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { useForm, Controller } from "react-hook-form";
import Link from "next/link";

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
      <Link href="https://icpaglobalconsultant.com/">
        <a target="_blank">ICPA GLOBAL CONSULTANT </a>
      </Link>{" "}
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function SignInPage({ csrfToken }) {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    let result = users.filter((user) => user.email === data.email);
    console.log(result);
    if (result.length == 0) {
      setMessage(
        "You are not authorized to login, Contact your system administrator !"
      );
    } else {
      await signIn("email", {
        email: data.email,
      });
    }
  };

  useEffect(async () => {
    const res = await fetch("/api/users");
    const results = await res.json();
    setUsers(results.data);
  }, []);

  return (
    <div className="signin-area">
      <Seo
        title="Sign In | ICPA Global Consultant"
        description="ICPA Global Consultants - Sign In"
        canonical={`${process.env.PUBLIC_URL}/auth/signin`}
      />

      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
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
            <div style={{ textAlign: "center" }}>
              <Typography component="h6" variant="h6" color="error">
                {message}
              </Typography>
            </div>
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

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit(onSubmit)}
            >
              Send Sign In Link
            </Button>
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
