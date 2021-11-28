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
import htmr from "htmr";
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

function FaqListPage({ faq }) {
  const classes = useStyles();
  const data = faq ? JSON.parse(faq) : null;
  const truncate = (str, no_words) => {
    return htmr(str.split(" ").splice(0, no_words).join(" ") + "  ... ...");
  };

  return (
    <>
      <Seo
        title="F.A.Q List | ICPA Global Consultants "
        description="ICPA Global Consultants - FAQ"
        canonical={`${process.env.PUBLIC_URL}/faq-list`}
      />
      <Grid container>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          style={{ textAlign: "end", marginTop: 8 }}
        >
          <Link href="/faq">
            <a className="default-btn">Add New F.A.Q</a>
          </Link>
        </Grid>
        {data ? (
          <Grid item>
            <TableContainer>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">No.</TableCell>
                    <TableCell align="left">Question</TableCell>
                    <TableCell align="left">Description</TableCell>
                    <TableCell align="left">Status</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell align="left">{index + 1}</TableCell>
                      <TableCell align="left">{item.title}</TableCell>
                      <TableCell align="left">
                        {truncate(item.description, 20)}
                      </TableCell>
                      <TableCell
                        align="left"
                        style={{
                          color: item.status ? "green" : "red",
                        }}
                      >
                        {item.status ? "Active" : "Inactive"}
                      </TableCell>
                      <TableCell align="center">
                        <Link href={`/faq/edit/${item.id}`}>
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
              <p>F.A.Q List is empty !</p>
            </div>
          </Grid>
        )}
      </Grid>
    </>
  );
}
FaqListPage.layout = Admin;

export default FaqListPage;

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

  const data = await prisma.faq.findMany({
    orderBy: [
      {
        id: "asc",
      },
    ],
  });

  return {
    props: {
      faq: data.length != 0 ? JSON.stringify(data) : null,
    },
  };
};
