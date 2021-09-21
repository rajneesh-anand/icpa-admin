import React, { useState } from "react";
import { getSession } from "next-auth/client";
import Admin from "@/layouts/Admin";
import Link from "next/link";
import Seo from "@/components/Seo";
import Grid from "@material-ui/core/Grid";

function CourseListPage({ data }) {
  return (
    <div className="course-list-area">
      <Seo
        title="Courses List | ICPA Global Consultants "
        description="ICPA Global Consultants -  Add New Category"
        canonical={`${process.env.PUBLIC_URL}/courses`}
      />
      <Grid container>
        {data.length > 0 ? (
          <Grid item xs={12} sm={12} md={12}>
            <TableContainer>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">No.</TableCell>
                    <TableCell align="left">Service Image</TableCell>
                    <TableCell align="left">Service Name</TableCell>
                    <TableCell align="left">Description</TableCell>
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
                          alt={item.serviceName}
                        />
                      </TableCell>
                      <TableCell align="left">{item.serviceName}</TableCell>
                      <TableCell align="left">{item.description}</TableCell>
                      <TableCell align="left">
                        {item.status ? "Active" : "Inactive"}
                      </TableCell>
                      <TableCell align="center">
                        <Link href={`/service/edit/${item.id}`}>
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
            <Link href="/course">
              <a>Add New Course</a>
            </Link>
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
