import React, { useState } from "react";
import Admin from "@/layouts/Admin";
import { getSession } from "next-auth/client";
import Seo from "@/components/Seo";

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

function TestinomialListPage({ data }) {
  const classes = useStyles();

  return (
    <>
      <Seo
        title="Testinomials List | ICPA Global Consultants "
        description="ICPA Global Consultants - Testinomial"
        canonical={`${process.env.PUBLIC_URL}/testinomials`}
      />
      <Grid container>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          style={{ textAlign: "end", marginTop: 8 }}
        >
          <Link href="/testinomial">
            <a className="default-btn">Add New Testinomial</a>
          </Link>
        </Grid>
        {data ? (
          <Grid item xs={12} sm={12} md={12}>
            <TableContainer>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">No.</TableCell>
                    <TableCell align="left">Client Name</TableCell>
                    <TableCell align="left">Client Organization</TableCell>
                    <TableCell align="left">Comment Description</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell align="left">{index + 1}</TableCell>
                      <TableCell align="left">{item.name}</TableCell>
                      <TableCell align="left">{item.company}</TableCell>
                      <TableCell align="left">
                        {htmr(item.description)}
                      </TableCell>
                      <TableCell align="center">
                        <Link href={`/testinomial/edit/${item.id}`}>
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
              <p>Testinomial List is empty !</p>
            </div>
          </Grid>
        )}
      </Grid>
    </>
  );
}
TestinomialListPage.layout = Admin;

export default TestinomialListPage;

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
  const response = await fetch(`${process.env.PUBLIC_URL}/api/testinomials`);
  const result = await response.json();

  return {
    props: {
      data: result ? result.data : null,
    },
  };
};
