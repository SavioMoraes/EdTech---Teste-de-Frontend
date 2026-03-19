function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function setProgress(progressElement, fillElement, thumbElement, percentage) {
  const safeValue = Math.max(0, Math.min(100, percentage));
  fillElement.style.width = `${safeValue}%`;
  thumbElement.style.left = `${safeValue}%`;
  progressElement.setAttribute("aria-valuenow", String(Math.round(safeValue)));
}

export function initPodcast() {
  const audio = document.getElementById("podcastAudio");
  const playButton = document.getElementById("podcastPlayButton");
  const playIcon = document.getElementById("podcastPlayIcon");
  const progress = document.getElementById("podcastProgress");
  const progressFill = document.getElementById("podcastProgressFill");
  const progressThumb = document.getElementById("podcastProgressThumb");
  const timeDisplay = document.getElementById("podcastTime");
  const volume = document.getElementById("podcastVolume");
  const volumeFill = document.getElementById("podcastVolumeFill");
  const volumeThumb = document.getElementById("podcastVolumeThumb");

  if (
    !audio ||
    !playButton ||
    !playIcon ||
    !progress ||
    !progressFill ||
    !progressThumb ||
    !timeDisplay ||
    !volume ||
    !volumeFill ||
    !volumeThumb
  ) {
    return;
  }

  audio.volume = 0.66;

  function updatePlayState() {
    playIcon.classList.toggle("section-podcast__play-icon--play", audio.paused);
    playIcon.classList.toggle("section-podcast__play-icon--pause", !audio.paused);
  }

  function updateProgress() {
    if (!audio.duration) return;
    const percentage = (audio.currentTime / audio.duration) * 100;
    setProgress(progress, progressFill, progressThumb, percentage);
    timeDisplay.textContent = formatTime(audio.currentTime);
  }

  function updateVolume() {
    const percentage = audio.volume * 100;
    setProgress(volume, volumeFill, volumeThumb, percentage);
  }

  function seek(clientX) {
    const rect = progress.getBoundingClientRect();
    const percentage = ((clientX - rect.left) / rect.width) * 100;
    const safeValue = Math.max(0, Math.min(100, percentage));
    if (audio.duration) {
      audio.currentTime = (safeValue / 100) * audio.duration;
    }
  }

  function changeVolume(clientX) {
    const rect = volume.getBoundingClientRect();
    const percentage = ((clientX - rect.left) / rect.width) * 100;
    const safeValue = Math.max(0, Math.min(100, percentage));
    audio.volume = safeValue / 100;
    updateVolume();
  }

  playButton.addEventListener("click", async () => {
    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        return;
      }
    } else {
      audio.pause();
    }
    updatePlayState();
  });

  audio.addEventListener("play", updatePlayState);
  audio.addEventListener("pause", updatePlayState);
  audio.addEventListener("timeupdate", updateProgress);
  audio.addEventListener("loadedmetadata", () => {
    timeDisplay.textContent = formatTime(audio.duration || 0);
    updateProgress();
  });
  audio.addEventListener("ended", () => {
    updatePlayState();
    updateProgress();
  });

  progress.addEventListener("click", (event) => {
    seek(event.clientX);
  });

  volume.addEventListener("click", (event) => {
    changeVolume(event.clientX);
  });

  progress.addEventListener("keydown", (event) => {
    if (!audio.duration) return;

    if (event.key === "ArrowRight") {
      event.preventDefault();
      audio.currentTime = Math.min(audio.currentTime + 5, audio.duration);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      audio.currentTime = Math.max(audio.currentTime - 5, 0);
    }
  });

  volume.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      audio.volume = Math.min(audio.volume + 0.05, 1);
      updateVolume();
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      audio.volume = Math.max(audio.volume - 0.05, 0);
      updateVolume();
    }
  });

  updatePlayState();
  updateVolume();
}