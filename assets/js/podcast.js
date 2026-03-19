function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function setRangeUI(rangeElement, fillElement, thumbElement, percentage) {
  const safeValue = Math.max(0, Math.min(100, percentage));
  fillElement.style.width = `${safeValue}%`;
  thumbElement.style.left = `${safeValue}%`;
  rangeElement.setAttribute("aria-valuenow", String(Math.round(safeValue)));
}

export function initPodcast() {
  const audio = document.getElementById("podcastAudio");
  const playButton = document.getElementById("podcastPlayButton");
  const playIcon = document.getElementById("podcastPlayIcon");

  const progress = document.getElementById("podcastProgress");
  const progressFill = document.getElementById("podcastProgressFill");
  const progressThumb = document.getElementById("podcastProgressThumb");

  const timeDisplay = document.getElementById("podcastTime");

  const muteButton = document.getElementById("podcastMuteButton");
  const volumeIcon = document.getElementById("podcastVolumeIcon");
  const volume = document.getElementById("podcastVolume");
  const volumeFill = document.getElementById("podcastVolumeFill");
  const volumeThumb = document.getElementById("podcastVolumeThumb");

  const settingsButton = document.getElementById("podcastSettingsButton");
  const settingsMenu = document.getElementById("podcastSettingsMenu");
  const settingsOptions = document.querySelectorAll(".section-podcast__settings-option");

  if (
    !audio ||
    !playButton ||
    !playIcon ||
    !progress ||
    !progressFill ||
    !progressThumb ||
    !timeDisplay ||
    !muteButton ||
    !volumeIcon ||
    !volume ||
    !volumeFill ||
    !volumeThumb ||
    !settingsButton ||
    !settingsMenu
  ) {
    return;
  }

  let lastVolume = 0.66;
  audio.volume = lastVolume;
  audio.playbackRate = 1;

  function updatePlayState() {
    playIcon.classList.toggle("section-podcast__play-icon--play", audio.paused);
    playIcon.classList.toggle("section-podcast__play-icon--pause", !audio.paused);
  }

  function updateProgress() {
    if (!audio.duration) return;
    const percentage = (audio.currentTime / audio.duration) * 100;
    setRangeUI(progress, progressFill, progressThumb, percentage);
    timeDisplay.textContent = formatTime(audio.currentTime);
  }

  function updateVolumeState() {
    const currentVolume = audio.muted ? 0 : audio.volume * 100;
    setRangeUI(volume, volumeFill, volumeThumb, currentVolume);
    volumeIcon.classList.toggle(
      "section-podcast__volume-icon--muted",
      audio.muted || audio.volume === 0
    );
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
    audio.muted = safeValue === 0;

    if (safeValue > 0) {
      lastVolume = safeValue / 100;
    }

    updateVolumeState();
  }

  function openSettingsMenu() {
    settingsMenu.hidden = false;
    settingsButton.setAttribute("aria-expanded", "true");
  }

  function closeSettingsMenu() {
    settingsMenu.hidden = true;
    settingsButton.setAttribute("aria-expanded", "false");
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

  muteButton.addEventListener("click", () => {
    if (audio.muted || audio.volume === 0) {
      audio.muted = false;
      audio.volume = lastVolume > 0 ? lastVolume : 0.66;
    } else {
      lastVolume = audio.volume;
      audio.muted = true;
    }

    updateVolumeState();
  });

  settingsButton.addEventListener("click", (event) => {
    event.stopPropagation();

    if (settingsMenu.hidden) {
      openSettingsMenu();
    } else {
      closeSettingsMenu();
    }
  });

  settingsOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const speed = Number(option.dataset.speed);

      if (!Number.isNaN(speed)) {
        audio.playbackRate = speed;
      }

      closeSettingsMenu();
    });
  });

  document.addEventListener("click", (event) => {
    if (
      !settingsMenu.hidden &&
      !settingsMenu.contains(event.target) &&
      !settingsButton.contains(event.target)
    ) {
      closeSettingsMenu();
    }
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
      audio.muted = false;
      audio.volume = Math.min(audio.volume + 0.05, 1);
      if (audio.volume > 0) lastVolume = audio.volume;
      updateVolumeState();
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      audio.volume = Math.max(audio.volume - 0.05, 0);
      audio.muted = audio.volume === 0;
      if (audio.volume > 0) lastVolume = audio.volume;
      updateVolumeState();
    }
  });

  updatePlayState();
  updateVolumeState();
  closeSettingsMenu();
}