const CARDS_STORAGE_KEY = "edtech:cards";

function getCardsStorage() {
  return sessionStorage.getItem(CARDS_STORAGE_KEY) === "open";
}

function setCardsStorage(isOpen) {
  sessionStorage.setItem(CARDS_STORAGE_KEY, isOpen ? "open" : "closed");
}

export function initCards() {
  const cardsContainer = document.querySelector(".section-cards__container");
  const expandedCard = document.querySelector("[data-card-expanded]");
  const openButtons = document.querySelectorAll("[data-open-card]");
  const closeButton = document.querySelector("[data-close-card]");

  if (!cardsContainer || !expandedCard || !openButtons.length || !closeButton) {
    return;
  }

  function openCard() {
    expandedCard.classList.add("is-open");
    expandedCard.setAttribute("aria-hidden", "false");
    cardsContainer.classList.add("has-open-card");
    setCardsStorage(true);
  }

  function closeCard() {
    expandedCard.classList.remove("is-open");
    expandedCard.setAttribute("aria-hidden", "true");
    cardsContainer.classList.remove("has-open-card");
    setCardsStorage(false);
  }

  openButtons.forEach((button) => {
    button.addEventListener("click", openCard);
  });

  closeButton.addEventListener("click", closeCard);

  if (getCardsStorage()) {
    openCard();
  } else {
    closeCard();
  }
}