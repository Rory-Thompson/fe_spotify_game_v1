const original_href = "http://example.com/dashboard.html?redirect_uri=http://127.0.0.1:3000/dashboard.html";
const params_change = "redirect_uri";
const new_param = "http://my-new-domain.com/callback?foo=bar";
console.log("################################################################");
console.log("the test object has been created successfully. begining tests index.js.")
console.log("################################################################")
console.log("TEST 1");
const updated_href = update_url_encoding(original_href, params_change, new_param);
console.log(updated_href);
console.assert(updated_href === "http://example.com/dashboard.html?redirect_uri=http%3A%2F%2Fmy-new-domain.com%2Fcallback%3Ffoo%3Dbar", "the url change has not been encoded correctly");

console.log("################################################################");
console.log("✅ All browser index.js tests passed!")
console.log("################################################################")
