import React, { useState } from "react";
import CategoryList from "@/components/CategoryList";
import NewCategoryPage from "@/components/Category";
import Admin from "@/layouts/Admin";
import { getSession } from "next-auth/client";
import { CategoryProvider } from "@/contexts/category/use-category";
import Seo from "@/components/Seo";

function CategoryPage() {
  return (
    <CategoryProvider>
      <Seo
        title="Category | ICPA Global Consultants "
        description="ICPA Global Consultants -  Add New Category"
        canonical={`${process.env.PUBLIC_URL}/category`}
      />
      <NewCategoryPage />
      <CategoryList />
    </CategoryProvider>
  );
}
CategoryPage.layout = Admin;

export default CategoryPage;

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return { props: {} };
};
