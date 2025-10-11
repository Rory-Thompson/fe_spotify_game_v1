let config;
let guestBtn = document.querySelector("#guest-btn"); 
load_handler();

window.addEventListener("pageshow", (event) => {
  // Always fires when the page becomes visible, including bfcache restores
  console.log("User navigated to this page");
  
  if (event.persisted) {
    console.log("Restored from back/forward cache");
    sessionStorage.setItem("play_as_guest","false");//set the sessions storage item to be reset (unless user clicks play as guest. )
  }

  // Put your trigger code here
});

guestBtn.addEventListener("click", () => {
  sessionStorage.setItem("play_as_guest", "true");
});