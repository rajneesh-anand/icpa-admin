import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { getSession } from "next-auth/client";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import ToastMessage from "@/components/Snackbar/Snackbar";
import Seo from "@/components/Seo";
import Admin from "@/layouts/Admin";
import prisma from "@/libs/prisma";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "& .MuiFormControl-root": {
      minWidth: "100%",
    },
    marginTop: 16,
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

function FaqEditPage({ faq }) {
  const editorRef = useRef();
  const { CKEditor, ClassicEditor } = editorRef.current || {};
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [isProcessing, setProcessingTo] = useState(false);
  const [content, setContent] = useState(faq.description);
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

    formData.append("title", data.title);
    formData.append("description", content);
    formData.append("status", data.status === "Active" ? true : false);

    await fetch(`${process.env.API_URL}/faq/${faq.id}`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.status >= 400 && response.status < 600) {
          throw new Error("Bad response from server");
        } else {
          setProcessingTo(false);
          setMessage("F.A.Q updated successfuly !");
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
        title="Edit F.A.Q | ICPA Global Consultants "
        description="ICPA Global Consultants"
        canonical={`${process.env.PUBLIC_URL}/faq`}
      />
      <div className={classes.root}>
        <form>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={10} md={10}>
              <Controller
                name="title"
                control={control}
                defaultValue={faq.title}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="QUESTION ? "
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
                rules={{ required: "Question is required !" }}
              />
            </Grid>
            <Grid item xs={12} sm={2} md={2}>
              <Controller
                name="status"
                control={control}
                defaultValue={faq.status ? "Active" : "Inactive"}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                    size="small"
                  >
                    <InputLabel htmlFor="course_status">STATUS</InputLabel>
                    <Select
                      native
                      defaultValue={faq.status ? "Active" : "Inactive"}
                      onChange={onChange}
                      label="STATUS"
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
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
              <label>ANSWER DESCRIPTION </label>
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

FaqEditPage.layout = Admin;
export default FaqEditPage;

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
  const data = await prisma.faq.findFirst({
    where: {
      id: Number(id),
    },
  });

  console.log(data);
  return {
    props: {
      faq: data,
    },
  };
}
