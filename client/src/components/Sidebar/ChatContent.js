import React from "react";
import { Box, Typography, Chip, Zoom } from "@material-ui/core";
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
  previewText: {
    fontSize: 12,
    fontWeight: ({ hasUnreadMessages }) => (hasUnreadMessages ? "600" : "400"),
    color: ({ hasUnreadMessages }) =>
      hasUnreadMessages ? "rgba(0, 0, 0, 0.87)" : "#9CADC8",
    transition: 'all 0.4s ease',
  },
}));

const ChatContent = (props) => {
  const { conversation } = props;
  const { latestMessageText, otherUser } = conversation;

  const hasUnreadMessages = conversation.unreadMessages > 0;

  const classes = useStyles({ hasUnreadMessages });

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={classes.previewText}>
          {latestMessageText}
        </Typography>
      </Box>
      <Zoom in={hasUnreadMessages}>
        <Chip label={conversation.unreadMessages} color="primary" />
      </Zoom>
    </Box>
  );
};

export default ChatContent;
