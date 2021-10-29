import React from "react";
import { Box } from "@material-ui/core";
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
          lastReadMessageIndex === idx ? (
            <React.Fragment key={message.id}>
              <SenderBubble text={message.text} time={time} />
                <LastReadAvatar
                  alt={otherUser.username}
                  photoUrl={otherUser.photoUrl}
                />
            </React.Fragment>
          ) : (
            <SenderBubble key={message.id} text={message.text} time={time} />
          )
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
