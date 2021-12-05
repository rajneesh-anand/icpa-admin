import React, { useState } from "react";

import { useForm, Controller } from "react-hook-form";
import { getSession } from "next-auth/client";
import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";

import ToastMessage from "@/components/Snackbar/Snackbar";
import Seo from "@/components/Seo";
import Admin from "@/layouts/Admin";
import download from "js-file-download";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: 16,
    "& .MuiFormControl-root": {
      minWidth: "100%",
    },
  },
  input: {
    height: 40,
  },
  label: {
    border: "1px solid #ddd",
    padding: 6,
    marginRight: 6,
    color: "black",
  },
}));

function FilePage() {
  const [franchiseFile, setFranchiseFile] = useState();
  const [planFile, setPlanFile] = useState();
  const [productFile, setProductFile] = useState();
  const [aboutFile, setAboutFile] = useState();
  const [isProcessing, setProcessingTo] = useState(false);

  const [message, setMessage] = useState();
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState();
  const classes = useStyles();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    mode: "onBlur",
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleFranchiseSubmit = async () => {
    if (!franchiseFile) {
      alert("Please select json file with franchise details !");
      return;
    }

    const formData = new FormData();
    formData.append("uploadedFile", franchiseFile);
    try {
      const res = await fetch(`${process.env.API_URL}/upload/franchise`, {
        method: "POST",
        body: formData,
      });

      if (res.status >= 400 && res.status < 600) {
        throw new Error("Bad response from server");
      } else {
        setMessage("File saved successfuly !");
        setSuccess(true);
        setFranchiseFile(null);
        setOpen(true);
      }
    } catch (error) {
      setMessage("Oops something went wrong !");
      setSuccess(false);
      setOpen(true);
    }
  };

  const handleFranchiseDownload = async () => {
    const res = await fetch(`${process.env.API_URL}/upload/franchise`);
    const data = await res.json();
    download(JSON.stringify(data), "franchise.json");
  };

  const handlePlanSubmit = async () => {
    if (!planFile) {
      alert("Please select json file with membership plan details !");
      return;
    }

    const formData = new FormData();
    formData.append("uploadedFile", planFile);
    try {
      const res = await fetch(`${process.env.API_URL}/upload/plan`, {
        method: "POST",
        body: formData,
      });

      if (res.status >= 400 && res.status < 600) {
        throw new Error("Bad response from server");
      } else {
        setMessage("File saved successfuly !");
        setSuccess(true);
        setPlanFile(null);
        setOpen(true);
      }
    } catch (error) {
      setMessage("Oops something went wrong !");
      setSuccess(false);
      setOpen(true);
    }
  };

  const handlePlanDownload = async () => {
    const res = await fetch(`${process.env.API_URL}/upload/plan`);
    const data = await res.json();
    download(JSON.stringify(data), "membership-plan.json");
  };

  const handleProductSubmit = async () => {
    if (!productFile) {
      alert("Please select json file with Product Category details !");
      return;
    }

    const formData = new FormData();
    formData.append("uploadedFile", productFile);
    try {
      const res = await fetch(`${process.env.API_URL}/upload/category`, {
        method: "POST",
        body: formData,
      });

      if (res.status >= 400 && res.status < 600) {
        throw new Error("Bad response from server");
      } else {
        setMessage("File saved successfuly !");
        setSuccess(true);
        setProductFile(null);
        setOpen(true);
      }
    } catch (error) {
      setMessage("Oops something went wrong !");
      setSuccess(false);
      setOpen(true);
    }
  };

  const handleProductDownload = async () => {
    const res = await fetch(`${process.env.API_URL}/upload/category`);
    const data = await res.json();
    download(JSON.stringify(data), "product-category.json");
  };

  const handleAboutSubmit = async () => {
    if (!aboutFile) {
      alert("Please select json file with About Us details !");
      return;
    }

    const formData = new FormData();
    formData.append("uploadedFile", aboutFile);
    try {
      const res = await fetch(`${process.env.API_URL}/upload/about`, {
        method: "POST",
        body: formData,
      });

      if (res.status >= 400 && res.status < 600) {
        throw new Error("Bad response from server");
      } else {
        setMessage("File saved successfuly !");
        setSuccess(true);
        setProductFile(null);
        setOpen(true);
      }
    } catch (error) {
      setMessage("Oops something went wrong !");
      setSuccess(false);
      setOpen(true);
    }
  };

  const handleAboutDownload = async () => {
    const res = await fetch(`${process.env.API_URL}/upload/about`);
    const data = await res.json();
    download(JSON.stringify(data), "about.json");
  };

  return (
    <>
      <Seo
        title="Add Files | ICPA Global Consultants "
        description="ICPA Global Consultants "
        canonical={`${process.env.PUBLIC_URL}/files`}
      />

      <div style={{ marginTop: 16, border: "1px solid #ddd", padding: "8px" }}>
        <form>
          <div style={{ display: "flex" }}>
            <label
              htmlFor="franchise"
              style={{ color: "black", marginRight: 8 }}
            >
              UPLOAD JSON FILE FOR FRANCHISE DATA
            </label>
            <input
              type="file"
              id="franchise"
              // value={franchiseFile}
              onChange={(e) => setFranchiseFile(e.target.files[0])}
            />
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={handleFranchiseSubmit}
              style={{ marginRight: 8 }}
            >
              Upload Franchise File
            </Button>
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={handleFranchiseDownload}
            >
              Download Franchise File
            </Button>
          </div>
        </form>
      </div>
      <div style={{ marginTop: 16, border: "1px solid #ddd", padding: "8px" }}>
        <form>
          <div style={{ display: "flex" }}>
            <label htmlFor="plan" style={{ color: "black", marginRight: 8 }}>
              UPLOAD JSON FILE FOR MEMBERSHIP PLAN DATA
            </label>
            <input
              type="file"
              id="plan"
              onChange={(e) => setPlanFile(e.target.files[0])}
            />
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={handlePlanSubmit}
              style={{ marginRight: 8 }}
            >
              Upload Membership File
            </Button>
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={handlePlanDownload}
            >
              Download MEMBERSHIP PLAN File
            </Button>
          </div>
        </form>
      </div>
      <div style={{ marginTop: 16, border: "1px solid #ddd", padding: "8px" }}>
        <form>
          <div style={{ display: "flex" }}>
            <label
              htmlFor="products"
              style={{ color: "black", marginRight: 8 }}
            >
              UPLOAD JSON FILE FOR PRODUCTS CATEGORY
            </label>
            <input
              type="file"
              id="products"
              // value={productFile}
              onChange={(e) => setProductFile(e.target.files[0])}
            />
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={handleProductSubmit}
              style={{ marginRight: 8 }}
            >
              Upload Product Category File
            </Button>
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={handleProductDownload}
            >
              Download Product Category File
            </Button>
          </div>
        </form>
      </div>

      <div style={{ marginTop: 16, border: "1px solid #ddd", padding: "8px" }}>
        <form>
          <div style={{ display: "flex" }}>
            <label htmlFor="plan" style={{ color: "black", marginRight: 8 }}>
              UPLOAD JSON FILE FOR ABOUT US DETAILS
            </label>
            <input
              type="file"
              id="plan"
              onChange={(e) => setAboutFile(e.target.files[0])}
            />
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={handleAboutSubmit}
              style={{ marginRight: 8 }}
            >
              Upload About-us Details file
            </Button>
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={handleAboutDownload}
            >
              Download About-us Details file
            </Button>
          </div>
        </form>
      </div>

      <ToastMessage
        open={open}
        success={success}
        message={message}
        onClose={handleClose}
      />
    </>
  );
}

FilePage.layout = Admin;

export default FilePage;

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

  return {
    props: {},
  };
}
