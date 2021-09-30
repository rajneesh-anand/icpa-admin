import React, { useState } from "react";
import { getSession } from "next-auth/client";
import Admin from "@/layouts/Admin";
import Link from "next/link";
import Seo from "@/components/Seo";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles } from "@material-ui/core/styles";

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

function CourseListPage({ data }) {
  const classes = useStyles();
  return (
    <div className="course-list-area">
      <Seo
        title="Courses List | ICPA Global Consultants "
        description="ICPA Global Consultants -  Add New Category"
        canonical={`${process.env.PUBLIC_URL}/courses`}
      />
      <Grid container>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          style={{ textAlign: "end", marginTop: 8 }}
        >
          <Link href="/course">
            <a className="default-btn">Add New Course</a>
          </Link>
        </Grid>
        {data.length > 0 ? (
          <Grid item xs={12} sm={12} md={12}>
            <TableContainer>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">No.</TableCell>
                    <TableCell align="left">Image</TableCell>
                    <TableCell align="left">Course Name</TableCell>
                    <TableCell align="left">Status</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell align="left">{index + 1}</TableCell>
                      <TableCell align="left">
                        <img
                          src={item.images ? item.images : "/img/profile.png"}
                          alt={item.courseName}
                          height={64}
                          width={64}
                        />
                      </TableCell>
                      <TableCell align="left">{item.courseName}</TableCell>
                      <TableCell align="left">
                        {item.status ? "Active" : "Inactive"}
                      </TableCell>
                      <TableCell align="center">
                        <Link href={`/course/edit/${item.id}`}>
                          <a>Edit</a>
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
            <p>No Courses Available !</p>
          </Grid>
        )}
      </Grid>
    </div>
  );
}
CourseListPage.layout = Admin;

export default CourseListPage;

export const getServerSideProps = async (context) => {
  const page = context.query.page || 1;
  let orderData = null;

  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  try {
    const res = await fetch(
      `${process.env.PUBLIC_URL}/api/courses?page=${page}`
    );
    if (res.status !== 200) {
      throw new Error("Failed to fetch");
    }
    orderData = await res.json();
  } catch (err) {
    orderData = { error: err.message };
  }

  return { props: { data: orderData.data } };
};
