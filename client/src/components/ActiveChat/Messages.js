import React from "react";
import { Box, Collapse } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";
import LastReadAvatar from "./LastReadAvatar";

const Messages = (props) => {
  const { messages, otherUser, userId, lastReadMessageIndex } = props;

  return (
    <Box>
      {messages.map((message, idx) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <React.Fragment key={message.id}>
            <SenderBubble text={message.text} time={time} />
            <Collapse in={lastReadMessageIndex === idx}>
              <LastReadAvatar
                alt={otherUser.username}
                photoUrl={otherUser.photoUrl}
              />
            </Collapse>
          </React.Fragment>
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
    </Box>
  );
};

export default Messages;
