import React, { useState, useEffect, useRef, useCallback } from "react";
import slugify from "slugify";
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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: 16,
    "& .MuiFormControl-root": {
      minWidth: "100%",
    },
    // "& .MuiInputLabel-shrink": {
    //   color: "#0e5810",
    // },
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

function ChapterPage({ courses }) {
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

  const onSubmit = async (data) => {
    if (!chapterVideo) {
      return;
    }
    if (!coverPhoto) {
      return;
    }
    setProcessingTo(true);
    const formData = new FormData();
    formData.append("image", coverPhoto);
    formData.append("video", chapterVideo);
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("course_name", data.category);
    formData.append("module", data.module);
    formData.append(
      "slug",
      slugify(data.name, {
        remove: /[*+~.()'"!:@,]/g,
        lower: true,
      })
    );

    await fetch(`${process.env.API_URL}/chapter`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.status >= 400 && response.status < 600) {
          throw new Error("Bad response from server");
        } else {
          setProcessingTo(false);
          setMessage("Course saved successfuly !");
          setSuccess(true);
          setChapterVideo();
          setCoverPhoto();
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
      <Seo title="Add Course Chapter" />
      <div className={classes.root}>
        <form>
          <Grid container spacing={1}>
            <Grid item sm={6} md={6}>
              <div className={classes.select}>
                <Controller
                  name="category"
                  defaultValue="Select Course Name"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <FormControl
                      variant="outlined"
                      className={classes.formControl}
                      size="small"
                    >
                      <InputLabel htmlFor="category">
                        SELECT COURSE NAME
                      </InputLabel>
                      <Select
                        native
                        defaultValue="Select Course Name"
                        onChange={onChange}
                        label="SELECT COURSE  NAME"
                        inputProps={{
                          id: "category",
                        }}
                      >
                        <option value="Select Course Name">
                          Select Course Name
                        </option>
                        {courses ? (
                          courses.map((item, i) => (
                            <option key={i} value={item.courseName}>
                              {item.courseName}
                            </option>
                          ))
                        ) : (
                          <option value="Add Category">Add Category</option>
                        )}
                      </Select>
                    </FormControl>
                  )}
                />
              </div>
            </Grid>

            <Grid item sm={6} md={6}>
              <Controller
                name="module"
                control={control}
                defaultValue=""
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="MODULE NAME"
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
                rules={{ required: "Module Name is required !" }}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="CHAPTER NAME"
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
                rules={{ required: "Chapter Name is required !" }}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
              <Controller
                name="description"
                control={control}
                defaultValue=""
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="CHAPTER BRIEF DESCRIPTION"
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
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <label htmlFor="cover_photo" className={classes.label}>
                SELECT COVER PHOTO
              </label>
              <input
                type="file"
                id="cover_photo"
                name="cover_photo"
                accept="image/*"
                onChange={(e) => setCoverPhoto(e.target.files[0])}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <label htmlFor="media_video" className={classes.label}>
                SELECT CHAPTER VIDEO
              </label>
              <input
                type="file"
                id="media_video"
                name="media_video"
                accept="video/*"
                onChange={(e) => setChapterVideo(e.target.files[0])}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12} style={{ textAlign: "end" }}>
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

ChapterPage.layout = Admin;

export default ChapterPage;

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

  const result = await fetch(`${process.env.PUBLIC_URL}/api/courses`);
  const data = await result.json();

  return {
    props: { courses: data.data },
  };
}
