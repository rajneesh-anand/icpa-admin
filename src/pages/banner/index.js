import React, { useState, useEffect, useRef, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { getSession } from "next-auth/client";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import ToastMessage from "@/components/Snackbar/Snackbar";
import Seo from "@/components/Seo";
import Admin from "@/layouts/Admin";
import Image from "next/image";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: 16,
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

function BannerPage({ banner }) {
  const [isProcessing, setProcessingTo] = useState(false);
  const [image, setImage] = useState();
  const [message, setMessage] = useState();
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState();
  const [pics, setPics] = useState([]);
  const classes = useStyles();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    mode: "onBlur",
  });

  useEffect(() => {
    // const res = await fetch(`${process.env.API_URL}/awsupload/fetchObject`);
    // const result = await res.json();
    setPics(banner);
  }, [message]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const removeImage = async (key) => {
    console.log(key);
    await fetch(`${process.env.API_URL}/awsupload/deleteObject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key: key }),
    })
      .then((response) => {
        if (response.status >= 400 && response.status < 600) {
          throw new Error("Bad response from server");
        } else {
          setPics((oldState) => oldState.filter((item) => item.key !== key));
        }
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onSubmit = async () => {
    if (!image) {
      alert("Please select an Image !");
      return;
    }
    setProcessingTo(true);
    const formData = new FormData();
    formData.append("images", image);

    await fetch(`${process.env.API_URL}/awsupload`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.status >= 400 && response.status < 600) {
          throw new Error("Bad response from server");
        } else {
          setProcessingTo(false);
          setMessage("Banner saved successfuly !");
          setSuccess(true);
          setImage();
          setOpen(true);
        }
        return response;
      })
      .catch((error) => {
        console.log(error);
        setProcessingTo(false);
        setMessage("Oops something went wrong !");
        setSuccess(false);
        setOpen(true);
      });
  };

  return (
    <React.Fragment>
      <Seo
        title="Add Banner | ICPA Global Consultants "
        description="ICPA Global Consultants"
        canonical={`${process.env.PUBLIC_URL}/banner`}
      />
      <div className={classes.root}>
        <div
          style={{ padding: 16, border: "1px solid #ddd", marginBottom: 16 }}
        >
          <form>
            <Grid container justifyContent="center">
              <Grid item>
                <label htmlFor="photo" className={classes.label}>
                  SELECT BANNER IMAGE
                </label>
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit(onSubmit)}
                >
                  {isProcessing ? "Uploading...." : `Upload`}
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
        <Grid container spacing={1} justifyContent="center" alignItems="center">
          {pics.map((item, index) => (
            <Grid item sm={3} md={3} key={index} align="center">
              <Image src={item.url} alt={item.url} width={160} height={160} />
              <div>
                <button onClick={() => removeImage(item.key)}>Remove</button>
              </div>
            </Grid>
          ))}
        </Grid>
      </div>
      <ToastMessage
        open={open}
        success={success}
        message={message}
        onClose={handleClose}
      />
    </React.Fragment>
  );
}

BannerPage.layout = Admin;

export default BannerPage;

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

  const result = await fetch(`${process.env.API_URL}/awsupload/fetchObject`);
  const data = await result.json();

  return {
    props: { banner: data.data },
  };
}
