## Quiz Lynx Spotify Game

Quiz Lynx is a web development project aiming to procedurally generate user specific quiz questions.  

### How does it work?
- Users can select a playlist (or multiple but not fully supported yet), then our backend logic will use these songs to create basic questions 
specifically for this playlist. 

### How is your data used and accessed? 
- We take your data using an access token from Spotify. We do not handle any of your passwords or secrets. You are authorizing us temporary access with Spotify mediating the exchange.
- Your data is not saved to our backend server, it is only held while the quiz is generated then all memory is wiped. 

### How is this website secure?
- Your data is encrypted via the https protocol, hence no malicious actors can read the data.

### How to use this website? 
- You can play as a guest, if you play as a guest no interaction happens with our server, so it is completely safe and secure. 
- You can play with Spotify, this will give us temporary access using O-Auth 2 (a widely used protocol) to make requests to Spotify.
### Current Issues. 
- Currently for connect with Spotify Spotify is not authorizing the application for more than 25 pre determined users. If you wish to connect with Spotify, please contact the owner on github or somewhere. *(Note you can still play as a guest) 
- The 2 player option doesn't do anything. Techincally it just hasn't been built yet though.


### Some Notes on its development. 
This website was mostly created as a hobby/learning project to fully understand the basics of web development and how the internet works. 
- To keep things simple this website is mostly static. There is not a huge amount of interaction with the front end and back end. 
- This helps minimise the amount of work the server anyway.
- It is a pure vanilla js/css/html project. Everything is written in vanilla form and most of the icons and styling are created for this project specifically. 
- The backend is written in Rust and is designed to be light weight. 
- No backend database is required as of now. Nothing needs to be saved, keeping security simple 
- The website is hosted using a Cloudflare tunnel.
- Some basic ui changes might come in to play iteratively.
- Currently Spotify has changed the requirements to get open API access. Hence this project will probably just sit as is until/if this ever changes.
