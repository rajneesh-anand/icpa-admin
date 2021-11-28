import React, { useState, useEffect, useRef, useCallback } from "react";
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
import ToastMessage from "@/components/Snackbar/Snackbar.js";
import Seo from "@/components/Seo";
import Admin from "@/layouts/Admin.js";
import DropzoneComponent from "@/components/Dropzone/Dropzone.js";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "& .MuiFormControl-root": {
      minWidth: "100%",
    },
  },
  input: {
    height: 40,
  },
}));

function NewUserPage() {
  const [isProcessing, setProcessingTo] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);
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

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedImage(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);

  const onSubmit = async (data) => {
    setProcessingTo(true);
    const formData = new FormData();
    for (let i = 0; i < selectedImage.length; i += 1) {
      formData.append("images", selectedImage[i]);
    }
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("type", data.type);
    formData.append("status", data.status);

    try {
      const res = await fetch(`${process.env.API_URL}/auth`, {
        method: "POST",
        body: formData,
      });

      if (res.status >= 400 && res.status < 600) {
        throw new Error("Bad response from server");
      } else {
        setProcessingTo(false);
        setMessage("User created successfully !");
        setSuccess(true);
        setOpen(true);
      }
    } catch (error) {
      setProcessingTo(false);
      setMessage("Oops something went wrong !");
      setSuccess(false);
      setOpen(true);
    }
  };

  return (
    <React.Fragment>
      <Seo
        title="Add New Course | ICPA Global Consultants "
        description="ICPA Global Consultants -  Add New Course"
        canonical={`${process.env.PUBLIC_URL}/course`}
      />
      <div className={classes.root}>
        <form>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={12} md={12} align="center">
              <DropzoneComponent
                onDrop={onDrop}
                files={selectedImage}
                maxFiles="1"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="USER NAME"
                    variant="outlined"
                    value={value}
                    onChange={onChange}
                    InputProps={{
                      className: classes.input,
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={!!error}
                    helperText={error ? error.message : null}
                  />
                )}
                rules={{ required: "User Name is required !" }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="EMAIL ADDRESS"
                    variant="outlined"
                    value={value}
                    onChange={onChange}
                    InputProps={{
                      className: classes.input,
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={!!error}
                    helperText={error ? error.message : null}
                  />
                )}
                rules={{
                  required: "Email is required !",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "Invalid email address !",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="PASSWORD"
                    variant="outlined"
                    type="password"
                    value={value}
                    onChange={onChange}
                    InputProps={{
                      className: classes.input,
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={!!error}
                    helperText={error ? error.message : null}
                  />
                )}
                rules={{
                  required: "Password is required !",
                  pattern: {
                    value: /^.{6,15}$/,
                    message: "Password length Min 6 to Max 15 !",
                  },
                }}
              />
            </Grid>

            <Grid item xs={6} sm={6} md={6}>
              <div className={classes.select}>
                <Controller
                  name="type"
                  control={control}
                  defaultValue="User"
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <FormControl
                      variant="outlined"
                      className={classes.formControl}
                      size="small"
                    >
                      <InputLabel htmlFor="course_status">USER TYPE</InputLabel>
                      <Select
                        native
                        defaultValue="User"
                        onChange={onChange}
                        label="USER TYPE"
                        inputProps={{
                          id: "course_status",
                        }}
                      >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                      </Select>
                    </FormControl>
                  )}
                />
              </div>
            </Grid>

            <Grid item xs={6} sm={6} md={6}>
              <div className={classes.select}>
                <Controller
                  name="status"
                  control={control}
                  defaultValue="Active"
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <FormControl
                      variant="outlined"
                      className={classes.formControl}
                      size="small"
                    >
                      <InputLabel htmlFor="course_status">
                        USER STATUS
                      </InputLabel>
                      <Select
                        native
                        defaultValue="Active"
                        onChange={onChange}
                        label="USER STATUS"
                        inputProps={{
                          id: "course_status",
                        }}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </Select>
                    </FormControl>
                  )}
                />
              </div>
            </Grid>

            <Grid item xs={12} sm={12} md={12} style={{ textAlign: "center" }}>
              <div>
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit(onSubmit)}
                >
                  {isProcessing ? "Saving..." : `Save`}
                </Button>
              </div>
            </Grid>
          </Grid>
        </form>
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

NewUserPage.layout = Admin;

export default NewUserPage;

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
