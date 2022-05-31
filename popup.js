const reactions = [
  {
    value: "/-strong",
    id: "strong",
    image:
      "background: url('/image/emoji.png') 84% 82.5% / 5100%; -webkit-user-drag: none; margin: -1px; position: relative; top: 2px;",
  },
  {
    value: "/-heart",
    id: "heart",
    image:
      "background: url('/image/emoji.png') 84% 72.5% / 5100%; -webkit-user-drag: none; margin: -1px; position: relative; top: 2px;",
  },
  {
    value: ":>",
    id: "smile",
    image:
      "background: url('/image/emoji.png') 82% 7.5% / 5100%; -webkit-user-drag: none; margin: -1px; position: relative; top: 2px;",
  },
  {
    value: ":o",
    id: "supprise",
    image:
      "background: url('/image/emoji.png') 84% 20% / 5100%; -webkit-user-drag: none; margin: -1px; position: relative; top: 2px;",
  },
  {
    value: ":-((",
    id: "sad",
    image:
      "background: url('/image/emoji.png') 84% 2.5% / 5100%; -webkit-user-drag: none; margin: -1px; position: relative; top: 2px;",
  },
  {
    value: ":-h",
    id: "angry",
    image:
      "background: url('/image/emoji.png') 84% 5% / 5100%; -webkit-user-drag: none; margin: -1px; position: relative; top: 2px;",
  },
];

function initAction(defaultReaction) {
  const reactionList = document.getElementById("reaction-list");
  const listChilds = reactions.map((react) => {
    return (
      `
    <li class='reaction-list__item' >
      <input ` +
      (react.value === defaultReaction ? "checked" : "") +
      ` value="${react.value}" class='reaction-list__checked' type='radio' name="defaultReaction" id="${react.id}" />
      <label class='reaction-list__icon' for="${react.id}">
        <span style="${react.image}"></span>
      </label>
    </li>`
    );
  });

  reactionList.innerHTML = listChilds.join("");

  document.addEventListener("click", function (e) {
    if (e.target.className.includes("reaction-list__checked")) {
      const defaultReaction = e.target.value;
      chrome.storage.sync.set({ defaultReaction });
      // notifyDefaultReactionChangedToContentScript(defaultReaction);
    }
  });
}

// async function notifyDefaultReactionChangedToContentScript(newDefaultReaction) {
//   const [tab] = await chrome.tabs.query({
//     active: true,
//     currentWindow: true,
//     title: "Zalo Web",
//   });
//   if (tab) {
//     chrome.tabs.sendMessage(tab.id, newDefaultReaction); // Notify content script new default reaction is set
//   }
// }


let defaultReaction = "/-heart";

chrome.storage.sync.get("defaultReaction", function (data) {
  if (data) {
    defaultReaction = data.defaultReaction;
  }
  initAction(defaultReaction)
});
