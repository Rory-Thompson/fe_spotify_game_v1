## Oath 2
### General flow:  
The user will authenticate. generating a temporary access token authorized to use with this new app (our app).  
this access token along side the client secret token can be used to generate an access code that can be used to do everything.  
### definitions:
- **Authorization server**  
    In this case it is spotify, but it is the resource doing the verifying.
- **Resource Owner**  
    This is essentially the user
- **Client**  
    the application useing the authorization server (us)
### Concepts for authorization:
- **Response Type**  
    most common option is `code`
- **Scope**  
    The scope value for the authentication is required so the authorization server knows what permissions to give the client. 

    `3Duser-read-private` will be used initially for this value.
- **Redirect URI**  
    The URL the auth server will redirect the resource owner after they are authorised. 
    (could be called callback uri)
- **Client ID**  
    The client ID is available to see by anyone and identifies the client.  
    The client secret is only to be known by the resource owner and the client, and is required for authirzation by the auth server.
- **Authorization code**  
    The authorization code is temporary. It is generated after the user has authticated with the resource owner. it is then placed in the url of the redirect.  
    From this point the Client now sends this code, along side the client secret so now all parties can be verified by the auth server and an access token can now be recieved.
- **Access token**  
    Now the access token is the token used by the client for a period of time, to perform actions on behalf of the resource owner.  
    Technically the access token should **NOT** be sent to the user. It should be stored in an encrypted database, the client recieves the user id and matches up with the access token. 

## Code snippets:  
- **Curl post requirest to get the access token:**  
    <pre> curl -X POST https://accounts.spotify.com/api/token ^
    More? -H "Content-Type: application/x-www-form-urlencoded" ^
    More? -d "grant_type=authorization_code" ^
    More? -d "code=ENTER_CODE_FROM_URL" ^
    More? -d "redirect_uri=https://example.org/callback" ^
    More? -d "client_id=CLIENT_ID" ^
    More? -d "client_secret=CLIENT_SECRET"</pre>
- **Curl request to get user playlists.**
    <pre> curl -H "Authorization: Bearer ENTER_ACCESS_TOKEN" -H "Accept: application/json" -H "Content-Type:application/json" https://api.spotify.com/v1/me/playlists </pre>
- **Curl request to get the tracks in an album** 
    <pre>curl -H "Authorization: Bearer {ACCESSTOKEN}" -H "Accept: application/json" -H "Content-Type:application/json" https://api.spotify.com/v1/albums/{albumid} <pre>

    <pre>curl -H "Authorization: Bearer {ACCESSTOKEN}" -H "Accept: application/json" -H "Content-Type:application/json" https://api.spotify.com/v1/tracks/{trackid} <pre>

