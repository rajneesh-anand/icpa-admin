import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
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
import DropzoneComponent from "@/components/Dropzone/Dropzone";
import Seo from "@/components/Seo";
import Admin from "@/layouts/Admin";

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

function ServiceEditPage({ serviceData, categories }) {
  const editorRef = useRef();
  const { CKEditor, ClassicEditor } = editorRef.current || {};
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [isProcessing, setProcessingTo] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);
  const [usage, setUsage] = useState(serviceData.usage);
  const [message, setMessage] = useState();
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState();
  const classes = useStyles();
  const router = useRouter();

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

  useEffect(async () => {
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
    formData.append("service_name", data.service_name);
    formData.append("description", data.service_desc);
    formData.append("service_fee", data.service_fee);
    formData.append("sale_fee", data.sale_price);
    formData.append("popularity", data.popularity);
    formData.append(
      "discount",
      data.sale_price === "0"
        ? 0
        : ((data.service_fee - data.sale_price) / data.service_fee) * 100
    );
    formData.append("gst", data.gst);
    formData.append("category", data.category);
    formData.append("status", data.status === "Active" ? true : false);
    formData.append("usage", usage);
    formData.append("slug", slugify(data.service_name));

    await fetch(`${process.env.API_URL}/service/${serviceData.id}`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.status >= 400 && response.status < 600) {
          throw new Error("Bad response from server");
        } else {
          setProcessingTo(false);
          setMessage("Service saved successfuly !");
          setSuccess(true);
          setOpen(true);
          setUsage("");
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
        title="Add New Service | ICPA Global Consultants "
        description="ICPA Global Consultants"
        canonical={`${process.env.PUBLIC_URL}/service`}
      />
      <div className={classes.root}>
        <form>
          <Grid container spacing={1}>
            <DropzoneComponent onDrop={onDrop} files={selectedImage} />

            <Grid item xs={12} sm={12} md={12}>
              <Controller
                name="service_name"
                control={control}
                defaultValue={serviceData.serviceName}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="SERVICE NAME"
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
                rules={{ required: " Service Name is required !" }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Controller
                name="service_desc"
                control={control}
                defaultValue={serviceData.description}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="BRIEF DESCRIPTION"
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
                rules={{ required: "Brief Introduction is required" }}
              />
            </Grid>

            <Grid item xs={6} sm={4} md={4}>
              <Controller
                name="service_fee"
                control={control}
                defaultValue={serviceData.serviceFee}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="SERVICE FEE"
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
                  required: "Service Fee is required",
                  pattern: {
                    value: /^([\d]{0,6})(\.[\d]{1,2})?$/,
                    message: "Accept only decimal numbers",
                  },
                }}
              />
            </Grid>
            <Grid item xs={6} sm={4} md={4}>
              <Controller
                name="sale_price"
                control={control}
                defaultValue={serviceData.saleFee}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="SERVICE FEE AFTER DISCOUNT"
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
                  required: "Sale Fee is required",
                  pattern: {
                    value: /^([\d]{0,6})(\.[\d]{1,2})?$/,
                    message: "Accept only decimal numbers",
                  },
                }}
              />
            </Grid>

            <Grid item xs={6} sm={4} md={4}>
              <Controller
                name="gst"
                control={control}
                defaultValue={serviceData.gst}
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
                      defaultValue={serviceData.gst}
                      onChange={onChange}
                      label="GST Rate"
                      inputProps={{
                        id: "gst_rate",
                      }}
                    >
                      <option value="3">3 %</option>
                      <option value="5">5 %</option>
                      <option value="12">12 %</option>
                      <option value="18">18 %</option>
                      <option value="28">28 %</option>
                      <option value="0">Exempted</option>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={6} sm={4} md={4}>
              <div className={classes.select}>
                <Controller
                  name="category"
                  control={control}
                  defaultValue={serviceData.category.name}
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
                        SERVICE CATEGORY
                      </InputLabel>
                      <Select
                        native
                        onChange={onChange}
                        defaultValue={serviceData.category.name}
                        label="Service Category"
                        inputProps={{
                          id: "category",
                        }}
                      >
                        {categories &&
                          categories.map((item, i) => (
                            <option key={i} value={item.name}>
                              {item.name}
                            </option>
                          ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </div>
            </Grid>

            <Grid item xs={6} sm={4} md={4}>
              <Controller
                name="popularity"
                control={control}
                defaultValue={serviceData.popularity}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="POPULARITY"
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

            <Grid item xs={6} sm={4} md={4}>
              <div className={classes.select}>
                <Controller
                  name="status"
                  control={control}
                  defaultValue={serviceData.status ? "Active" : "Inactive"}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <FormControl
                      variant="outlined"
                      className={classes.formControl}
                      size="small"
                    >
                      <InputLabel htmlFor="service_status">
                        SERVICE STATUS
                      </InputLabel>
                      <Select
                        native
                        defaultValue={
                          serviceData.status ? "Active" : "Inactive"
                        }
                        onChange={onChange}
                        label="Service Status"
                        inputProps={{
                          id: "service_status",
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

            <Grid xs={12} sm={12} md={12}>
              {editorLoaded ? (
                <CKEditor
                  editor={ClassicEditor}
                  data={serviceData.usage}
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

            <Grid xs={12} sm={12} md={12} style={{ textAlign: "center" }}>
              <div>
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit(onSubmit)}
                >
                  {isProcessing ? "Updating..." : `Update`}
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

ServiceEditPage.layout = Admin;

export default ServiceEditPage;

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

  const { id } = context.params;
  const res = await fetch(`${process.env.PUBLIC_URL}/api/categories`);
  const data = await res.json();
  const service = await fetch(`${process.env.PUBLIC_URL}/api/service/${id}`);
  const result = await service.json();

  return {
    props: { serviceData: result.data, categories: data.data },
  };
}
