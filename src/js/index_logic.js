async function fetch_config() {
    const response = await fetch("/api/config.json", {
        method: "GET",
        headers: {
            "Accept": "application/json",
        }
    })
    if (!response.ok) {
        throw new Error(`the authorization failed from server. Error: ${response.status}`);
    }
    json_response = await response.json();
    return json_response
}
async function load_handler() {
    sessionStorage.setItem("play_as_guest","false");//set the sessions storage item to be reset (unless user clicks play as guest. )
    let config_res = await fetch_config();
    config = config_res;
    let redirect_link = document.querySelector("#redirect-link");
    let current_href = redirect_link.href;
    let url = update_url_encoding(current_href,"redirect_uri",config.redirect_uri);
    redirect_link.href= url;
    let play_as_guest = document.querySelector("#guest-btn");
    play_as_guest.href= config.redirect_uri;
    console.log("redirect url successfully update to config: ", url);
}

function update_url_encoding(original_href,params_change, new_param) {
    const url = new URL(original_href);

    const params = url.searchParams;
    params.set(params_change,new_param);
    return url.href
}