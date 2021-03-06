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
import ToastMessage from "components/Snackbar/Snackbar.js";
import DropzoneComponent from "components/Dropzone/Dropzone.js";
import Seo from "components/Seo";
import Admin from "layouts/Admin.js";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "& .MuiFormControl-root": {
      minWidth: "100%",
    },
    "& .MuiInputLabel-shrink": {
      color: "#0e5810",
    },
  },
  input: {
    height: 40,
  },
}));

function CoursePage({ categories }) {
  const editorRef = useRef();
  const { CKEditor, ClassicEditor } = editorRef.current || {};
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [isProcessing, setProcessingTo] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);
  const [usage, setUsage] = useState("");
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

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
    };
    setEditorLoaded(true);
  }, []);

  const onSubmit = async (data) => {
    setProcessingTo(true);
    const formData = new FormData();
    for (let i = 0; i < selectedImage.length; i += 1) {
      formData.append("images", selectedImage[i]);
    }
    formData.append("couse_name", data.course_name);
    formData.append("description", data.course_desc);
    formData.append("details", usage);
    formData.append("course_fee", data.course_fee);
    formData.append("sale_fee", data.sale_fee);
    formData.append(
      "discount",
      ((data.course_fee - data.sale_fee) / data.course_fee) * 100
    );
    formData.append("gst", data.gst);
    formData.append("category", data.category);
    formData.append("status", data.status === "Active" ? true : false);
    formData.append("slug", slugify(data.course_name));
    formData.append("ratings", data.ratings);
    formData.append("no_of_enrollment", data.enrollment);
    formData.append("duration", `${data.duration}`);
    formData.append("no_of_lectures", data.lectures);
    formData.append("no_of_modules", data.no_of_modules);
    formData.append("no_of_ratings", data.no_of_ratings);

    await fetch(`${process.env.API_URL}/course`, {
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
          setOpen(true);
          setSelectedImage([]);
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
        title="Add New Course | ICPA Global Consultants "
        description="ICPA Global Consultants -  Add New Course"
        canonical={`${process.env.PUBLIC_URL}/course`}
      />
      <div className={classes.root}>
        <form>
          <Grid container spacing={1}>
            <DropzoneComponent
              onDrop={onDrop}
              files={selectedImage}
              maxFiles="1"
            />

            <Grid item xs={12} sm={12} md={12}>
              <Controller
                name="course_name"
                control={control}
                defaultValue=""
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="COURSE NAME"
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
                rules={{ required: "Course Name is required !" }}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
              <Controller
                name="course_desc"
                control={control}
                defaultValue=""
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="COURSE BRIEF DESCRIPTION"
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
                rules={{ required: "Brief Description is required !" }}
              />
            </Grid>

            <Grid item xs={6} sm={3} md={3}>
              <Controller
                name="course_fee"
                control={control}
                defaultValue=""
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="COURSE FEE"
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
                  required: "Course Fee is required !",
                  pattern: {
                    value: /^([\d]{0,6})(\.[\d]{1,2})?$/,
                    message: "Accept only decimal numbers",
                  },
                }}
              />
            </Grid>
            <Grid item xs={6} sm={3} md={3}>
              <Controller
                name="sale_fee"
                control={control}
                defaultValue=""
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="COURSE DISCOUNTED FEE"
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
                  required: "Sale Fee is required !",
                  pattern: {
                    value: /^([\d]{0,6})(\.[\d]{1,2})?$/,
                    message: "Accept only decimal numbers",
                  },
                }}
              />
            </Grid>

            <Grid item xs={6} sm={3} md={3}>
              <Controller
                name="gst"
                control={control}
                defaultValue="18"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                    size="small"
                  >
                    <InputLabel htmlFor="gst_rate">GST RATE</InputLabel>
                    <Select
                      native
                      defaultValue="18"
                      onChange={onChange}
                      label="GST Rate"
                      inputProps={{
                        id: "gst_rate",
                      }}
                    >
                      <option value="3">3 %</option>
                      <option value="5">5 %</option>
                      <option value="9">9 %</option>
                      <option value="12">12 %</option>
                      <option value="18">18 %</option>
                      <option value="28">28 %</option>
                      <option value="0">Exempted</option>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={6} sm={3} md={3}>
              <Controller
                name="ratings"
                control={control}
                defaultValue="0"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="COURSE RATINGS"
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
                  pattern: {
                    value: /^[1-5]+(\.[1-9])?$/,
                    message: "Accept only numbers 1-5 ! ",
                  },
                }}
              />
            </Grid>

            <Grid item xs={6} sm={3} md={3}>
              <Controller
                name="no_of_ratings"
                control={control}
                defaultValue="0"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="NUMBER OF RATINGS"
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
                  pattern: {
                    value: /^(?:[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[1-9])$/,
                    message: "Accept only non-decimal numbers ",
                  },
                }}
              />
            </Grid>

            <Grid item xs={6} sm={3} md={3}>
              <Controller
                name="enrollment"
                control={control}
                defaultValue="0"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="TOTAL ENROLLMENT"
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
                  pattern: {
                    value: /^([\d]{0,6})(\.[\d]{1,2})?$/,
                    message: "Accept only decimal numbers",
                  },
                }}
              />
            </Grid>
            <Grid item xs={6} sm={3} md={3}>
              <Controller
                name="duration"
                control={control}
                defaultValue="24 Hours"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="COURSE DURATION"
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

            <Grid item xs={6} sm={3} md={3}>
              <Controller
                name="no_of_modules"
                control={control}
                defaultValue="0"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="TOTAL MODULES"
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
                  pattern: {
                    value: /^[1-9][0-9]?$/,
                    message: "Accept numbers between 1-99 only ",
                  },
                }}
              />
            </Grid>

            <Grid item xs={6} sm={3} md={3}>
              <Controller
                name="lectures"
                control={control}
                defaultValue="0"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="TOTAL CHAPTERS"
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
                  pattern: {
                    value: /^[1-9][0-9]?$/,
                    message: "Accept numbers between 1-99 only ",
                  },
                }}
              />
            </Grid>

            <Grid item xs={6} sm={3} md={3}>
              <div className={classes.select}>
                <Controller
                  name="category"
                  defaultValue={categories[0].name}
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
                        COURSE CATEGORY
                      </InputLabel>
                      <Select
                        native
                        defaultValue={
                          categories ? categories[0].name : "Add Category"
                        }
                        onChange={onChange}
                        label="COURSE CATEGORY"
                        inputProps={{
                          id: "category",
                        }}
                      >
                        {categories ? (
                          categories.map((item, i) => (
                            <option key={i} value={item.name}>
                              {item.name}
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

            <Grid item xs={6} sm={3} md={3}>
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
                        COURSE STATUS
                      </InputLabel>
                      <Select
                        native
                        defaultValue="Active"
                        onChange={onChange}
                        label="COURSE STATUS"
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

            <Grid item xs={12} sm={12} md={12}>
              {editorLoaded ? (
                <CKEditor
                  editor={ClassicEditor}
                  data={usage}
                  onReady={(editor) => {
                    editor.editing.view.change((writer) => {
                      writer.setStyle(
                        "height",
                        "160px",
                        editor.editing.view.document.getRoot()
                      );
                    });
                  }}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setUsage(data);
                  }}
                />
              ) : (
                <p>editor..</p>
              )}
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

CoursePage.layout = Admin;

export default CoursePage;

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

  const result = await fetch(`${process.env.PUBLIC_URL}/api/categories`);
  const data = await result.json();

  return {
    props: { categories: data.data },
  };
}
