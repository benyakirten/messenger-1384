export const addMessageToStore = (state, payload) => {
  const { message, sender, activeConversation, userId } = payload;

  const newMessageCount = userId !== message.senderId ? 1 : 0;

  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
      unreadMessages: newMessageCount,
    };
    newConvo.latestMessageText = message.text;
    return [newConvo, ...state];
  }

  const convoToUpdate = state.find(convo => convo.id === message.conversationId);
  
  if (!convoToUpdate) {
    // the find method can return undefined
    // this check is to prevent the client from erroring out or becoming unresponsive
    return state;
  }

  const updatedUnreadMessages = convoToUpdate.id === activeConversation
    ? 0
    : convoToUpdate.unreadMessages + newMessageCount;
  
  const updatedConvo = {
    ...convoToUpdate,
    unreadMessages: updatedUnreadMessages,
    latestMessageText: message.text,
    messages: [
      ...convoToUpdate.messages,
      message
    ]
  };
  const otherConvos = state.filter(convo => convo.id !== message.conversationId);

  return [
    updatedConvo,
    ...otherConvos
  ];
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      return {
        ...convo,
        id: message.conversationId,
        latestMessageText: message.text,
        messages: [
          ...convo.messages,
          message
        ]
      }
    } else {
      return convo;
    }
  });
};

export const readAllMessagesFromConversation = (state, conversationId) => {
  return state.map((convo) => {
    if (
      convo.id === conversationId
      && convo.messages.length > 0
      && convo.unreadMessages > 0
    ) {
      return {
        ...convo,
        unreadMessages: 0
      }
    }
    return convo;
  });
}

export const setReadToLatestMessage = (state, conversationId) => {
  return state.map((convo) => {
    if (convo.id === conversationId) {
      return {
        ...convo,
        lastReadMessageIndex: convo.messages.length - 1
      };
    }
    return convo;
  })
}