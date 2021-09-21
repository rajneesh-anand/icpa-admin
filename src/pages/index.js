import React from "react";
import { getSession } from "next-auth/client";
import Admin from "@/layouts/Admin";

function HomePage() {
  return <h1>DashBoard Page</h1>;
}

HomePage.layout = Admin;

export default HomePage;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}
