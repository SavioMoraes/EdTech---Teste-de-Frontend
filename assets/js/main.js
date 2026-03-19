const App = {
	init: () => {
		console.log('App iniciado');
		App.initSections;		
	},

	initSections: () => {
		App.initVideo();
		App.initSlider();
		App.initCards();
		App.initAccordions();
		App.initDiscursiveActivity();
		App.initObjectiveActivity();
	},

	initVideo: () => {},
	initSlider: () => {},
	initCards: () => {},
	initAccordions: () => {},
	initDiscursiveActivity: () => {},
	initObjectiveActivity: () => {}
};

document.addEventListener('DOMContentLoaded', App.init);

// SECTION VÌDEO
let youtubePlayer = null;
let playerReady = false;
let progressInterval = null;
let isMuted = false;
let currentVolume = 67;

const centerPlayButton = document.getElementById("videoCenterPlayButton");
const centerPlayIcon = document.getElementById("videoCenterPlayIcon");
const playPauseButton = document.getElementById("videoPlayPauseButton");
const playPauseIcon = document.getElementById("videoPlayPauseIcon");
const muteButton = document.getElementById("videoMuteButton");
const muteIcon = document.getElementById("videoMuteIcon");
const progressBar = document.getElementById("videoProgressBar");
const progressFill = document.getElementById("videoProgressFill");
const timeDisplay = document.getElementById("videoTimeDisplay");
const volumeBar = document.getElementById("videoVolumeBar");
const volumeFill = document.getElementById("videoVolumeFill");
const volumeThumb = document.getElementById("videoVolumeThumb");
const fullscreenButton = document.getElementById("videoFullscreenButton");
const videoContainer = document.getElementById("videoPlayerContainer");

const playSvg = `
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
    <path d="M8 5v14l11-7z"></path>
  </svg>
`;

const pauseSvg = `
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
    <rect x="6" y="5" width="4" height="14"></rect>
    <rect x="14" y="5" width="4" height="14"></rect>
  </svg>
`;

const volumeSvg = `
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
    <path d="M3 9v6h4l5 5V4L7 9H3z"></path>
    <path d="M16 7c1.5 1.5 1.5 8.5 0 10" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"></path>
    <path d="M19 4c3 3 3 13 0 16" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"></path>
  </svg>
`;

const muteSvg = `
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
    <path d="M3 9v6h4l5 5V4L7 9H3z"></path>
    <line x1="16" y1="8" x2="22" y2="16" stroke="white" stroke-width="2"></line>
    <line x1="22" y1="8" x2="16" y2="16" stroke="white" stroke-width="2"></line>
  </svg>
`;

const loadYouTubeApi = () => {
  if (window.YT && window.YT.Player) {
    onYouTubeIframeAPIReady();
    return;
  }

  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);
};

const playerElement = document.getElementById("youtube-player");

window.onYouTubeIframeAPIReady = () => {
  youtubePlayer = new window.YT.Player("youtube-player", {
	videoId: playerElement.dataset.videoId,
    playerVars: {
      autoplay: 0,
      controls: 0,
      rel: 0,
      modestbranding: 1,
      playsinline: 1
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
};

const onPlayerReady = (event) => {
  playerReady = true;
  event.target.setVolume(currentVolume);
  updateVolumeUI(currentVolume);
  updatePlayButtons(false);
  startProgressLoop();
};

const onPlayerStateChange = (event) => {
  const isPlaying = event.data === window.YT.PlayerState.PLAYING;
  updatePlayButtons(isPlaying);
};

const togglePlayPause = () => {
  if (!playerReady || !youtubePlayer) return;

  const state = youtubePlayer.getPlayerState();

  if (state === window.YT.PlayerState.PLAYING) {
    youtubePlayer.pauseVideo();
  } else {
    youtubePlayer.playVideo();
  }
};

const updatePlayButtons = (isPlaying) => {
  playPauseIcon.innerHTML = isPlaying ? pauseSvg : playSvg;
  centerPlayIcon.innerHTML = isPlaying ? pauseSvg : playSvg;
};

const formatTime = (seconds) => {
  const safeSeconds = Math.floor(seconds || 0);
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
};

const updateProgressUI = () => {
  if (!playerReady || !youtubePlayer || typeof youtubePlayer.getDuration !== "function") return;

  const duration = youtubePlayer.getDuration();
  const currentTime = youtubePlayer.getCurrentTime();

  if (!duration) {
    timeDisplay.textContent = "0:00";
    progressFill.style.width = "0%";
    progressBar.setAttribute("aria-valuenow", "0");
    return;
  }

  const progressPercent = (currentTime / duration) * 100;
  progressFill.style.width = `${progressPercent}%`;
  progressBar.setAttribute("aria-valuenow", String(Math.round(progressPercent)));
  timeDisplay.textContent = formatTime(currentTime);
};

const startProgressLoop = () => {
  if (progressInterval) {
    clearInterval(progressInterval);
  }

  progressInterval = setInterval(updateProgressUI, 300);
};

const seekVideo = (event) => {
  if (!playerReady || !youtubePlayer) return;

  const rect = progressBar.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const percent = Math.max(0, Math.min(1, clickX / rect.width));
  const duration = youtubePlayer.getDuration();

  if (duration) {
    youtubePlayer.seekTo(duration * percent, true);
    updateProgressUI();
  }
};

const updateVolumeUI = (volumeValue) => {
  const clampedVolume = Math.max(0, Math.min(100, volumeValue));
  const maxBarWidth = 45.77;
  const fillWidth = (clampedVolume / 100) * maxBarWidth;

  volumeFill.style.width = `${fillWidth}px`;
  volumeThumb.style.left = `${fillWidth}px`;
  volumeThumb.style.right = "auto";
  volumeBar.setAttribute("aria-valuenow", String(Math.round(clampedVolume)));
};

const setVolumeFromClick = (event) => {
  if (!playerReady || !youtubePlayer) return;

  const rect = volumeBar.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const percent = Math.max(0, Math.min(1, clickX / rect.width));
  const volumeValue = Math.round(percent * 100);

  currentVolume = volumeValue;
  youtubePlayer.setVolume(currentVolume);

  if (currentVolume > 0 && isMuted) {
    youtubePlayer.unMute();
    isMuted = false;
  }

  updateVolumeUI(currentVolume);
  muteIcon.innerHTML = currentVolume === 0 || isMuted ? muteSvg : volumeSvg;
};

const toggleMute = () => {
  if (!playerReady || !youtubePlayer) return;

  if (isMuted || youtubePlayer.isMuted()) {
    youtubePlayer.unMute();
    isMuted = false;
  } else {
    youtubePlayer.mute();
    isMuted = true;
  }

  muteIcon.innerHTML = isMuted ? muteSvg : volumeSvg;
};

const toggleFullscreen = async () => {
  if (!videoContainer) return;

  if (!document.fullscreenElement) {
    await videoContainer.requestFullscreen();
  } else {
    await document.exitFullscreen();
  }
};

if (centerPlayButton) {
  centerPlayButton.addEventListener("click", togglePlayPause);
}

if (playPauseButton) {
  playPauseButton.addEventListener("click", togglePlayPause);
}

if (progressBar) {
  progressBar.addEventListener("click", seekVideo);
}

if (volumeBar) {
  volumeBar.addEventListener("click", setVolumeFromClick);
}

if (muteButton) {
  muteButton.addEventListener("click", toggleMute);
}

if (fullscreenButton) {
  fullscreenButton.addEventListener("click", toggleFullscreen);
}

loadYouTubeApi();

// SECTION SLIDER
import { initSlider } from "./slider.js";
import { initCards } from "./cards.js";
import { initPodcast } from "./podcast.js";

document.addEventListener("DOMContentLoaded", () => {
	initSlider();
	initCards();
	initPodcast();
})