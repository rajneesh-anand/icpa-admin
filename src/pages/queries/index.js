import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Admin from "layouts/Admin";
import ToastMessage from "@/components/Snackbar/Snackbar";
import Link from "next/link";
import { getSession } from "next-auth/client";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    "& .MuiTableCell-root": {
      padding: 4,
    },
  },
  title: {
    textAlign: "center",
    margin: "8px 0px",
    backgroundColor: "purple",
    color: "white",
    padding: "8px ",
  },
});

function QueryListPage({ data }) {
  const classes = useStyles();
  const [status, setStatus] = useState();
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState();
  const [message, setMessage] = useState();

  const orderDate = (order_date) => {
    let date = new Date(order_date);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleChange = (event) => {
    const name = event.target.value;
    setStatus(name);
  };

  const updateQueryStatus = async (id) => {
    await fetch(`/api/query/${id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ queryStatus: status }),
    })
      .then((response) => {
        if (response.status >= 400 && response.status < 600) {
          throw new Error("Bad response from server");
        } else {
          setMessage("Query status updated successfuly !");
          setSuccess(true);
          setOpen(true);
        }
        return response;
      })
      .catch((error) => {
        console.log(error);
        setMessage("Oops something went wrong !");
        setSuccess(false);
        setOpen(true);
      });
  };

  return (
    <>
      <ToastMessage
        open={open}
        success={success}
        message={message}
        onClose={handleClose}
      />
      <div className={classes.title}>QUERY DETAILS</div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">No.</TableCell>
              <TableCell align="left">Query Date</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Email</TableCell>
              <TableCell align="left">Contact</TableCell>
              <TableCell align="left">Location</TableCell>
              <TableCell align="left">Query Detail</TableCell>
              <TableCell align="left">Query Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell align="left">{index + 1}</TableCell>
                <TableCell align="left">{orderDate(item.createdAt)}</TableCell>
                <TableCell align="left">{item.name}</TableCell>
                <TableCell align="left">{item.email}</TableCell>
                <TableCell align="left">{item.contact}</TableCell>
                <TableCell align="left">{item.location}</TableCell>
                <TableCell align="left">{item.interested}</TableCell>

                <TableCell
                  align="left"
                  style={{
                    color: item.status === "Solved" ? "green" : "red",
                  }}
                >
                  <FormControl>
                    <Select
                      native
                      defaultValue={item.status}
                      onChange={handleChange}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Solved">Solved</option>
                    </Select>
                  </FormControl>
                </TableCell>

                <TableCell align="center" style={{ width: 96 }}>
                  <button
                    onClick={() => updateQueryStatus(item.id)}
                    style={{ cursor: "pointer", marginTop: 4 }}
                  >
                    Update Status
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
QueryListPage.layout = Admin;

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
    const res = await fetch(`${process.env.PUBLIC_URL}/api/query?page=${page}`);
    if (res.status !== 200) {
      throw new Error("Failed to fetch");
    }
    orderData = await res.json();
  } catch (err) {
    orderData = { error: err.message };
  }

  return { props: { data: orderData.data } };
};

export default QueryListPage;
