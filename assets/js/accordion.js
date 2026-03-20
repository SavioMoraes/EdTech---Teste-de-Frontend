const ACCORDION_STORAGE_KEY = "edtech:accordion";

function getAccordionStorage() {
  return sessionStorage.getItem(ACCORDION_STORAGE_KEY);
}

function setAccordionStorage(value) {
  sessionStorage.setItem(ACCORDION_STORAGE_KEY, value);
}

export function initAccordion() {
  const accordionItems = document.querySelectorAll(".section-accordion__item");

  if (!accordionItems.length) {
    return;
  }

  accordionItems.forEach((item, index) => {
    item.dataset.accordionIndex = String(index);
  });

  const savedIndex = getAccordionStorage();

  if (savedIndex !== null) {
    accordionItems.forEach((item) => {
      item.open = item.dataset.accordionIndex === savedIndex;
    });
  } else {
    const initiallyOpenItem = document.querySelector(".section-accordion__item[open]");

    if (initiallyOpenItem) {
      setAccordionStorage(initiallyOpenItem.dataset.accordionIndex);
    }
  }

  accordionItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        accordionItems.forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.open = false;
          }
        });

        setAccordionStorage(item.dataset.accordionIndex);
      }
    });
  });
}