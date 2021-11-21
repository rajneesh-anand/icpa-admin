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
import EditIcon from "@material-ui/icons/Edit";

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

function ChapterListPage({ data }) {
  console.log(data);
  const classes = useStyles();
  const fomatDate = (date_value) => {
    let date = new Date(date_value);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };
  return (
    <div className="course-list-area">
      <Seo
        title="Chapters List | ICPA Global Consultants "
        description="ICPA Global Consultants "
        canonical={`${process.env.PUBLIC_URL}/chapters`}
      />
      <Grid container>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          style={{ textAlign: "end", marginTop: 8 }}
        >
          <Link href="/chapter">
            <a className="default-btn">Add New Chapter</a>
          </Link>
        </Grid>
        {data.length > 0 ? (
          <Grid item xs={12} sm={12} md={12}>
            <TableContainer>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">No.</TableCell>
                    <TableCell align="left">Chapter Image</TableCell>
                    <TableCell align="left">Chapter Name</TableCell>
                    <TableCell align="left">Course Name</TableCell>
                    <TableCell align="left">Published Date</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell align="left">{index + 1}</TableCell>
                      <TableCell align="left">
                        <img
                          src={item.poster ? item.poster : "/img/profile.png"}
                          alt={item.title}
                          height={64}
                          width={64}
                        />
                      </TableCell>
                      <TableCell align="left">{item.title}</TableCell>
                      <TableCell align="left">
                        {item.course.courseName}
                      </TableCell>

                      <TableCell align="left">
                        {fomatDate(item.createdAt)}
                      </TableCell>

                      <TableCell align="center">
                        <Link href={`/chapter/edit/${item.id}`}>
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
            <p>No Chapters Added !</p>
          </Grid>
        )}
      </Grid>
    </div>
  );
}
ChapterListPage.layout = Admin;

export default ChapterListPage;

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
      `${process.env.PUBLIC_URL}/api/chapters?page=${page}`
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
