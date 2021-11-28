import * as React from "react";
import { signIn, getCsrfToken, getSession } from "next-auth/client";
import { useRouter } from "next/router";
import Seo from "@/components/Seo";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "next/link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
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

export default function ForgotPassword({ csrfToken }) {
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
    const formData = new FormData();
    formData.append("email", data.email);

    try {
      const res = await fetch(`${process.env.API_URL}/auth/forgotpwd`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.status >= 400 && res.status < 600) {
        throw new Error(result.msg);
      } else {
      }
    } catch (error) {
      console.log(error.message);
      setMessage(error.message);
    }
  };

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

          <Typography variant="body2" style={{ marginTop: 16, color: "green" }}>
            Enter your registered email address to retrieve your password !
          </Typography>

          {message && (
            <Typography component="h6" variant="h6" color="error">
              {message}
            </Typography>
          )}

          <Box component="form" noValidate sx={{ mt: 1 }}>
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
              //   className={classes.button}
              onClick={handleSubmit(onSubmit)}
            >
              Send
            </Button>

            <Grid container justifyContent="center">
              <Grid item>
                <Link href="/auth/signin" variant="body2">
                  <a>Sign In </a>
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
    props: {},
  };
}
