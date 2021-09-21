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
    paddingTop: 16,
    borderTop: "1px solid #ddd",
    "& .MuiTableCell-root": {
      padding: 4,
    },
  },
});

function TestinomialListPage({ testinomials }) {
  const classes = useStyles();
  const data = testinomials ? JSON.parse(testinomials) : null;

  return (
    <>
      <Seo
        title="Edit Testinomial | ICPA Global Consultants "
        description="ICPA Global Consultants - Edit Testinomial"
        canonical={`${process.env.PUBLIC_URL}/testinomials`}
      />
      <Grid container>
        {data ? (
          <Grid item>
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
              <p>Service List is empty !</p>
              <Link href="/service">
                <a>Add New Service</a>
              </Link>
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

  const data = await prisma.testinomials.findMany({
    orderBy: [
      {
        id: "asc",
      },
    ],
  });

  return {
    props: {
      testinomials: data.length != 0 ? JSON.stringify(data) : null,
    },
  };
};
