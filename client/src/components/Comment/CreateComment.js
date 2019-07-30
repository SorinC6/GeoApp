import React, { useState, useContext } from "react";
import Context from "../../context";
import { withStyles } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import SendIcon from "@material-ui/icons/Send";
import Divider from "@material-ui/core/Divider";

import { CREATE_COMMENT_MUTATION } from "../../graphql/mutations";
import { useClient } from "../../clientQl";

const CreateComment = ({ classes }) => {
  const [comment, setComment] = useState("");
  const client = useClient();
  const { state, dispatch } = useContext(Context);

  const handleSubmitComment = async () => {
    const variables = { pinId: state.currentPin._id, text: comment };
    const data = await client.request(CREATE_COMMENT_MUTATION, variables);
    const { createComment } = data;
    dispatch({ type: "CREATE_COMMENT", payload: createComment });
    setComment("");
  };
  return (
    <>
      <form className={classes.form}>
        <IconButton
          onClick={() => setComment("")}
          className={classes.clearButton}
          disabled={!comment.trim()}
        >
          <ClearIcon />
        </IconButton>
        <InputBase
          className={classes.input}
          placeholder="Add Coments"
          multiline={true}
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <IconButton
          onClick={handleSubmitComment}
          className={classes.sendButton}
          disabled={!comment.trim()}
        >
          <SendIcon />
        </IconButton>
      </form>
      <Divider />
    </>
  );
};

const styles = theme => ({
  form: {
    display: "flex",
    alignItems: "center"
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  clearButton: {
    padding: 0,
    color: "red"
  },
  sendButton: {
    padding: 0,
    color: theme.palette.secondary.dark
  }
});

export default withStyles(styles)(CreateComment);
