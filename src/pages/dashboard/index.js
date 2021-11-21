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

function DashboardPage({ usersData }) {
  const users = JSON.parse(usersData);
  const classes = useStyles();

  const fomatDate = (date_value) => {
    let date = new Date(date_value);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  return (
    <React.Fragment>
      <Seo
        title="Dashboard | ICPA Global Consultants "
        description="ICPA Global Consultants"
        canonical={`${process.env.PUBLIC_URL}/dashboard`}
      />

      {users.length > 0 ? (
        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">No.</TableCell>
                <TableCell align="left">User Image</TableCell>
                <TableCell align="left">User Name</TableCell>
                <TableCell align="left">User Email</TableCell>
                <TableCell align="left">Account Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell align="left">{index + 1}</TableCell>
                  <TableCell align="left">
                    <img
                      src={user.image ? user.image : "/img/profile.png"}
                      alt={user.name}
                      height={52}
                      width={52}
                    />
                  </TableCell>
                  <TableCell align="left">{user.name}</TableCell>
                  <TableCell align="left">{user.email}</TableCell>
                  <TableCell align="left">
                    {fomatDate(user.createdAt)}
                  </TableCell>
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

      {/* <form>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleSubmit}>upload</button>
      </form> */}
    </React.Fragment>
  );
}

DashboardPage.layout = Admin;

export default DashboardPage;

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
  const users = await prisma.user.findMany({});

  return {
    props: {
      usersData: users.length != 0 ? JSON.stringify(users) : JSON.stringify([]),
    },
  };
}
