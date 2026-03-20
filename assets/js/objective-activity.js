const OBJECTIVE_STORAGE_KEY = "edtech:objective-activity";

function getObjectiveStorage() {
  const data = sessionStorage.getItem(OBJECTIVE_STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

function setObjectiveStorage(data) {
  sessionStorage.setItem(OBJECTIVE_STORAGE_KEY, JSON.stringify(data));
}

export function initObjectiveActivity() {
  const options = document.querySelectorAll(".section-objective-activity__option");
  const answerButton = document.getElementById("objectiveAnswerButton");
  const editButton = document.getElementById("objectiveEditButton");
  const feedback = document.getElementById("objectiveFeedback");
  const feedbackClose = document.getElementById("objectiveFeedbackClose");

  if (!options.length || !answerButton || !editButton || !feedback || !feedbackClose) {
    return;
  }

  let selectedOption = null;
  let isAnswered = false;

  function hideFeedback() {
    feedback.setAttribute("hidden", "");
  }

  function showFeedback() {
    feedback.removeAttribute("hidden");
  }

  function clearSelection() {
    options.forEach((option) => {
      option.classList.remove("is-selected");
    });
    selectedOption = null;
  }

  function selectOption(optionValue) {
    options.forEach((option) => {
      const isCurrent = option.dataset.option === optionValue;
      option.classList.toggle("is-selected", isCurrent);
    });

    selectedOption = optionValue;
  }

  function lockOptions() {
    options.forEach((option) => {
      option.classList.add("is-locked");
    });
  }

  function unlockOptions() {
    options.forEach((option) => {
      option.classList.remove("is-locked");
    });
  }

  function setInitialState() {
    isAnswered = false;
    clearSelection();
    answerButton.disabled = true;
    editButton.disabled = true;
    hideFeedback();
    unlockOptions();
  }

  function setSelectedState() {
    answerButton.disabled = !selectedOption;
    editButton.disabled = true;
    hideFeedback();
    unlockOptions();
  }

  function setAnsweredState(feedbackVisible = true) {
    isAnswered = true;
    answerButton.disabled = true;
    editButton.disabled = false;
    lockOptions();

    if (feedbackVisible) {
      showFeedback();
    } else {
      hideFeedback();
    }
  }

  function persistState() {
    setObjectiveStorage({
      selectedOption,
      feedbackVisible: !feedback.hasAttribute("hidden"),
      answerButtonDisabled: answerButton.disabled,
      editButtonDisabled: editButton.disabled,
      isAnswered
    });
  }

  function restoreState() {
    const storage = getObjectiveStorage();

    if (!storage || !storage.selectedOption) {
      setInitialState();
      return;
    }

    selectOption(storage.selectedOption);

    if (storage.isAnswered) {
      setAnsweredState(storage.feedbackVisible);
    } else {
      setSelectedState();
    }
  }

  options.forEach((option) => {
    option.setAttribute("tabindex", "0");

    option.addEventListener("click", () => {
      if (isAnswered) return;

      const optionValue = option.dataset.option;
      selectOption(optionValue);
      setSelectedState();
      persistState();
    });

    option.addEventListener("keydown", (event) => {
      if (isAnswered) return;

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const optionValue = option.dataset.option;
        selectOption(optionValue);
        setSelectedState();
        persistState();
      }
    });
  });

  answerButton.addEventListener("click", () => {
    if (!selectedOption) return;

    setAnsweredState(true);
    persistState();
  });

  editButton.addEventListener("click", () => {
    isAnswered = false;
    answerButton.disabled = !selectedOption;
    editButton.disabled = true;
    hideFeedback();
    unlockOptions();
    persistState();
  });

  feedbackClose.addEventListener("click", () => {
    hideFeedback();
    persistState();
  });

  restoreState();
}