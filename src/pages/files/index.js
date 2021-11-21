import React, { useState } from "react";
import { slugify } from "@/libs/helper";
import { useForm, Controller } from "react-hook-form";
import { getSession } from "next-auth/client";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
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
  const [faqFile, setFaqFile] = useState();
  const [isProcessing, setProcessingTo] = useState(false);
  const [chapterVideo, setChapterVideo] = useState();
  const [coverPhoto, setCoverPhoto] = useState();
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
    setProcessingTo(true);
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
        setProcessingTo(false);
        setMessage("File saved successfuly !");
        setSuccess(true);
        setFranchiseFile(null);
        setOpen(true);
      }
    } catch (error) {
      setProcessingTo(false);
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

  const handleFaqSubmit = async () => {
    if (!faqFile) {
      alert("Please select json file with F.A.Q details !");
      return;
    }
    setProcessingTo(true);
    const formData = new FormData();
    formData.append("uploadedFile", faqFile);
    try {
      const res = await fetch(`${process.env.API_URL}/upload/faq`, {
        method: "POST",
        body: formData,
      });

      if (res.status >= 400 && res.status < 600) {
        throw new Error("Bad response from server");
      } else {
        setProcessingTo(false);
        setMessage("File saved successfuly !");
        setSuccess(true);
        setFaqFile(null);
        setOpen(true);
      }
    } catch (error) {
      setProcessingTo(false);
      setMessage("Oops something went wrong !");
      setSuccess(false);
      setOpen(true);
    }
  };

  const handleFaqDownload = async () => {
    const res = await fetch(`${process.env.API_URL}/upload/faq`);
    const data = await res.json();
    download(JSON.stringify(data), "faq.json");
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
              value={franchiseFile}
              onChange={(e) => setFranchiseFile(e.target.files[0])}
            />
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={handleFranchiseSubmit}
              style={{ marginRight: 8 }}
            >
              {isProcessing ? "Uploading...." : `Upload`}
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
            <label htmlFor="faq" style={{ color: "black", marginRight: 8 }}>
              UPLOAD JSON FILE FOR F.A.Q DATA
            </label>
            <input
              type="file"
              id="faq"
              value={faqFile}
              onChange={(e) => setFaqFile(e.target.files[0])}
            />
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={handleFaqSubmit}
              style={{ marginRight: 8 }}
            >
              {isProcessing ? "Uploading...." : `Upload`}
            </Button>
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={handleFaqDownload}
            >
              Download F.A.Q File
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
