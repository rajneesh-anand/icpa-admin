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
    padding: 6,
    marginRight: 6,
    color: "black",
  },
}));

function TestinomialEditPage({ testinomials }) {
  const editorRef = useRef();
  const { CKEditor, ClassicEditor } = editorRef.current || {};
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [isProcessing, setProcessingTo] = useState(false);
  const [image, setImage] = useState();
  const [content, setContent] = useState(testinomials.description);
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
    formData.append("company", data.company);
    formData.append("location", data.location);
    formData.append("content", content);

    await fetch(`${process.env.API_URL}/testinomial/${testinomials.id}`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.status >= 400 && response.status < 600) {
          throw new Error("Bad response from server");
        } else {
          setProcessingTo(false);
          setMessage("Testinomial updated successfuly !");
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
        title="Add Testinomial | ICPA Global Consultants "
        description="ICPA Global Consultants"
        canonical={`${process.env.PUBLIC_URL}/testinomial`}
      />
      <div className={classes.root}>
        <form>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={12} md={12} style={{ margin: "8px 0px" }}>
              <div className="thumb-image">
                <label htmlFor="photo" className={classes.label}>
                  SELECT CLIENT IMAGE SIZE WxH ( 160 X 160 Px)
                </label>
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
              {image && (
                <div className="text-center">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="blog-image"
                    height="160px"
                    width="160px"
                  />
                </div>
              )}
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="name"
                control={control}
                defaultValue={testinomials.name}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="CLIENT NAME"
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
                rules={{ required: "Client Name is required !" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="company"
                control={control}
                defaultValue={testinomials.company}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="ORGANIZATION/COMPANY"
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
                rules={{ required: "Organization Name is required !" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="location"
                control={control}
                defaultValue={testinomials.location}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="CITY - STATE"
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
  );
}

TestinomialEditPage.layout = Admin;
export default TestinomialEditPage;

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

  const response = await fetch(
    `${process.env.PUBLIC_URL}/api/testinomial/${id}`
  );
  const result = await response.json();

  return {
    props: { testinomials: result ? result.data : null },
  };
}
