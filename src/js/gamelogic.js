const root = document.documentElement;

const questionSubmitBtn = document.querySelector("#question-submit-btn");
const gameContainer = document.querySelector("#game-container");
const gameScore = document.querySelector("#game-score");
const questionInput = document.querySelector("#game-select-search-input");
const rowSearchDropdown = document.querySelectorAll(".row-search-dropdown");
const rowSearchContainerDropdown = document.querySelector(".rows-search-container-dropdown");
const tempProgressElement = document.querySelector(".game-progress-bar");
const reviewContainer = document.querySelector("#review-container");
const tempQuestions = createQuestions();
const playAgainButton = document.querySelector("#play-again-container");

questionSubmitBtn.addEventListener("click", () => {
    const qDisp  = userProgressObject.questionDisplayed;
    const currQuest = userProgressObject.questionObjectsMap.get(qDisp);
    if (!currQuest.completionStatus) {
        questionSubmitBtn.classList.add("not-clickable");
        console.log("checking user answer.")
        const newElement = document.createElement("div");
        newElement.className = "explosion";
        newElement.classList.add("explosion-long");
        gameContainer.appendChild(newElement);
        //playAudio();
        newElement.addEventListener("animationend", () => {
        newElement.remove();
        if (currQuest == null) {
            throw new Error("No valid question is currently displayed: ");
        }
        currQuest.checkAnswer();
        //questionSubmitBtn.innerHTML = "Next Q";
        questionSubmitBtn.classList.remove("not-clickable");
        })
    } else {
        console.log("user is going to the next question. ");
        userProgressObject.questionsCompleted++;
        console.log("question Count: ", userProgressObject.questionCount);
        console.log("completed questions: ", userProgressObject.questionsCompleted);
        if (userProgressObject.questionsCompleted >= userProgressObject.questionCount) {
            //we go to the review page, game complete./
            console.log("game is complete. user has completed al l the questions ");
            //const curr = userProgressObject.questionObjectsMap.get(userProgressObject.questionDisplayed);


            //console.log(curr);
            //curr.element.style.display = "none";
            userProgressObject.collectStats();
            userProgressObject.goReview();
        } else {
            userProgressObject.questionDisplayed++;
            userProgressObject.renderQuestion();
        questionSubmitBtn.innerHTML = "Check";
        }
    };
});

//let userProgressObject = new userProgress(questionCount, tempQuestions,0,0,tempProgressElement);// (used the default test questions will be used of the function fails .s )
// logic for the game progress component. 



async function moveNumbers(number) {
    //input: number
    //the updating of the score should be done in another function. 
    // a function that calculates a score. 
    // score calculator should be a method attached to each question. 
    // this returns a score that is then passed into moveNumbers which is a generic function.
    const stringNum = number.toString();
    const stringArray = stringNum.split("");
    const animationIndicator = 0;// to be used to determine which animation step it is up to. 
    let pointsElement = document.createElement("div");
    pointsElement.className = "points-pop-up"
    let numberElementsArray = []
    for (let i = 0; i<stringArray.length; i++) {
        //for each number we are going to add a div to the div. so each div can be moved to the correct location.

        const numberElement = document.createElement("span");
        numberElement.innerHTML = stringArray[i];
        numberElement.className = "flying-numbers";
        pointsElement.appendChild(numberElement);
        numberElementsArray.push(numberElement);

    }
    pointsElement.addEventListener("animationend", async () => {
        //the initial animation is over.
         
        //step 1:
        const fromLoc = pointsElement.getBoundingClientRect();
        console.log("first animation finished. second transition begining");
        console.log("points element BoundingClientRect width: ", fromLoc.width, "offsetWidth: ", pointsElement.offsetWidth);
        console.log("points element BoundingClientRect left: ", fromLoc.left, "top: ", fromLoc.top);
        const movingElementsCompleted = await movingElements(numberElementsArray, gameScore, number);
        console.log("promise fulfilled. function return value: ", movingElementsCompleted);
        pointsElement.remove();
            
        

    })
    gameContainer.appendChild(pointsElement);
    //movingElements(numberElementsArray, gameScore);
    const fromLoc = pointsElement.getBoundingClientRect();
    console.log("points element BoundingClientRect width: ", fromLoc.width, "offsetWidth: ", pointsElement.offsetWidth);
    console.log("points element BoundingClientRect left: ", fromLoc.left, "top: ", fromLoc.top);

}

async function movingElements(numberElementsArray, finalPositionElement) {
    //finalPositionElement: the point is for these numbers to end up in a final position. 
    //get positions of items to move. 
    console.log("number elements array: ", numberElementsArray)
    if  (finalPositionElement == null) {
        throw new Error("final position element must not be null. ")
    }
    let transitionPromises = [];
    const finalPosi = finalPositionElement.getBoundingClientRect();//this is the absolute position of the element in the viewport. 
    console.log("finalposition (left top): ", finalPosi.left, " ", finalPosi.top);
    let i = 0;
    for (const item of numberElementsArray) {
        const fromLoc = item.getBoundingClientRect();
        console.log("item cordinate (left top): ", fromLoc.left, " ", fromLoc.top);
        //determine the amount to move along x axis and y axis.
        const scaleWidth = fromLoc.width/item.offsetWidth;
        const scaleHeight = fromLoc.height/item.offsetHeight; 
        console.log("scale width: ", scaleWidth)
        let dx = (finalPosi.left - fromLoc.left)/(scaleWidth);
        let dy = (finalPosi.top - fromLoc.top)/(scaleHeight);

        //the issue is translate will work on the new scaled coordinate system, so it will move at a of the required 
        console.log(`translate(${dx}px, ${dy}px)`);
        console.log("element BoundingClientRect width: ", fromLoc.width, "offsetWidth: ", item.offsetWidth);
        item.style.transform = `translate(${dx}px, ${dy}px) rotate(180deg)`;//transform and rotate.
        let myPromise =  new Promise(function(resolve, reject) {
            //we are creating a promise that resolves when the transition ends. 
            //using let means myPromise is an individual object for each iteration of the loop. 
            item.addEventListener("transitionend", () => {
                console.log("transition ended.")
                item.style.background = "transparent"//remove item
                resolve();
            });
        });
        transitionPromises.push(myPromise);
        if (i == 0) {
            //for only the first promise, we want to know when it is completed to update the user score. 
             Promise.any(transitionPromises).then(() => {
            console.log("first promise fullfilled (the first transition is complete). score updating to: ", userProgressObject.userScore);
            gameScore.querySelector(".score-text").style.setProperty("--score", userProgressObject.userScore);
            });
        }
        i++;
        const delay = function(ms) {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    resolve();
                }, ms);
            });
        }

        const result = await delay(500);//delay

    }
    //loop is finished. we now return
    await Promise.all(transitionPromises);//takes an array and awaits for it to be completed. 
    console.log("all promises have been fullfilled (transitions are completed. ");
    return true;
    
}
function recipricolCalc(quotScale, funcFactor, xTrans, input, yTrans) {
    //general purpose fuction used to calculate recpricol function.
    const res = funcFactor/((quotScale*input)+xTrans);
    console.log("recip Return: ",  res);
    return res + yTrans
}

function playAudio() {
    var x = document.getElementById("myAudio");
    console.log("playing audio: ", x);
    x.play();
}

let tempQuestion = new guessAlbumCover(tempQSearchData);
// document.querySelectorAll(".row-search-dropdown").forEach((option) => {
    //dont really know what this does to be honest. or why i had it here. 
//     tempQuestion.optionElements.set(option.id, option);
// });


function createSmallSearch(data,questionObject) {

    //purpose: to be used for creating a list of options. the requirement is that data is in json format, with an id and a text.
    //this will not work for anything larger. 
    //the purpose of this is to have it seperate from the searchlist object itself so the searchlist class may work on different render methods. 
    let element = document.createElement("div");
    element.classList.add("row-search-dropdown");
    element.id = data.id;
    element.tabIndex = data.tabIndex;
    elementSpan = document.createElement("span");
    elementSpan.innerHTML = data.text;
    questionObject.optionElements.set(element.id, element);
    element.appendChild(elementSpan);
    //add the click event listener.
    element.addEventListener("click", () => {
        let previousAnswer = questionObject.userAnswer;
        console.log("click, previous answer : ", previousAnswer);
        //cloneOption should remember the scope used on instantiaiton (IE I CAN USE cloneOption)
        console.log("user clicked on ", element.id, " this.userAnswer set to: ",element.id);
        questionObject.selectOption(element, "row-search-selected");
        if (previousAnswer != null) {
            console.log("question object option at elements at event click. ",questionObject.optionElements);
            questionObject.selectOption(questionObject.optionElements.get(previousAnswer), "row-search-selected");
        }
        questionObject.userAnswer = element.id;
        populateAnswer(data.text,questionObject.element.querySelector(".answer-container"));
        //populate answer should probably be a method inside of the question. but anyway.

        questionObject.element.querySelector(".answer-container").classList.remove("wrong-answer-txt");//this is done so that if it is a new guess there is no coloring. 
        questionObject.element.querySelector(".answer-container").classList.remove("right-answer-txt");
    });
    return element;
}

searchContainer = document.querySelector("#search-bar-dropdown-container-1");



function populateAnswer(answer, elementToAppend) {
    //purpose: when an answer is clicked we must update the text where the answer is displayed. 
    //answer is text
    console.log("performing the updating the answer div.")
    console.log("answer: ", answer);
    elementToAppend.innerHTML = "";//empty the container.
    for (character of answer) {
        const tempElement = document.createElement("div");
        tempElement.classList.add("text-answer");
        tempElement.innerHTML = character;
        elementToAppend.appendChild(tempElement);
    }
    
}

class searchListRows {
    //purpose: an an instantiation of this can be used to search through a list of rows. it will be attached to an input and also have in memory all the text to search through. 
    constructor(data, optionsContainer, searchBar, entireContainer, displayMaxRows,bufferRows, createRow,questionObject) {
        if ((optionsContainer == null) | (searchBar==null) | (entireContainer==null)) {
            console.log("optionsContainer: ", optionsContainer, "searchBar: ", searchBar, "entireContainer: ", entireContainer)
            throw new Error("element is missing");
        }
        this.options = new Map(data.map(item => [item.id, item]));//this is a map of options, with the literal id if the option as the key. 
        this.searchText= new Map(data.map((item) => [item.id, item.text]));//makes a map that is searched. the key is the literal id of the text
        this.displayedOptions = new Map();
        this.ROWHEIGHT = 30;
        this.optionsContainer = optionsContainer;//this is required. the container in which the rows are rendered.
        console.log("this.options: ", [...this.options.keys()]);
        console.log("data: ", data);
        let keys = [...this.options.keys()];
        console.log("keys: ", keys.length);
        this.optionsContainer.style.height = (this.ROWHEIGHT*(keys.length)).toString()+"px";
        this.displayMaxRows = displayMaxRows; //the number of rows to be displayed at a maximum. 
        this.bufferRows = bufferRows;
        this.optionsFilteredID = [...data.values()].map((value) => value.id);//an array of the option ids that are search active.
        this.wantedIndex = [...this.options.keys()].slice(0,this.displayMaxRows+this.bufferRows);
        this.createRow = createRow;//is a function that must be passed to render the creation of a single row. (should return a dom element.)
        this.searchBar = searchBar//this is a DOM element. it will be where the user types that has the event listener on it.
        this.entireContainer= entireContainer;
        this.questionObject = questionObject;//the question object needs to be passed. as it is related. 
        this.optionsWrapper = this.optionsContainer.parentElement;//the wrapper of the options is the parent element. (THIS IS A BIT HACKY^. )
        this.setupUserInteraction();
        
    }   

    setupUserInteraction() {
        this.entireContainer.addEventListener("focusin", () => {
            //add event listener for focus in on the search container
            console.log("event fired fired. adding classlist show. ");
            this.optionsContainer.classList.add("show");
            this.optionsWrapper.classList.add("show");//is this necassary?
            updateMask(this.optionsContainer);
        });

        this.optionsWrapper.addEventListener("scroll", () => {
            //add listener as the user scrolls to update the mask. 
            updateMask(this.optionsContainer);
            this.onScroll();

        });
        this.entireContainer.addEventListener("focusout", (event) => {
            //the user has focused off this component, the dropdown should be removed. 
            const nextFocused = event.relatedTarget;//tells you were the focus is going.
            console.log("next focused.id: ", nextFocused);
            if (nextFocused==null) {
                //this.optionsContainer.classList.remove("show");
                this.optionsWrapper.classList.remove("show");
                console.log("next item is not focusable. must assume focus has been lost on the element. ");
                return
            }
            //note that in order for this to work, make sure any elements that should be focusable have tabindex set in the html dom.
            //otherwise javascript automatically thinks it is not focusable and will return the null. so any divs without tab index will be null. 

            if ((!this.entireContainer.querySelector(`#${nextFocused.id}`))) {
                console.log("event to be processed: ", this.entireContainer.querySelector(`#${nextFocused.id}`));
                this.optionsContainer.classList.remove("show");
                console.log("focus changed to element outside of the parent container.");
            } else {
                console.log("the focus has changed but it is maintained within the same element. ");
            }
        });
        this.searchBar.addEventListener("input",(event) => {
            //add event listener as the user types,
            const text = event.target.value.toLowerCase();
            console.log("text: ", text, "length: ", text.length);
            console.log("this.searchText: ", this.searchText);
            const indices = [];
            const containsText = [...this.searchText.values()].map((stringy) => stringy.toLowerCase().includes(text));//array containing true false values.
            console.log("contains text: ", containsText);
            let idx = containsText.indexOf(true);
            
            while (idx !== -1) {
                indices.push(idx);
                idx = containsText.indexOf(true, idx + 1);
            }
            console.log("indices containing text:", indices);
            const validValues = [...this.searchText.keys()].filter((_,i) => indices.includes(i));//returns an array of keys that have the text.
            //you could do this via a loop. it probs would actually be much nicer. idk why i did it this way, it is cool but not intuitive. 
            //essentially it is taking apart the maps, checking which ones have the text as a substring, then matching it up with the keys.
            console.log("valid values after  search key: ", validValues);
            this.optionsFilteredID =  validValues;//array
            this.wantedIndex = this.optionsFilteredID.slice(0,this.displayMaxRows+this.bufferRows);//get the correct rows.
            console.log("updating inner wrapper to have height: ", this.ROWHEIGHT*(this.optionsFilteredID.length));
            this.optionsContainer.style.height = (this.ROWHEIGHT*(this.optionsFilteredID.length)).toString()+"px";
            this.render();
        });
    }

    onScroll() {
        // as the user scrolls we need to re render everything basically. 
        const scrollTop = this.optionsWrapper.scrollTop;
        
        const startIndex = Math.floor(scrollTop/this.ROWHEIGHT);
        console.log("start index: ", startIndex, "scroll Top RES: ",  scrollTop, "ROWHEIGHT: ", this.ROWHEIGHT);
        if (!(startIndex == 0)) {
            console.log("the start index has changed, render mroe stuff.", startIndex);
            console.log("this.optionsFiltered: ", this.optionsFilteredID);
        }        
        this.wantedIndex = this.optionsFilteredID.slice(startIndex, this.displayMaxRows+this.bufferRows+startIndex);
        this.render();
        //console.log("this.wantedIndex: ", this.wantedIndex);

    }

    render() {
        //essentially we create a div that displays a subset of rows. we render these rows.
        // as the user scrolls down if they lewave a row it gets derendered with display none.
        // and new buffer rows are rendered for them to scroll through. as these rows 
        //console.log("wantedIndex: ", this.wantedIndex);
        for (const optionI of [...this.displayedOptions.keys()]) {//check current displayed options
            if (this.wantedIndex.indexOf(optionI)<0) {
                //the option is no longer wanted, we can just remove it from the dom.
                //console.log("currently displayed item is being removed: ",optionI)
                this.displayedOptions.get(optionI).style.display = "none";
                
            }
        }
        let i = 0;
        for (const optionID of this.wantedIndex) {
            //console.log("i: ", i, "this.ROWHEIGHT: ", this.ROWHEIGHT, )
            const GLOBALINDEX = this.optionsFilteredID.indexOf(optionID);//get its global index
            
            if (([...this.displayedOptions.keys()].indexOf(optionID)<0)) {
                //if the option does not already exist in the displayed options field.
                // we append it to the dom and set it to the displayed options.
                this.displayedOptions.set(optionID,this.createRow(this.options.get(optionID),this.questionObject));//push the dom object. should have all  event listeners and everything ready to append to dom. 
                this.displayedOptions.get(optionID).style.transform = `translateY(${GLOBALINDEX*this.ROWHEIGHT}px)`;
                //console.log("style.top for child: ", this.displayedOptions.get(optionID).style.top);
                this.optionsContainer.appendChild(this.displayedOptions.get(optionID));
                this.itemsRendered+=1;
            
            } else {
                const transformX = GLOBALINDEX*this.ROWHEIGHT - this.displayedOptions.get(optionID).offsetTop;
                //console.log("transform X: ", transformX);
                this.displayedOptions.get(optionID).style.display = "block";
                this.displayedOptions.get(optionID).style.transform= `translateY(${transformX}px)`;
            }
            i++;
        }
    }
}

function createImageQuestion(canvasElement, imgElement) {
    console.log("Img element: ", imgElement, "canvasElement: ", canvasElement);
    if (canvasElement == null | imgElement== null) {
        throw new Error("no canvas element passed or img element passed.");
    }
    console.log("drawing image");
    canvasElement.width = 200;
    canvasElement.height = 200;
    imgElement.width = 200;
    imgElement.height = 200;
    const ctx  = canvasElement.getContext("2d");
    console.log(imgElement.width, " ", imgElement.height);
    console.log("canvas element.width: ", canvasElement.width, "canvas Element height: ", canvasElement.height);
    ctx.drawImage(imgElement, 0, 0,imgElement.width,imgElement.height);
}
// const canvasElement = document.querySelector("#img-canvas");
// const imgElement = document.querySelector("#album-check-question-img");


function calcSineY(x,data) {
    // f = number of rotations
    //w = the width of the canvas. 
	// This is the meat (unles you are vegan)
  // Note that:
  // h is the amplitude of the wave
  // x is the current x value we get every time interval
  // 2 * PI is the length of one cycle (full circumference)
  // f/w is the frequency fraction
	//return data.h - data.h * Math.sin( x * 2 * Math.PI * (data.f/data.w) );
    return (data.h * Math.sin( x * 2 * Math.PI * (data.f/data.w) )) + data.k;
}

function calcInvSin(y,data) {
    //returns the y inverse of the calc sin function. IE when a y is given not an x value. 
    return (Math.asin((y-data.k)/data.h)*data.w)/(2*Math.PI*data.f);
}

function calcLine(val, data) {
    // k= the translation along the axis 
    return data.k;
}

function defineDrawPath(quadX, quadY) {
    //purpose: to define the input to put into get values trace input. it defines the order of VERTICES to draw from.
    //example: quadrant (1,1) as we are using 0, this is down 1 across 1. so it starts at [1,1] then goes to [2,1].
    //the final output should be. const coordsIndex = [[1,1],[2,1],[2,2],[1,2]];
    //it is just hard coded for now. this is a good function to write tests for. 
    //i tried to do logic based on moving switching between x and y coord and adding 1, then using modulo but it is way complicated.
    // as this logic only applies to quadrants I will make the code simple and easy. 
    return [
        [quadX, quadY],
        [quadX + 1, quadY],
        [quadX + 1, quadY + 1],
        [quadX, quadY + 1]
    ];
}


playAgainButton.addEventListener("click", () => {
    playAgain();
})

function playAgain() {
    console.log("user is going back to the set up screen."); 

    reviewContainer.style.display = "none";
    setupContainer.style.removeProperty("display");
    removeChildrenInLineDisplays(setupContainer);

    //STUFF TO DO

    //set --score property to be 0.

    gameScore.querySelector(".score-text").style.setProperty("--score", 0);

    //GET RID OF THE IMAGE ELEMENT ADDED

    let reviewPageImageWrapper = reviewContainer.querySelector("#review-page-image-wrapper");
    console.log(reviewPageImageWrapper);
    if (reviewPageImageWrapper == null) {
        console.log("The review page image wrapper is undefined");
    } else {
         if (reviewPageImageWrapper.parentNode) {
        reviewPageImageWrapper.parentNode.removeChild(reviewPageImageWrapper); 
        console.log("the reivew page image wrapper has been removed. ");
    }
    }
    //WHAT HAPPENS IF IT IS PLAY AS GUEST = TRUE
    if (sessionStorage.getItem("play_as_guest") =="true") {
        userProgressObject = new userProgress(tempQuestions.size, tempQuestions,0,0,tempProgressElement);
        setupContainer.style.display = "none";
        gameContainer.style.removeProperty("display");
        reviewContainer.style.display = "none";
        userProgressObject.beginGame();
        console.log("game begun fools.");

        //update the inner html.
        questionSubmitBtn.innerHTML = "check";
    } else {
        // THE TEXT FOR THE NEXT QUESTION/CHECK VALUE NEEDS TO BE PUT AS CHECK
    StartPlayingBtn.innerHTML= "Begin Game";
    //(the setup completion will always be true if they are begining again. )
    }
    questionSubmitBtn.innerHTML= "check";
    // WHAT IS GOING ON WITH THE NUMBERS DOING WIERD STUFF IF THE PROMISE IS NOT YET FULLFILLED (MAYBE CANCEL THE PROMISE? )

    let numbersRemoval = document.querySelectorAll(".flying-numbers");
    console.log("these are the flying numbers that need removal.");
    numbersRemoval.forEach((number) => {
        number.parentNode.removeChild(number);
        console.log("removing number: ", number);
    })

}