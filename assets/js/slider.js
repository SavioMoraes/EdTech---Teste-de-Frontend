export function initSlider() {
  const track = document.querySelector(".section-slider__track");
  const slides = document.querySelectorAll(".section-slider__image");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const dots = document.querySelectorAll(".section-slider__dot");

  if (!track || !slides.length || !prevBtn || !nextBtn || !dots.length) {
    return;
  }

  let currentIndex = 1;
  const slideWidth = 958;

  function updateSlider() {
    track.style.transform = `translateX(-${(currentIndex - 1) * slideWidth}px)`;

    dots.forEach((dot, index) => {
      dot.classList.toggle("section-slider__dot--active", index === currentIndex - 1);
    });

    prevBtn.disabled = currentIndex === 1;
    nextBtn.disabled = currentIndex === slides.length;
  }

  prevBtn.addEventListener("click", () => {
    if (currentIndex > 1) {
      currentIndex -= 1;
      updateSlider();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentIndex < slides.length) {
      currentIndex += 1;
      updateSlider();
    }
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentIndex = index + 1;
      updateSlider();
    });
  });

  updateSlider();
}