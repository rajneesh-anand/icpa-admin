import React, { useState } from "react";
import Admin from "@/layouts/Admin";
import { getSession } from "next-auth/client";
import Seo from "@/components/Seo";
import prisma from "@/libs/prisma";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Link from "next/link";
import EditIcon from "@material-ui/icons/Edit";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    marginTop: 16,
    borderTop: "1px solid #ddd",

    "& .MuiTableCell-root": {
      padding: 4,
    },
  },
});

function ProductListPage({ products }) {
  const classes = useStyles();
  const data = products ? JSON.parse(products) : null;

  return (
    <>
      <Seo
        title="Product List | ICPA Global Consultants "
        description="ICPA Global Consultants - Product"
        canonical={`${process.env.PUBLIC_URL}/products`}
      />
      <Grid container>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          style={{ textAlign: "end", marginTop: 8 }}
        >
          <Link href="/product">
            <a className="default-btn">Add New Product</a>
          </Link>
        </Grid>
        {data ? (
          <Grid item xs={12} sm={12} md={12}>
            <TableContainer>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">No.</TableCell>
                    <TableCell align="left">Product Name</TableCell>
                    <TableCell align="left">Product Description</TableCell>
                    <TableCell align="left">Product Price</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell align="left">{index + 1}</TableCell>
                      <TableCell align="left">{item.name}</TableCell>
                      <TableCell align="left">{item.description}</TableCell>
                      <TableCell align="left">{item.price}</TableCell>
                      <TableCell align="center">
                        <Link href={`/product/edit/${item.id}`}>
                          <a>
                            <div>
                              <EditIcon />
                            </div>
                          </a>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        ) : (
          <Grid item xs={12} sm={12} md={12}>
            <div className="content-center">
              <p>Product List is empty !</p>
            </div>
          </Grid>
        )}
      </Grid>
    </>
  );
}
ProductListPage.layout = Admin;

export default ProductListPage;

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

  const data = await prisma.products.findMany({
    orderBy: [
      {
        id: "asc",
      },
    ],
  });

  return {
    props: {
      products: data.length != 0 ? JSON.stringify(data) : null,
    },
  };
};
