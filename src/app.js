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


let activeTabIndex = 0;
console.log(setupTabLinks.length);
console.log(setupTabLinks)
console.log("row search elements: ", rowSearchPlaylist)
const setupCompletion = new Map();

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
    checkFullSetupCompletion(setupCompletion);
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
    const FullCompletionStatus = [...setupCompletion.values()].every((step) => step.completionStatus);
    console.log("checking full completion status to update button, status: ",FullCompletionStatus)
    if (FullCompletionStatus) {
        //setup is complete. 
        StartPlayingBtn.classList.remove("not-clickable");
    } else {
        StartPlayingBtn.classList.add("not-clickable");//add just in case. 
    }

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



window.addEventListener('load', () => {
    //on content load we need to set a scroll shadow detection. 
    updateMask(rowSearchContainer);
    const testPlaylist = getTestPlaylist();
    for (data of testPlaylist) {
        console.log("row data: ", data);
    createRow(data, playlistRowSearchContainer);
}
});

StartPlayingBtn.addEventListener("click", () => {

    // function when the start playing button is clicked

    //assume the startt playing button is in the setup container.
    // first we should probably validate the steps are correct. this could be done on the back end though.  
    const setLoadingStateElement = StartPlayingBtn.closest(".setup-container");
    console.log("setup container to be passed: ", setLoadingStateElement)
    const loadingDivId = "loading-state";
    setLoadingState(setLoadingStateElement,loadingDivId);
    setTimeout(() => {
        console.log("waited 3 seconds!");
        removeLoadingState(setLoadingStateElement,"#loading-state");
        if (true) {
            //successful game creation.
            //display game
            setupContainer.style.display = "none";
            gameContainer.style.removeProperty("display");
            console.log("game begun fools.");

        userProgressObject.beginGame();
        } else {
            removeChildrenInLineDisplays(setLoadingStateElement);
        }
    }, 3000);


})


function removeChildrenInLineDisplays(element) {
    if (element == null) {
        throw new Error("missing element: there is no element to set loading state to. please make sure the element is not null.")
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
