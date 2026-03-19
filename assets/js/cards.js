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
  }

  function closeCard() {
    expandedCard.classList.remove("is-open");
    expandedCard.setAttribute("aria-hidden", "true");
    cardsContainer.classList.remove("has-open-card");
  }

  openButtons.forEach((button) => {
    button.addEventListener("click", openCard);
  });

  closeButton.addEventListener("click", closeCard);
}