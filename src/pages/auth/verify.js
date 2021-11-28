import React from "react";
import { getCsrfToken, getSession } from "next-auth/client";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
export default function AccountVerifyPage() {
  return (
    <div className="signin-area">
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
          <div style={{ textAlign: "center" }}>
            <Typography
              component="h6"
              variant="h6"
              style={{ color: "green", marginTop: 32 }}
            >
              Sign In Link sent to your registered e-mail address , Check "Spam"
              folder if not in Inbox
            </Typography>
          </div>
        </Box>
      </Container>
    </div>
  );
}

export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context);
  console.log(csrfToken);
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
