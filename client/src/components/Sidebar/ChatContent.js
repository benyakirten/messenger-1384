import React from "react";
import { Box, Typography, Badge, Zoom } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  newPreviewText: {
    fontSize: theme.typography.fontSize,
    fontWeight: "bold",
    color: theme.palette.common.black,
  },
  seenPreviewText: {
    fontSize: theme.typography.fontSize,
    fontWeight: "normal",
    color: theme.palette.common.faded,
  },
  unreadMessageBox: {
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(),
  },
}));

const ChatContent = (props) => {
  const { conversation } = props;
  const { latestMessageText, otherUser } = conversation;

  const hasUnreadMessages = conversation.unreadMessages > 0;

  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={hasUnreadMessages ? classes.newPreviewText : classes.seenPreviewText}>
          {latestMessageText}
        </Typography>
      </Box>
      <Zoom in={hasUnreadMessages}>
        <Box className={classes.unreadMessageBox}>
          <Badge
            badgeContent={conversation.unreadMessages}
            color="primary"
          />
        </Box>
      </Zoom>
    </Box>
  );
};

export default ChatContent;
