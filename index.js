function getReactionButtonAndChangeDefaultReact(chatMessage) {
  async function sendDefaultReaction(e) {
    e.preventDefault();
    e.stopPropagation(); // Stop the default behavior of clicking Zalo reaction icon
    let defaultReaction = "/-heart";
    const data = await chrome.storage.sync.get("defaultReaction");
    if (data) {
      defaultReaction = data.defaultReaction;
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
  const defaultReactionButton = chatMessage.querySelector(
    ".msg-reaction-icon"
  );

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

async function onMessageChatBoxClicked() {
  // Add click event and sent default reaction
  const chatMessageIdsMap = new Map();
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
    }, 1000);
  });

  chatMessages.forEach((chatMessage) => {
    chatMessageIdsMap.set(chatMessage.id, chatMessage);
    getReactionButtonAndChangeDefaultReact(chatMessage);
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
  }, 200);
}

setDefaultReaction();
