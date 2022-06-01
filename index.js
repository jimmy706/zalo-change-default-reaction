const chatMessageIdsMap = new Map();
const chatRoomIdsMap = new Map();

function getReactionButtonAndChangeDefaultReact(chatMessage) {
  async function sendDefaultReaction(e) {
    e.stopPropagation(); // Stop the bubling of event
    let defaultReaction = "/-heart";
    try {
      const data = await chrome.storage.sync.get("defaultReaction");
      if (data) {
        defaultReaction = data.defaultReaction;
      }
    } catch (err) {
      console.err(err);
    }
    const defaultReactionIcon = [
      ...chatMessage.querySelectorAll(
        ".reaction-emoji-icon .emoji-sizer.emoji-outer"
      ),
    ].find((ele) => {
      return ele.textContent.includes(defaultReaction);
    });
    if (defaultReactionIcon) {
      defaultReactionIcon.click();
    }
  }

  const defaultReactionButton = chatMessage.querySelector(".msg-reaction-icon > .default-react-icon-thumb");
  if (defaultReactionButton) {
    defaultReactionButton.addEventListener("click", sendDefaultReaction);
  }
}

function setDefaultReaction() {
  new Promise(function (resolve, reject) {
    setTimeout(function () {
      let messageItems = [...document.querySelectorAll(".msg-item")];
      if (messageItems && messageItems.length) {
        resolve(messageItems);
      } else {
        reject(null);
      }
    }, 1000); // Wait for fetch API success
  }).then((messageItems) => {
    messageItems.forEach((messageItem) => {
      messageItem.addEventListener("click", onMessageChatBoxClicked);
    });
  });
}

async function onMessageChatBoxClicked(e) {
  const messageBox = e.target;
  // Add click event and sent default reaction
  const chatMessages = await new Promise(function (resolve, reject) {
    setTimeout(() => {
      const chatMessages = Array.from(
        document.querySelectorAll(".chat-message.wrap-message.rotate-container")
      );
      if (chatMessages) {
        resolve(chatMessages);
      } else {
        reject(null);
      }
    }, 500);

    messageBox.removeEventListener("click", onMessageChatBoxClicked); // Only listen 1 time
  });

  chatMessages.forEach((chatMessage) => {
    if (!chatMessageIdsMap.has(chatMessage.id)) {
      chatMessageIdsMap.set(chatMessage.id, chatMessage);
      getReactionButtonAndChangeDefaultReact(chatMessage);
    }
  });

  // Continuely query new messages comming and set default reaction to it
  setInterval(() => {
    const domChatMessages = Array.from(
      document.querySelectorAll(".chat-message.wrap-message.rotate-container")
    );
    if (domChatMessages) {
      const newChatMessages = domChatMessages.filter(
        (chatMessage) => !chatMessageIdsMap.has(chatMessage.id)
      ); // Check if message has already set default reaction

      newChatMessages.forEach((chatMessage) => {
        chatMessageIdsMap.set(chatMessage.id, chatMessage);
        getReactionButtonAndChangeDefaultReact(chatMessage);
      });
    }
  }, 400);
}

setDefaultReaction();
