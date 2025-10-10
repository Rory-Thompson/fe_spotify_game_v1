let config;

load_handler();

document.getElementById("guest-btn").addEventListener("click", () => {
  sessionStorage.setItem("play_as_guest", "true");
});