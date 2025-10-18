const nextButtonsSetup = document.querySelectorAll(".next-button-setup");//finds all the elements that have the class .nextbutton
const setupTabLinks = document.querySelectorAll(".tablinks-btn");
const setupSteps = document.querySelectorAll(".setup-step");
const rowSearchPlaylist = document.querySelectorAll(".row-playlist");
const playlistSelectIndex = document.querySelectorAll(".row-index-playlist");
const multiChoiceOption = document.querySelectorAll(".multi-choice-option");
const playlistSearch = document.querySelector(".search-input-playlist");
const rowSearchContainer = document.querySelector(".rows-search-container");//used for the shadow effect for a scrollable container.
const StartPlayingBtn = document.querySelector(".start-game-btn");
const setupContainer = document.querySelector("#setup-container");
const playlistRowSearchContainer = document.querySelector(".rows-search-container-playlist");
let myTokens;
let myPlaylists;

let activeTabIndex = 0;
console.log(setupTabLinks.length);
console.log(setupTabLinks)
console.log("row search elements: ", rowSearchPlaylist)
const setupCompletion = new Map();//is a map of setup steps. 

async function accessTokenOnLoad(auth_code) {
    let accessTokens = await get_access_token("FrankWalker123",auth_code);
    let myPlaylistsRaw = await get_my_playlists(accessTokens);
    let myPlaylists = construct_clean_playlists(myPlaylistsRaw);
    for (playlist of myPlaylists) {
        createRow(playlist,playlistRowSearchContainer)
    }
}
function getQueryVariable(variable) {
    //purpose: extract variables from url encoded variables.
    //  pass in a string of the variable name. eg "code". this gives the auth code. 
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
    }
    return(false);
}



 async function get_access_token(user_id, auth) {

    //purpose: send requirest to base auth api to create and fetch access tokens. 
    //if no base is put it it will just do the request relative to the current path the website is hosted from. so i can do /api/auth no worries. no need for config. 
    const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({userid: user_id, auth_code: auth}),
    })
    if (!response.ok) {
        throw new Error(`the authorization failed from server. Error: ${response.status}`);
    }
    myTokens = await response.json(); 
    return myTokens
 }

 async function get_my_playlists(myTokens) {
    const response = await fetch("https://api.spotify.com/v1/me/playlists", {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${myTokens.access_token}`
        }
    });
    if (!response.ok) {
        throw new Error(`the authorization failed from server. Error: ${response.status}`);    
    }
    myPlaylists = await response.json();
    console.log("these are my playlists: ", myPlaylists);
    return myPlaylists
}

function construct_clean_playlists(playlists) {
    //input: a raw response from the spotify api. to the v1/me/playlists location. 
    let playlistsArray = [];
    console.log("playlists passed to construct_clean_playlists.",playlists);
    for (playlist of playlists.items) {
        playlistsArray.push({
            "id": playlist.id,
            "coverSource": playlist.images[playlist.images.length-1].url,
            "playlistTitle": playlist.name,
            "trackCount": playlist.tracks.total
        })
    };
    console.log("final clean playlist array. ", playlistsArray);
    return playlistsArray
}
//setupCompletion.
class setupStep {
    //used for each setup step.
    constructor(id,completionStatus, selectedOptions,element,elementTab) {
        this.id = id;
        this.element = element;// pass through the element itself.
        this.completionStatus = completionStatus;
        this.selectedOptions = selectedOptions;//make this an array 
        this.elementTab = elementTab;
        //would be nice to have a function that defines how to check if it is complete or not. 
    }
}
//maybe it makes sense in the class setupStep (that will be a child of the class question or something)
// There will be a reference to a pointer to a sub class that will be options. that way we know exactly the options attached to a step

playlistSearch.addEventListener("input", (event) => {
        //the browser will pass the event into the first parameter of the function. I could technically define it as 'apple' or something.
        // parent division, then find the container with the rows in it. 
        const fullContainerName = ".multi-choice-select-container";
        const text = event.target.value;
        const searchColumn = "#search-column";
        const hideClassName = "hide-row-search";
        let searchContainer = playlistSearch.closest(fullContainerName);
        //console.log("search container: ", searchContainer);
        searchList(searchContainer, searchColumn, hideClassName,text);


    });

function searchList(searchContainer, searchColumn, hideClassName, text) {
    //purpose: to be used when there is an input search field. 
    //searchContainer is the container whos children is the rows that will be eliminated as the user types. (the DOM OBJECT)
    //search column , hideclassname text are all string values.  
        const rowsContainerChildren = searchContainer.querySelectorAll(searchColumn);
        console.log("input value changed to: ", text);
        console.log("children to check: ", rowsContainerChildren);
        rowsContainerChildren.forEach((childNode) => {
            //each node is a column in a .row-search div
            console.log("checking child node: ", childNode, "content: ", childNode.textContent);
            if (childNode.textContent.toLowerCase().includes(text.toLowerCase())) {
                childNode.parentNode.classList.remove(hideClassName);
            } else {
                childNode.parentNode.classList.add(hideClassName);
                console.log("row remove: ", childNode.textContent, "element: ", childNode.parentNode)
            }

        })

}

function createRow(data, appendTo) {
    //purpose: 
    //to input a json data representing a playlist. and output a dom element appending it to a dom. 
    //this can probably be  done a lot cleaner but this will do for now. 
    // it would make sense to have a generic create div function maybe. 
    const row = document.createElement("div");
    row.id = data.id;
    row.classList.add("row-search");
    row.classList.add("row-playlist");
    const index = document.createElement("div");
    index.classList.add("row-index");
    index.classList.add("row-index-playlist");
    const imgContainer = document.createElement("div");
    imgContainer.classList.add("img-container");
    imgContainer.classList.add("img-container-table");
    const img = document.createElement("img");
    img.src = data.coverSource;
    img.alt = "playlist photo";
    const playlistTitle = document.createElement("div");
    playlistTitle.classList.add("text-column");
    playlistTitle.classList.add("text-column-playlist");
    playlistTitle.id = "search-column";
    playlistTitle.innerHTML = data.playlistTitle;
    const trackCount = document.createElement("div");
    trackCount.classList.add("text-column");
    trackCount.classList.add("text-column-playlist");
    trackCount.innerHTML = `${data.trackCount} tracks`;
    row.appendChild(index);
    imgContainer.appendChild(img);
    row.appendChild(imgContainer);
    row.appendChild(playlistTitle);
    row.appendChild(trackCount);
    //we have to add the relavant event listener: 
    row.addEventListener("click", () => {
        console.log("row id value: ", row.id)
        selectPlaylistOption(row, "row-search-selected");
    });
    appendTo.appendChild(row);
}

function selectMultiChoiceOption(optionElement, selectedClassName) {
    //Idea:
    //attach a select option method to a instantiation of a question (or setup step)
    // design would page class.
    //containing 2 sub classes, setup, and question.
    // then a setup step would have sub classes again.
    // and questions would have subclasses again. 

    console.log("selected element", optionElement, "classlist before: ",optionElement.classList);
    if (optionElement.classList.contains(selectedClassName)) {
        optionElement.classList.remove(selectedClassName);
    } else {
         optionElement.classList.add(selectedClassName);
    }
    console.log("classList after: ", optionElement.classList)
}

for (let j = 0; j<multiChoiceOption.length; j++) {
    multiChoiceOption[j].addEventListener("click", () => {
        console.log("multi choice option selected")
        const stepName = multiChoiceOption[j].closest(".setup-step").id;//this may not really work when we reuse the multi choice options for questions. 
        //maybe we must create a class
        console.log("option index selected: ", j, "step id: ", stepName);
        let a = setupCompletion.get(stepName).selectedOptions;//arrays are objects so this should be fine.
        console.log("length of selected options before: ", a.length);
        for (ij=0; ij<a.length; ij++) {
            elementToRemove = a.pop();
            selectMultiChoiceOption(elementToRemove, "row-search-selected");
        }
        //now the previosuly selected options have been removed and the new one can be added. 
        a.push(multiChoiceOption[j]);
        selectMultiChoiceOption(multiChoiceOption[j],"row-search-selected");
        if (a.length > 0) {
            setupCompletion.get(stepName).completionStatus = true;
            console.log("assigned completion status as true.");
            setCompletionStatus(setupCompletion.get(stepName),true,"complete");
        }
    })
}

for (i=0; i< setupSteps.length; i++) {
    //this loop populates a map that contains all the ids of the set up steps. if you wish to add a new step be sure to use an id. with a relevant name .
    console.log("setup step id: ",setupSteps[i].id);
    
    setupCompletion.set(setupSteps[i].id, new setupStep(setupSteps[i].id, false, [], setupSteps[i], setupTabLinks[i]));//instantiates a setup class, with false completion status and an empty list of selected options.
    setCompletionStatus(setupCompletion.get(setupSteps[i].id), false,"complete");//pass through the instantiation of the class 


}

function setCompletionStatus(currSetupStep, value,completeKeyWord) {
    //currSetupStep is the actual setup step object. 
    //purpose, for the tab links we need to set wether they are complete or not
    console.log("set completion status for tab: ", currSetupStep.id, "value to set to: ", value, "keyword: ", completeKeyWord)
    currSetupStep.completionStatus = value;
    if (value) {
        currSetupStep.elementTab.classList.add(completeKeyWord);
    } else {
        console.log("executing remove of the completion tag.");
        console.log("element tab: ", currSetupStep.elementTab.ClassList)
        currSetupStep.elementTab.classList.remove(completeKeyWord);
    }
    let completionStatus = checkFullSetupCompletion(setupCompletion);
    if (completionStatus) {
        //the logic is set in the StartPlayingBtn click event listener logic. so the logic doesnt change but the startPlaying inner html
        //needs to be updated to reflect what will happen as technically the logic that will run has changed.
        console.log("the user has finished all completion steps. ");
        StartPlayingBtn.innerHTML = "Begin Game";
    } else {
        StartPlayingBtn.innerHTML = "Next Step";
    }
}

for (let i=0; i<rowSearchPlaylist.length; i++) {
    //the key word let must be used to define i. this is because each instantiation of the function  will remember the variables from the scope WHEN IT WAS CREATED.
    //if this is not done it will just remember the function scope. (the last value of i)
    //for every single row we must add a listen event. 
    console.log("adding event listener to: ", rowSearchPlaylist[i]);
    rowSearchPlaylist[i].addEventListener("click", () => {
        console.log("i value: ", i)
        selectPlaylistOption(rowSearchPlaylist[i], "row-search-selected");
        
    })
}


function checkFullSetupCompletion(setupCompletion) {
    //purpose: to define the logic for when the setupCompletion is complete. 
    const FullCompletionStatus = [...setupCompletion.values()].every((step) => step.completionStatus);
    console.log("checking full completion status to update button, status: ",FullCompletionStatus)
    // if (FullCompletionStatus) {
    //     //setup is complete. 
    //     StartPlayingBtn.classList.remove("not-clickable");
    // } else {
    //     StartPlayingBtn.classList.add("not-clickable");//add just in case. 
    // }
    
    return FullCompletionStatus

}

[...setupCompletion.values()].every((step) => {step.completionStatus; console.log("id: ", step.id, "status: ", step.completionStatus);})

function selectPlaylistOption(optionElement, selectedClassName) {
    //purpose: for an option in a table (like playlist), we must update the styles accordingly when an option is selected 
    //this assumes the option has been clicked and will resolve everything from there.
    console.log("selected element", optionElement);
    const stepID = optionElement.closest(".setup-step").id;
    const stepCompletionTemp = setupCompletion.get(stepID); 
    if (optionElement.classList.contains(selectedClassName)) {
        console.log("row to be made unselected");
        optionElement.classList.remove(selectedClassName);
        elementIndex = optionElement.querySelectorAll(".row-index");//should only be 1 index element. this is the index element that is a child of a row element.
        console.assert(elementIndex.length ==1);
        elementIndex[0].classList.remove("row-index-selected");
        const index = stepCompletionTemp.selectedOptions.indexOf(optionElement);//find the index .
        if (index !== -1) {//-1 is if nothing is returned.
            stepCompletionTemp.selectedOptions.splice(index,1);//1 is the delete count. 
        }
    } else {
        //the element is not active so we must make it active.
        console.log("row to be selected")
        optionElement.classList.add(selectedClassName);
        elementIndex = optionElement.querySelectorAll(".row-index");//should only be 1 index element
        elementIndex[0].classList.add("row-index-selected");
        stepCompletionTemp.selectedOptions.push(optionElement);// adds the selected row to the array of selected options 
    }
    let completionStatus = false;
    if (stepCompletionTemp.selectedOptions.length > 0) {
            completionStatus = true;
    }
    setCompletionStatus(setupCompletion.get(stepID),completionStatus,"complete");
}


console.log("initialization of setup completion: ", setupCompletion);

for (let i = 0; i < setupTabLinks.length; i++) {
    setupTabLinks[i].addEventListener("click", () => {//pass in the i index
        console.log("clicked step index", i);
        console.log("activeTabIndex prior", activeTabIndex, "id: ", setupSteps[i].id);
        editTabNum(activeTabIndex, i,"setup-step-active", setupSteps);
        editTabNum(activeTabIndex,i, "tablinks-btn-active",setupTabLinks);//peform the same operation to the  tablinks
        activeTabIndex = i;
        console.log("activeTabIndex after: ", activeTabIndex);
    })
}

function editTabNum(oldIndexVariable, newIndex, activeClassName, elementsArray) {
    //Purpose: edit the tab number, dynamic for different locations. 
    //pass a list of elements, the active class name, and the old and new index variables.
    //this function also completes the assignment. for the global scope variable
    console.log("old index variable before update: ",oldIndexVariable)
    elementsArray[newIndex].classList.add(activeClassName);
    elementsArray[oldIndexVariable].classList.remove(activeClassName);
    
}
function nextStep(elementsArray, groupStepCounter) {
    // passes in a button array for next step.
    // it can be reused to different collctions of next buttons. 
    // pass in the index number of the current value.
    console.log("updating via next step button.")
    let newCounter = (groupStepCounter+1) % (elementsArray.length);//increment by 1 and take the remainder.
    editTabNum(groupStepCounter,newCounter, "setup-step-active",elementsArray);
    editTabNum(groupStepCounter,newCounter, "tablinks-btn-active",setupTabLinks);//peform the same operation to the  tablinks
    return newCounter;
}
for (let i=0; i < nextButtonsSetup.length; i++) {
    //for each next button in the setup we must change the setup page presented in the html
    
    nextButtonsSetup[i].addEventListener("click",() => {
        newCounter = nextStep(setupSteps, activeTabIndex);
        activeTabIndex = newCounter;

        }
    )
}
function updateSetupSteps() {
    setupSteps[formStepsNum].classList.add("setup-step-active")
}


function updateMask (scrollableContainer) {
    //purpose: update the mask of a scrollable element.
    //pass directly the element that can be scrolled. 
    const isScrollable = scrollableContainer.scrollHeight > scrollableContainer.clientHeight;
    const isAtBottom = scrollableContainer.scrollTop + scrollableContainer.clientHeight >= scrollableContainer.scrollHeight - 1;
    //if there is more content then the height of where the client can see,
    // and the user is not at the bottom, then we must use a shadow to indicate scrolling .
    
    if (isScrollable && !isAtBottom) {
        scrollableContainer.classList.add('masked');//it only adds the class if it isnt already present.
        console.log("user is not at the bottom, mask is shown.")
    } else {
        scrollableContainer.classList.remove('masked');
        console.log("user is at the bottom so no mask needed")
    }

}

rowSearchContainer.addEventListener("scroll", () => {
    updateMask(rowSearchContainer);

})


let userProgressObject
window.addEventListener('load', () => {
    //on content load we need to set a scroll shadow detection. 
    if (sessionStorage.getItem("play_as_guest") == "true") {
        userProgressObject = new userProgress(tempQuestions.size, tempQuestions,0,0,tempProgressElement);
        setupContainer.style.display = "none";
        gameContainer.style.removeProperty("display");
        userProgressObject.beginGame();
        console.log("game begun fools.");
        return 
    }
    //logic to be done if play_as_guest is false. 
    updateMask(rowSearchContainer);
    const testPlaylist = getTestPlaylist();
    auth_code = getQueryVariable("code");
    
    if (auth_code) {
        console.log("code extracted successfully.");
        accessTokenOnLoad(auth_code);
    } else {
        console.log("code was not extracted successfully. using default test data.");
        for (data of testPlaylist) {
            console.log("row data: ", data);
            createRow(data, playlistRowSearchContainer);
        }
    }
});


async function startPlayingClick() {
    // function when the start playing button is clicked
    //WHAT IT DOES: if the start playing button is clicked we need to make the getgame request, create the game object and navigate the user to the game container.
    //assume the startt playing button is in the setup container.

    // first we should probably validate the steps are correct. this could be done on the back end though. 
    
    const setLoadingStateElement = StartPlayingBtn.closest(".setup-container");
    console.log("setup container to be passed: ", setLoadingStateElement)
    const loadingDivId = "loading-state";
    setLoadingState(setLoadingStateElement,loadingDivId);
    let game_details = getSetupSelectedOptions();
    let my_game
    try {
        my_game = await getGame(game_details, myTokens.access_token);
        console.log("response get game: ", my_game);
        let game_map =getGameResponseIntoObject(my_game);
        console.log("game_details: ", game_details);
        userProgressObject = new userProgress(my_game.question_count, game_map,0,0,tempProgressElement);
        console.log("waited 1 seconds!");
        setupContainer.style.display = "none";
        gameContainer.style.removeProperty("display");
        console.log("game begun fools.");
        userProgressObject.beginGame();
        //removeChildrenInLineDisplays(setLoadingStateElement);

        
    } catch (error) {
        let retryButtonId = "create-game-retry"; 
        console.log("There was an error loading the game");
        //removeChildrenInLineDisplays(setLoadingStateElement);
        let retryDiv = addRetryState(setLoadingStateElement,retryButtonId);
        let retryButton = retryDiv.querySelector("#"+retryButtonId);
        if (retryButton == null) {
            throw new Error("no valid retry button was created inside the retry div.");
        }
        retryButton.addEventListener("click", () => {
            console.log("the retry button has been clicked");
            setupContainer.style.removeProperty("display"); //(incase the error happens after the setup container has been set to none in the try block)
            gameContainer.style.display = "none";
            console.log("retry Button div: ", retryDiv);
            console.log("setLoadingStateElement", setLoadingStateElement);
            removeChildrenInLineDisplays(setLoadingStateElement);
            removeRetryState(setLoadingStateElement,retryDiv);

        })
        console.error(error);
        

    } finally {
        removeLoadingState(setLoadingStateElement,"#loading-state");
    }
}

StartPlayingBtn.addEventListener("click", async () => {

    // function when the start playing button is clicked

    //assume the startt playing button is in the setup container.
    // first we should probably validate the steps are correct. this could be done on the back end though. 
    let completionStatus = checkFullSetupCompletion(setupCompletion); 
    if (completionStatus) {
        startPlayingClick()
    } else {
        //go to the next tab
        newCounter = nextStep(setupSteps, activeTabIndex);
        activeTabIndex = newCounter;
    }
    
})

function removeRetryState(element,elementToRemove) {
    //element: the element we are removing the retry state from.
    //elementToRemove: the actual RetryState div. (what is returned from the addRetryStateCall in the first place)
    //result: the retry state has been removed from the element. 
    element.removeChild(elementToRemove);
}

function addRetryState(element, retryButtonId) {
    //purpose: to add a generic loading failed div to any element. note sizing may need to vary. 
    //element: The element we are appending the retry state to. 
    // retryButtonId: the custom id we are going to set to the actual icon so it can be accessed to create custom button logic.
    //output: return the full loading failed div so it can be edited easily for custom button logic
    if (element== null) {
        throw new Error("missing element: there is no element to set loading state to. please make sure the element is not null.");
    }
    let loadingFailedDiv = document.createElement("div");
    loadingFailedDiv.classList.add("loading-failed-div");
    let retryIcon = document.createElement("i");
    retryIcon.classList.add("fa-solid");
    retryIcon.classList.add("fa-rotate-right");
    retryIcon.classList.add("loading-failed-btn");
    retryIcon.classList.add("icon-btn");
    retryIcon.id = retryButtonId;
    loadingFailedDiv.appendChild(retryIcon);
    let textSpan = document.createElement("span");
    textSpan.style.margin = "5px";
    textSpan.innerHTML = "Unkown error. Please retry";
    loadingFailedDiv.appendChild(textSpan);
    element.appendChild(loadingFailedDiv);
    console.log("added loading retry to element: ", element);
    return loadingFailedDiv
    
}

function removeChildrenInLineDisplays(element) {
    //this removes the hard coded value for the display stle value. and it will revert back to what is in the css. 
    if (element == null) {
        throw new Error("missing element: there is no element to set loading state to. please make sure the element is not null.");
    }
    const childContent = element.children;
    console.log("child content to remove inline display displays. ", childContent);
    for (let i = 0; i<childContent.length; i++) {
        //set display as none
        
        childContent[i].style.removeProperty("display");
    }

}

function setLoadingState(element, loadingDivId) {
    //purpose:
    //for a particular element. set it to a loading state. all children elements will be set to display: none except 
    //element.style.removeProperty("display"); can be used to remove the inline value for display: none. all values will be set inline.
    if (element == null) {
        throw new Error("missing element: there is no element to set loading state to. please make sure the element is not null.")
    }
    const childContent = element.children;
    console.log("child content to be set as display none: ", childContent)
    for (let i = 0; i<childContent.length; i++) {
        //set display as none
        console.log(childContent[i].id);
        if (childContent[i].id != loadingDivId) {
            childContent[i].style.display = "none";
        }else {
            console.log("loading element: ", childContent[i]);
            childContent[i].style.display = "block";
            element.style.display = "flex";
            element.style.alignItems = "center";
            element.style.justifyContent = "center";
        }
    }

}

function removeLoadingState(element, loadingDivId) {
    console.log("element to remove loading state: ", element)
    if (element == null) {
        // no element is padded
        throw new Error("no element passed: ", element);
    }
    const loadingDiv = element.querySelector(loadingDivId);
    if (loadingDiv == null) {
        throw new Error("no loading element found in element passed: ", element);
    }
    console.log("loading div to be removed from user view: ", loadingDiv);
    loadingDiv.style.removeProperty("display");//will default to .css file where it is set as display: none;
    
}
let a;

async function getGame(json_game_details, access_token) {
    //purpose: to be called when the user has start a game. 
    // it will hit the back end api to create the game. 
    // a game object should be returned. 
    //playlist_ids: array of strings.
    //difficulty: String, 
    // num_questions: Int.
    //access_token: String. 
    const url = "/api/game";
    json_game_details.access_token = access_token;
    let body = JSON.stringify(json_game_details);
    console.log("request body: ", body);
    try {
        const response = await fetch(url, {
            method: "POST",
            body,
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!response.ok) {
            console.log("response is not ok");
            console.log("what is the response", response);
            a = response;
            throw new Error(`Response status: ${response.status}`);
        }
        const result = await response.json();
        console.log("game creation success result: ", result);
        return result
    } catch (error) {
        console.error(error.message);
    }

}

function getSetupSelectedOptions() {
    let my_json = {
        playlist_ids: setupCompletion.get("select-playlist-step").selectedOptions.map(x => x.id),
        difficulty: setupCompletion.get("select-difficulty-step").selectedOptions.map(x => x.id)[0],//get first eleent (probably should assert the length is 0 )
        num_questions: parseInt(setupCompletion.get("select-length-step").selectedOptions.map(x => x.id)[0]),
        num_players: parseInt(setupCompletion.get("select-player-count-step").selectedOptions.map(x => x.id)[0]),
    }
    return my_json
}

function getGameResponseIntoObject(game_response) {
    //purpose: input the raw json response from the getGame endpoint. 
    // parse into the json object map that can be used to create the userProgressObject. 
    let questions = new Map();
    let i = 0;
    let temp_question;
    console.log("game_response.question options: ", game_response.question_options);
    for (question of game_response.questions) {
        console.log("begining creation of question id: ", Object.keys(question)[0]);
        if (Object.keys(question)[0] == "GuessAlbumReleaseYear") {
            temp_question = new albumReleaseMultiChoice(question.GuessAlbumReleaseYear);
        } else if (Object.keys(question)[0]=="GuessAlbumTopTrendingSong") {
            temp_question = new albumReleaseMultiChoice(question.GuessAlbumTopTrendingSong);
        } else if (Object.keys(question)[0]=="GuessAlbumCover") {
            question.GuessAlbumCover.options = game_response.question_options;
            console.log("question: ", question.GuessAlbumCover);
            temp_question = new guessAlbumCover(question.GuessAlbumCover);
        }
        questions.set(i, temp_question);
        i++;
    }
    return questions

}