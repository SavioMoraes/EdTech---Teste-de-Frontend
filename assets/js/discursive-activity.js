const STORAGE_KEY = "edtech:activities";

function getStorage() {
  const data = sessionStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

function setStorage(data) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function initDiscursiveActivity() {
  const textarea = document.getElementById("discursiveTextarea");
  const answerButton = document.getElementById("discursiveAnswerButton");
  const editButton = document.getElementById("discursiveEditButton");
  const feedback = document.getElementById("discursiveFeedback");
  const feedbackClose = document.getElementById("discursiveFeedbackClose");

  if (!textarea || !answerButton || !editButton || !feedback || !feedbackClose) {
    return;
  }

  function hideFeedback() {
    feedback.setAttribute("hidden", "");
  }

  function showFeedback() {
    feedback.removeAttribute("hidden");
  }

  function setInitialState() {
    textarea.value = "";
    textarea.disabled = false;
    answerButton.disabled = true;
    editButton.disabled = true;
    hideFeedback();
  }

  function setAnsweredState() {
    textarea.disabled = true;
    answerButton.disabled = true;
    editButton.disabled = false;
    showFeedback();
  }

  function saveDiscursiveState() {
    const storage = getStorage();

    storage.discursive = {
      text: textarea.value.trim(),
      feedbackVisible: !feedback.hasAttribute("hidden")
    };

    setStorage(storage);
  }

  function restoreDiscursiveState() {
    const storage = getStorage();
    const data = storage.discursive;

    if (!data || !data.text) {
      setInitialState();
      return;
    }

    textarea.value = data.text;
    textarea.disabled = false;

    answerButton.disabled = true;
    editButton.disabled = false;

    if (data.feedbackVisible) {
      showFeedback();
    } else {
      hideFeedback();
    }
  }

  textarea.addEventListener("input", () => {
    const hasText = textarea.value.trim().length > 0;
    answerButton.disabled = !hasText;
    editButton.disabled = true;
  });

  answerButton.addEventListener("click", () => {
    const text = textarea.value.trim();

    if (!text) return;

    setAnsweredState();
    
    const storage = getStorage();
    storage.discursive = {
      text,
      feedbackVisible: true
    };
    setStorage(storage);
  });

  editButton.addEventListener("click", () => {
    textarea.disabled = false;
    answerButton.disabled = textarea.value.trim().length === 0;editButton.disabled = true;
    textarea.focus();
  });

  feedbackClose.addEventListener("click", () => {
    hideFeedback();

    const storage = getStorage();
    if (storage.discursive) {
      storage.discursive.feedbackVisible = false;
      setStorage(storage);
    }
  });

  restoreDiscursiveState();
}