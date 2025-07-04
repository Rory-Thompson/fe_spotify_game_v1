const nextButtonsSetup = document.querySelectorAll(".next-button-setup");//finds all the elements that have the class .nextbutton
const setupTabLinks = document.querySelectorAll(".tablinks-btn");
const setupSteps = document.querySelectorAll(".setup-step");
const rowSearch = document.querySelectorAll(".row-search")
const playlistSelectIndex = document.querySelectorAll(".row-index-playlist")
const multiChoiceOption = document.querySelectorAll(".multi-choice-option")


let activeTabIndex = 0;
console.log(setupTabLinks.length);
console.log(setupTabLinks)
console.log("row search elements: ", rowSearch)
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
    if (value) {
        currSetupStep.elementTab.classList.add(completeKeyWord);
    } else {
        console.log("executing remove of the completion tag.");
        console.log("element tab: ", currSetupStep.elementTab.ClassList)
        currSetupStep.elementTab.classList.remove(completeKeyWord);
    }
}

for (let i=0; i<rowSearch.length; i++) {
    //the key word let must be used to define i. this is because each instantiation of the function  will remember the variables from the scope WHEN IT WAS CREATED.
    //if this is not done it will just remember the function scope. (the last value of i)
    //for every single row we must add a listen event. 
    rowSearch[i].addEventListener("click", () => {
        console.log("i value: ", i)
        selectPlaylistOption(rowSearch[i], "row-search-selected");
        
    })
}


function selectPlaylistOption(optionElement, selectedClassName) {
    //purpose: for an option in a table (like playlist), we must update the styles accordingly when an option is selected 
    //this assumes the option has been clicked and will resolve everything from there.
    console.log("selected element", optionElement);
    const stepID = optionElement.closest(".setup-step").id;
    const stepCompletionTemp = setupCompletion.get(stepID); 
    if (optionElement.classList.contains(selectedClassName)) {
        console.log("row to be made unselected")
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