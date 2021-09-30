import React, { useState } from "react";
import Admin from "@/layouts/Admin";
import { getSession } from "next-auth/client";
import prisma from "@/libs/prisma";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Seo from "@/components/Seo";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    marginTop: 8,
    paddingTop: 16,
    "& .MuiTableCell-root": {
      padding: 4,
    },
  },
});

function OrdersPage({ orderData }) {
  const orders = JSON.parse(orderData);
  const classes = useStyles();

  const fomatDate = (date_value) => {
    let date = new Date(date_value);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  return (
    <React.Fragment>
      <Seo
        title="Orders| ICPA Global Consultants "
        description="ICPA Global Consultants"
        canonical={`${process.env.PUBLIC_URL}/orders`}
      />

      {orders.length > 0 ? (
        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">No.</TableCell>
                <TableCell align="left">Order Number</TableCell>
                <TableCell align="left">Order Date</TableCell>
                <TableCell align="left">Customer</TableCell>
                <TableCell align="left">Order Type</TableCell>
                <TableCell align="left">Order Amount</TableCell>
                <TableCell align="left">Payment Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell align="left">{index + 1}</TableCell>

                  <TableCell align="left">{item.orderNumber}</TableCell>
                  <TableCell align="left">
                    {fomatDate(item.createdAt)}
                  </TableCell>
                  <TableCell align="left">{item.email}</TableCell>
                  <TableCell align="left">{item.orderType}</TableCell>
                  <TableCell align="left">{item.amount}</TableCell>
                  <TableCell align="left">{item.paymentStatus}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div>
          <h4>
            <h4>No Data !</h4>
          </h4>
        </div>
      )}
    </React.Fragment>
  );
}

OrdersPage.layout = Admin;

export default OrdersPage;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }
  const orders = await prisma.orders.findMany({});

  return {
    props: {
      orderData:
        orders.length != 0 ? JSON.stringify(orders) : JSON.stringify([]),
    },
  };
}
