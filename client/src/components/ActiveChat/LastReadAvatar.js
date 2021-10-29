import React from "react";
import { Box, Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end"
  },
  otherUserAvatar: {
    height: 22,
    width: 22
  },
}));

const LastReadAvatar = (props) => {
    const classes = useStyles();
    const { alt, photoUrl } = props;
    return (
      <Box className={classes.root}>
          <Avatar alt={alt} src={photoUrl} className={classes.otherUserAvatar} />
      </Box>
    );
}

export default LastReadAvatar;