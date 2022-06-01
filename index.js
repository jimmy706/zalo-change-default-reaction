function getMessageReactionBoxAndSendDefaultReaction(ele, isClickOutSide = false) {
  let chatMessage = isClickOutSide ? ele.parentElement : ele.parentElement.parentElement;

  if (chatMessage) {
    sendDefaultReaction(chatMessage);
  }
}

async function sendDefaultReaction(chatMessage) {
  let defaultReaction = "/-heart";

  const data = await chrome.storage.sync.get("defaultReaction");
  if (data) {
    defaultReaction = data.defaultReaction;
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
}

function preventDefaultEventState(e) {
  e.preventDefault();
  e.stopImmediatePropagation();
}

document.addEventListener("mousedown", function (e) {
  const target = e.target;
  if (target.className.includes("default-react-icon-thumb")) {
    getMessageReactionBoxAndSendDefaultReaction(target);
  } else if (target.className.includes("msg-reaction-icon")) {
    getMessageReactionBoxAndSendDefaultReaction(target, true);
  }
});
