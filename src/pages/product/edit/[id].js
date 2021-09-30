import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { getSession } from "next-auth/client";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import ToastMessage from "@/components/Snackbar/Snackbar";
import Seo from "@/components/Seo";
import Admin from "@/layouts/Admin";
import { useRouter } from "next/router";
import slugify from "slugify";

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
  label: {
    border: "1px solid #ddd",
    padding: 6,
    marginRight: 6,
    color: "black",
  },
}));

function ProductEditPage({ data }) {
  const editorRef = useRef();
  const { CKEditor, ClassicEditor } = editorRef.current || {};
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [isProcessing, setProcessingTo] = useState(false);
  const [image, setImage] = useState();
  const [content, setContent] = useState();
  const [message, setMessage] = useState();
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState();
  const [editData, setEditData] = useState();
  const router = useRouter();
  const classes = useStyles();

  const { id } = router.query;

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

  useEffect(async () => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
    };
    setEditorLoaded(true);
    const res = await fetch(`/api/product/${id}`);
    const result = await res.json();
    const data = result.data;
    setEditData(data);
  }, []);

  const onSubmit = async (data) => {
    setProcessingTo(true);
    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("details", content);
    formData.append("price", data.price);
    formData.append("sale_fee", data.sale_fee);
    formData.append("ratings", data.ratings);
    formData.append(
      "slug",
      slugify(data.name, {
        remove: /[*+~.()'"!:@,]/g,
        lower: true,
      })
    );

    await fetch(`${process.env.API_URL}/product/${editData.id}`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.status >= 400 && response.status < 600) {
          throw new Error("Bad response from server");
        } else {
          setProcessingTo(false);
          setMessage("Product updated successfuly !");
          setSuccess(true);
          setOpen(true);
          setContent("");
        }
        return response;
      })
      .catch((error) => {
        setProcessingTo(false);
        setMessage("Oops something went wrong !");
        setSuccess(false);
        setOpen(true);
      });
  };

  return editData ? (
    <React.Fragment>
      <Seo
        title="Add Product | ICPA Global Consultants "
        description="ICPA Global Consultants"
        canonical={`${process.env.PUBLIC_URL}/product`}
      />
      <div className={classes.root}>
        <form>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={12} md={12} style={{ margin: "8px 0px" }}>
              <label htmlFor="photo" className={classes.label}>
                SELECT PRODUCT PHOTO
              </label>
              <input
                type="file"
                id="photo"
                name="photo"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="name"
                control={control}
                defaultValue={editData.name}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="PRODUCT NAME"
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
                rules={{ required: "Product Name is required !" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="description"
                control={control}
                defaultValue={editData.description}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="PRODUCT DESCRIPTION"
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
                rules={{ required: "Description is required !" }}
              />
            </Grid>

            <Grid item xs={6} sm={4} md={4}>
              <Controller
                name="price"
                control={control}
                defaultValue={editData.price}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="PRODUCT PRICE"
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
            <Grid item xs={6} sm={4} md={4}>
              <Controller
                name="sale_price"
                control={control}
                defaultValue={editData.sellingPrice}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="SALE PRICE"
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
            <Grid item xs={6} sm={4} md={4}>
              <Controller
                name="ratings"
                control={control}
                defaultValue={editData.ratings}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="PRODUCT RATINGS"
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
                    message: "Accept only numbers ! ",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
              {editorLoaded ? (
                <CKEditor
                  editor={ClassicEditor}
                  data={editData.details}
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
                    setContent(data);
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
                  {isProcessing ? "Updating..." : `Update`}
                </Button>
              </div>
            </Grid>
          </Grid>
        </form>
        <ToastMessage
          open={open}
          success={success}
          message={message}
          onClose={handleClose}
        />
      </div>
    </React.Fragment>
  ) : null;
}

ProductEditPage.layout = Admin;
export default ProductEditPage;

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
