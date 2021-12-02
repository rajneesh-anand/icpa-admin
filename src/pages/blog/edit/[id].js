import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { getSession, useSession } from "next-auth/client";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import { slugify } from "@/libs/helper";
import Grid from "@material-ui/core/Grid";
import ToastMessage from "@/components/Snackbar/Snackbar";
import Seo from "@/components/Seo";
import Admin from "@/layouts/Admin";

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

function BlogEditPage({ blog }) {
  const editorRef = useRef();
  const { CKEditor, ClassicEditor } = editorRef.current || {};
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [isProcessing, setProcessingTo] = useState(false);
  const [image, setImage] = useState();
  const [content, setContent] = useState(blog.content);
  const [message, setMessage] = useState();
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState();
  const classes = useStyles();
  const [session, loading] = useSession();

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
    formData.append("image", image);
    formData.append("name", data.name);
    formData.append("category", data.category);
    formData.append("content", content);
    formData.append("slug", slugify(data.name));
    formData.append("status", data.status === "Active" ? true : false);
    formData.append("author", session?.user?.email);

    await fetch(`${process.env.API_URL}/blog/${blog.id}`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.status >= 400 && response.status < 600) {
          throw new Error("Bad response from server");
        } else {
          setProcessingTo(false);
          setMessage("Testinomial saved successfuly !");
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

  return (
    <React.Fragment>
      <Seo
        title="Add Blog | ICPA Global Consultants "
        description="ICPA Global Consultants"
        canonical={`${process.env.PUBLIC_URL}/blog`}
      />
      <div className={classes.root}>
        <form>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={12} md={12} style={{ margin: "8px 0px" }}>
              <label htmlFor="photo" className={classes.label}>
                SELECT BLOG THUMBNAIL IMAGE SIZE WxH ( 865 X 645 Px)
              </label>
              <input
                type="file"
                id="photo"
                name="photo"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
              <Controller
                name="name"
                control={control}
                defaultValue={blog.title}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="BLOG TITLE"
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
                rules={{ required: "Blog Title is required !" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="category"
                control={control}
                defaultValue={blog.category}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="BLOG CATEGORY"
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
                rules={{ required: "Category is required !" }}
              />
            </Grid>
            <Grid item xs={6} sm={6} md={6}>
              <div className={classes.select}>
                <Controller
                  name="status"
                  control={control}
                  defaultValue={blog.published ? "Active" : "Inactive"}
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
                        BLOG STATUS
                      </InputLabel>
                      <Select
                        native
                        defaultValue={blog.published ? "Active" : "Inactive"}
                        onChange={onChange}
                        label="BLOG STATUS"
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

            <Grid item xs={12} sm={12} md={12}>
              {editorLoaded ? (
                <CKEditor
                  editor={ClassicEditor}
                  data={content}
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
                  {isProcessing ? "Saving..." : `Save`}
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
  );
}

BlogEditPage.layout = Admin;
export default BlogEditPage;

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

  const course = await fetch(`${process.env.PUBLIC_URL}/api/blog/${id}`);
  const courseData = await course.json();

  return {
    props: { blog: courseData.data },
  };
}
