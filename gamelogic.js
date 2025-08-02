const questionCount = 4;
const root = document.documentElement;

const questionSubmitBtn = document.querySelector("#question-submit-btn");
const gameContainer = document.querySelector("#game-container");
const gameScore = document.querySelector("#game-score");
const questionInput = document.querySelector("#game-select-search-input");
const rowSearchDropdown = document.querySelectorAll(".row-search-dropdown");
const rowSearchContainerDropdown = document.querySelector(".rows-search-container-dropdown");


questionSubmitBtn.addEventListener("click", () => {
    const qDisp  = userProgressObject.questionDisplayed;
    const currQuest = userProgressObject.questionObjectsMap.get(qDisp);
    
    if (!currQuest.completionStatus) {
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
        })
    } else {
        console.log("user is going to the next question. ");
        userProgressObject.questionDisplayed++;
        userProgressObject.questionsCompleted++;
        userProgressObject.renderQuestion();
        questionSubmitBtn.innerHTML = "Check";
    };
});
class Question {

    //purpose. to be an abstract class that can be instantiated by child classes. 

    constructor(data) {
        if (this.constructor == Question) {
            throw new Error("This is an abstract class and should not be instantiated directly.")
        }
        //where data is a json object. 
        this.id = data.id;
        this.questionNumber= data.questionNumber;
        this.completionStatus=data.completionStatus;
        this.element = null; //this will be completed by a render method. will be inserted in the dom and should be able to access directly.
        this.type = data.type;
        this.userAnswer = data.userAnswer;// an index for a list of options. is dynamic type though. 
        this.answer = data.answer;// is matched to the user answer. 
        this.templateName = data.templateName;
        this.afterElement = document.querySelector("#question-submit-btn-container");//insert an question before this element.
        this.container = document.querySelector("#game-container");
        this.timeStart = null;
        this.timeEnd = null;
        //should we handle this as an error of the container and after element can not be found? 
        //or maybe just store it as the id? 
    }
    render(container) {
        //purpose: to insert the question into the container passed into the function.
        throw new Error("method 'render()' must be implemented.");
    }
    checkAnswer() {
        //purpose. When user submits an answer (different logic defines when that is)
        // the checkAnswer method will update the UI and the progress status for this question.
        //the checkAnswer is called when ever the user clicks "check". it is based off completion status. 
        throw new Error("method 'checkAnswer' must be implemented.");
    }
}
function selectOptionDummy () {
    console.log("option selected");
}
class guessAlbumCover extends Question {
    constructor(data) {
        super(data);
        this.questionText = data.questionText;
        this.options = data.options;
        this.optionElements = new Map();
        this.userNumGuesses = 0;
        this.numGuessesAllow = data.numGuessesAllow;
        this.selectOption = selectMultiChoiceOption;//purely for aesthetic purposes.
    };


    render() {
        questionSubmitBtn.innerHTML = `Guess (${this.userNumGuesses+1}/${this.numGuessesAllow})`;// just update this object it is a gobal variable. 
        console.log("creating guess album cover question.");
        const template = document.querySelector('template#guess-album-cover-template');
        if (template == null) {
            throw new Error("No template found.");
        };
        const clone = document.importNode(template.content, true);// this is a clone of the content. (technically a document-fragment)
        this.rowSearchContainerDropdown = clone.querySelector(".rows-search-container-dropdown");
        this.searchContainer = clone.querySelector("#search-bar-dropdown-container-1");
        this.questionInput = clone.querySelector("#game-select-search-input");
        if ((this.rowSearchContainerDropdown == null) | (this.searchContainer == null) | (this.questionInput == null)) {
            throw new Error("a required element could not be found.");
        };
        //define the searchlist container
        this.searchListManager = new searchListRows(this.options, this.rowSearchContainerDropdown,this.questionInput, this.searchContainer,1,2,createSmallSearch, this);//pass inthe question directly. 
        this.searchListManager.render();
        //this.canvasElement = clone.querySelector("#img-canvas");
        //this.imgElement = clone.querySelector("#album-check-question-img");
        //this.questRenderer = new imageRenderer(this.canvasElement,3, this.imgElement);//this is the manager of the question image that needs to be managed. 
        //this.questRenderer.refreshRender();
        this.element = clone.querySelector(".question-container");
        //this.element.style.display = "none";//TEMPORARY
        if (this.afterElement.previousElementSibling.tagName !== "TEMPLATE") {
            //might have to update this logic a bit
            console.log("tag name: ", this.afterElement.previousElementSibling.tagName);
            console.log("the previous element: ", this.afterElement.previousElementSibling.id, "is being replaced.")
            this.container.replaceChild(this.element, this.afterElement.previousElementSibling);
        } else {
            console.log("the element is being inserted. previous element: ", this.afterElement.previousElementSibling.tagName, " is kept. ");
            this.container.insertBefore(this.element,this.afterElement);//inserts in the initial reference (not a copy).
        };
        this.timeStart = Date.now();
        console.log("question added correctly, time start = ", this.timeStart);
        //dp we mee
        this.imgElement = this.element.querySelector("#album-check-question-img");
        this.canvasElement = this.element.querySelector("#img-canvas");
        this.questRenderer = new imageRenderer(this.canvasElement,3, this.imgElement);
        this.questRenderer.refreshRender(1);//render after appended to the dom maybe.
        //the first quadrant is now visible.
    };
    checkAnswer() {
        console.log("for guess album cover question we are checking the user answer.");
        this.userNumGuesses ++;
        console.log("used guesses: ", this.userNumGuesses, "numQuadrants = ", this.questRenderer.numQuadrants);
        console.log("user answered: ", this.userAnswer,"this.answer: ", this.answer);
        const answerElement = this.element.querySelector(".answer-container");
        let score = 0;
        if (this.userAnswer == this.answer) {
            this.timeEnd = Date.now();
            const timeTaken = (this.timeEnd-this.timeStart)/1000;
            console.log("user was correct");
            const amountChange = 1000/this.numGuessesAllow
            const quot = 1000-((amountChange)*(this.userNumGuesses-1));//(START AT 1000 when y intercept should be 1000. 
            score = Math.round(recipricolCalc(0.1,quot,1,timeTaken, 0));
            console.log("score given: ", score, "quot: ", quot);
            userProgressObject.userScore+=score;
            this.completionStatus = true;
            if (answerElement == null) {
                throw new Error("no answer element found to update. ");
            }
            answerElement.classList.add("right-answer-txt");
            
        } else {
            console.log("user was incorrect");
            if (answerElement == null) {
                throw new Error("no answer element found to update. ");
            }
            answerElement.classList.add("wrong-answer-txt");
            questionSubmitBtn.innerHTML = `Guess (${this.userNumGuesses+1}/${this.numGuessesAllow})`;

        }
        if (this.userNumGuesses == this.numGuessesAllow) {
            //the user completed their last guess.
            console.log("final guess complete.");
            this.completionStatus = true;
        } 
        
        if (!this.completionStatus) {
            // user was wrong and still has more guesses.
            this.questRenderer.refreshRender(1);
        } else {
            const optionIndex = this.options.map(i => i.id).indexOf(this.answer);
            console.log("optionIndex: ", optionIndex);
            if (optionIndex <0) {
                throw new Error("no valid answer found. ");
            }
            this.options[optionIndex].text;
            this.element.querySelector("#correct-answer-text").style.display="grid";
            this.element.querySelector("#correct-answer-text").innerHTML = this.options[optionIndex].text;
            this.element.style.pointerEvents = "none";
            questionSubmitBtn.innerHTML = "Next Q";
            moveNumbers(score);//run function to update the points score.
            this.questRenderer.refreshRender(this.questRenderer.numQuadrants-this.userNumGuesses);//its wierd, should this inherit? 
        }
    };
};

class multipleChoiceQuestion extends Question {
    constructor(data) {
        super(data);// call the super class constructor and pass in the name parameter.
        this.questionText = data.questionText;//text
        this.options = data.options;//array
        this.selectOption = selectMultiChoiceOption;//method to show an option as selected. (for user only)
        this.optionElements = new Map(); //map of the actual clone elements (use the i index of the options array passed in)
        
        
    };


    render() {
        const template = document.querySelector('template#multi-choice-template');
        const clone = document.importNode(template.content, true);// this is a clone of the content. 
        //customize content.
        clone.querySelector("h3.h3-dashboard").textContent = this.questionText;
        const templateOption = clone.querySelector("template#multi-choice-option-template");
        // this is a clone of the content. 
        console.log("question options: ", this.options);
        console.log("clone: ", clone);
        for (let i = 0; i<this.options.length; i++) {
            const cloneOption = document.importNode(templateOption.content, true);
            console.log("clone option: ", cloneOption.children);
            cloneOption.querySelector(".game-option-text").textContent = this.options[i];
            cloneOption.id = `$option-${i}-question-${this.id}`;

            //now add event listener for when user clicks this option
            console.log("adding event listener for element: ",this.options[i], " ", cloneOption.id, " ", cloneOption);
            const listenerElement = cloneOption.querySelector(".multi-choice-option"); 
            console.log("element to add listener to: ", listenerElement);
            if (listenerElement == null) {
                throw new Error("no listener attached");
            }
            listenerElement.addEventListener("click", () => {
                //we can just use the i value from when this was created.
                let previousAnswer = this.userAnswer;
                console.log("click, previous answer : ", previousAnswer);
                //cloneOption should remember the scope used on instantiaiton (IE I CAN USE cloneOption)
                console.log("user clicked on ", listenerElement.id, " this.userAnswer set to: ", i);
                this.selectOption(listenerElement, "row-search-selected");
                if (previousAnswer != null) {
                    this.selectOption(this.optionElements.get(previousAnswer), "row-search-selected");
                }
                this.userAnswer = i;
            })
            
            this.optionElements.set(i, listenerElement);
            
            clone.querySelector(".multi-choice-options-container-quiz").appendChild(cloneOption);
            //note that cloneOption is a document fragment. when using appendChild it automatically takes out the children
            // and apppends them. but the object itself is still a document fragment which will have different properties to a DOM element. 
        }
        this.element = clone.querySelector(".question-container");
        //this.element.style.display = "none";//TEMPORARY FOR TESTING.
        if (this.afterElement.previousElementSibling.tagName !== "TEMPLATE") {
            //might have to update this logic a bit
            console.log("tag name: ", this.afterElement.previousElementSibling.tagName);
            console.log("the previous element: ", this.afterElement.previousElementSibling.id, "is being replaced.")
            this.container.replaceChild(this.element, this.afterElement.previousElementSibling);
        } else {
            console.log("the element is being inserted. previous element: ", this.afterElement.previousElementSibling.tagName, " is kept. ");
            this.container.insertBefore(this.element,this.afterElement);//inserts in the initial reference (not a copy).
        }
        this.timeStart = Date.now();
        console.log("question added correctly, time start = ", this.timeStart);


    }
    checkAnswer() {
        //method must be instantiated. Check the current user answer and update the displays. 
        //at the moment we always add the answer

        this.timeEnd = Date.now();
        console.log("checking answer. answer selected: ", this.userAnswer, "actual answer. ", this.answer);
        this.optionElements.get(this.answer).classList.add("right-answer-btn");
        let pointsFor = 0;
        if (this.userAnswer != this.answer) {
            console.log("user was incorrect. ");
            this.optionElements.get(this.userAnswer).classList.add("wrong-answer-btn");
        } else {
            console.log("user was correct. ");
            const timeTaken = (this.timeEnd-this.timeStart)/1000;
            console.log("time taken: ", timeTaken);
            pointsFor += Math.round(recipricolCalc(0.1,1000,1,timeTaken, 0));
        }
        this.optionElements.get(this.userAnswer).classList.remove("row-search-selected");

        console.log("user points recieved: ", pointsFor, )
        //calculate the user score 
        userProgressObject.userScore+=pointsFor;
        console.log("user points recieved: ", pointsFor, "score to update: ", userProgressObject.pointsFor);
        moveNumbers(pointsFor);//run function to update the points score.
        this.completionStatus = true;
        this.element.style.pointerEvents = "none";
        questionSubmitBtn.innerHTML = "Next Q";
    }

}
const tempQuestions = createQuestions();
const tempProgressElement = document.querySelector(".game-progress-bar");


class userProgress {
    constructor(questionCount,questionObjectsMap, questionsCompleted, questionDisplayed, progressElement) {
        this.questionCount = questionCount;
        this.questionObjectsMap = questionObjectsMap;
        this.questionsCompleted = questionsCompleted;
        this.questionDisplayed = questionDisplayed;//number (i) index
        this.progressElement = progressElement;
        this.gameContainer = gameContainer;
        this.userScore = 0;//instantiate as 0. 

    }
    updateQuestionProgressDisplay() {
        const updateToValue =`${this.questionDisplayed+1}/${this.questionCount}`; 
        console.log("updating displayed question number: ", updateToValue);
        const updateElement = this.progressElement.querySelector(".questionNumText");//find the text to update in the progresselement
        console.log(" update element: ", updateElement," this.progressElement: ", this.progressElement);
        if (updateElement == null) {
            throw new Error("no text found to update");
        }
        updateElement.innerHTML = updateToValue;
        console.log("update text successful.");

    }
    updateGraphic() {
        //purpose: to updat the spinning circle. the logic was seperated as it is much different to updating the text.
         const elementToUpdate = this.progressElement.querySelector(".progress-not-complete");
        if (elementToUpdate == null) {
            throw new Error("no inner progress element found. nothing to update. ");
        }
        let arcLength = elementToUpdate.getTotalLength();
        let completedLength = arcLength*((this.questionDisplayed+1)/this.questionCount);
        elementToUpdate.style.strokeDasharray = `${arcLength-completedLength} ${completedLength}`;
        console.log("value to update strokeDasharray to: ", `${arcLength-completedLength} ${completedLength}`);



        let offset = (arcLength+((arcLength/4)-completedLength))%arcLength;
        console.log("stroke dashoffset set to: ", offset, "questions completed: ", this.questionDisplayed, " ", userProgress.questionCount);
        elementToUpdate.style.strokeDashoffset = `${offset}`
        //the arc is now updated using stroke dash array. 

    }

    beginGame() {
        //purpose: to be called once the user has finished the set up and the game has been loaded. 
        removeLoadingState(setupContainer,"#loading-state");
        this.gameContainer.style.removeProperty("display");
        setupContainer.style.display = "none";
        this.questionObjectsMap.get(this.questionDisplayed).render();//render first question.
        this.updateQuestionProgressDisplay();

    }
    renderQuestion() {
        this.questionObjectsMap.get(this.questionDisplayed).render();
        this.updateQuestionProgressDisplay();
        this.updateGraphic();
    }
    
}
const userProgressObject = new userProgress(questionCount, tempQuestions,0,0,tempProgressElement);
//logic for the game progress component. 



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

        this.optionsContainer.addEventListener("scroll", () => {
            //add listener as the user scrolls to update the mask. 
            updateMask(this.optionsContainer);
            this.onScroll();

        });
        this.entireContainer.addEventListener("focusout", (event) => {
            //the user has focused off this component, the dropdown should be removed. 
            const nextFocused = event.relatedTarget;//tells you were the focus is going.
            console.log("next focused.id: ", nextFocused);
            if (nextFocused==null) {
                this.optionsContainer.classList.remove("show");
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
            this.optionsFilteredID =  validValues;
            this.wantedIndex = this.optionsFilteredID.slice(0,this.displayMaxRows+this.bufferRows);//get the correct rows.
            this.render();
        });
    }

    onScroll() {
        // as the user scrolls we need to re render everything basically. 
        const scrollTop = this.optionsContainer.scrollTop;
        const startIndex = Math.floor(scrollTop/this.ROWHEIGHT);
        // console.log("start index: ", startIndex, "scroll Top RES: ",  scrollTop, "ROWHEIGHT: ", this.ROWHEIGHT);
        // if (!(startIndex == 0)) {
        //     console.log("the start index has changed, render mroe stuff.", startIndex);
        //     console.log("this.optionsFiltered: ", this.optionsFilteredID);
        // }        
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

class imageRenderer {

    //purpose: it is a class that will be used to render the image used in the image question stuff. 
    
    constructor(canvasElement, numLines,imgElement) {
        this.canvasElement = canvasElement;
        this.numLinesX = numLines;//for now only numLines X and Y must be the same for the logic to work. 
        this.numLinesY = numLines;
        this.horizontalFunction = new Map();
        this.verticleRelation = new Map();//these are used to store the functions along each intercept.
        this.imgElement = imgElement;
        this.height = 200;
        this.width = 200;
        this.canvasElement.width = this.width;
        this.canvasElement.height = this.height;
        this.imgElement.width = this.width;
        this.imgElement.height = this.height;
        this.matrixVertice = Array.from({ length: this.numLinesX+2}, () => Array(this.numLinesY+2).fill(0));//instantiate a matrix.
        this.matrixQuadrant = Array.from({ length: this.numLinesX+1}, () => Array(this.numLinesY+1).fill(false));//instantiate a matrix. each value is a true false for a quadrant. 
        //fill the corners
        this.numQuadrants = (this.numLinesX+1)*(this.numLinesY+1);
        this.matrixVertice[0][0] = [0,0];
        this.matrixVertice[this.numLinesX+1][0] = [0,this.height];
        this.matrixVertice[this.numLinesX+1][this.numLinesY+1] = [this.height,this.width];
        this.matrixVertice[0][this.numLinesY+1] = [this.height,0];
        this.defineDrawPath = defineDrawPath;
        this.instantiateRequiredVariables();

    }

    refreshRender(n) {
        this.defineRandomQuadrants(n);//add n quadrants.
        this.createImage();//create the image
        //we have to put the fill quadrants to be complete after the image is loaded. for now I have just added it to the create image logic.
    }

    createImage() {
        console.log("Img element: ", this.imgElement, "canvasElement: ", this.canvasElement);
        if (this.canvasElement == null | this.imgElement== null) {
            throw new Error("no canvas element passed or img element passed.");
        }
        console.log("is complete:", this.imgElement.complete);
        const ctx  = this.canvasElement.getContext("2d");
        if (!this.imgElement.complete || this.imgElement.naturalWidth === 0) {
            //must await for the image to be fully loaded.

            this.imgElement.onload = () => {
                console.log("image loaded: ", "drawing image.");
                ctx.drawImage(this.imgElement, 0, 0,this.imgElement.width,this.imgElement.height);
                this.fillQuadrants();
            };
        } else {
            console.log("drawing image");
            ctx.drawImage(this.imgElement, 0, 0,this.imgElement.width,this.imgElement.height);
            this.fillQuadrants();
        }
        console.log(this.imgElement.width, " ", this.imgElement.height);
        console.log("canvas element.width: ", this.canvasElement.width, "canvas Element height: ", this.canvasElement.height);
        
    }

    instantiateRequiredVariables() {
        this.horizontalFunction.set(0,{k :0,func: calcLine});//set the horizontal line along the 0 axis

        for (let i = 0; i < this.numLinesX; i++) {
            //along x axis (function)
            const hVal = (this.canvasElement.height/this.numLinesX)/6;
            const fVal = 4;
            const wVal = this.canvasElement.width;
            const kVal = (this.canvasElement.height/(this.numLinesX+1))*i+ this.canvasElement.height/(this.numLinesX+1);
            const valsDict = {h:hVal, f: fVal, w:wVal, k: kVal,func: calcSineY};
            this.horizontalFunction.set(i+1,valsDict)//set the function. 
            console.log("vals dict for the horizontal lines. ", valsDict, "i: ", i);
            this.populateVerticesY(this.canvasElement.width, valsDict,i+1);
            //technically I dont think we need tto call draw line, we just need to functions set. 
        }
        this.horizontalFunction.set(this.numLinesX+1,{k :this.canvasElement.height, func: calcLine});//set the horizontal line along the bottom of the image 
        this.verticleRelation.set(0,{k :0, func: calcLine});//set the verticle line along the 0 axis
        for (let i = 0; i<this.numLinesY; i++) {
            //along y axis (relation)
            const hVal = (this.canvasElement.width/this.numLinesY)/8;
            const fVal = 3;
            const wVal = this.canvasElement.height;
            const kVal = (this.canvasElement.width/(this.numLinesY+1))*i+ this.canvasElement.width/(this.numLinesY+1);
            const valsDict = {h:hVal, f: fVal, w:wVal, k: kVal,func: calcSineY};
            this.verticleRelation.set(i+1,valsDict)//set the function. the line number is +1 because the first line is the straght line on the border of the image. 
            //console.log("vals dict for the verticle lines. ", valsDict, "i: ", i);
            //console.log("this.canvas element:", this.canvasElement,"matrix vertice: ", this.matrixVertice)
            this.populateVerticesX(this.canvasElement.width, valsDict,i+1);//we use a numerical method to guess where the vertex points are. this is then populated in the matrixvertice
        }
        this.verticleRelation.set(this.numLinesY+1,{k :this.canvasElement.width, func: calcLine});//set the verticle line along the right of the image 
        //we need to sort the matrix Vertice. It is now in x, y order. 
        this.matrixVertice.forEach(inner => {
        inner.sort((a, b) => a[0] - b[0]);
        });


    }
    populateVerticesY(x, data,lineNum) {
        //x is the data.
        //func is the function that inputs x value and a json of inputs.
        //console.log("data: ", data);
        this.matrixVertice[lineNum][0] = [0,data.func(0, data)];
        for(var i=0;i<=x;i++){ // Loop from left side to current x
            var y = data.func(i, data); // Calculate y value from x     
        }
        this.matrixVertice[lineNum][this.numLinesY+1] = [x,data.func(x, data)];
    }

    populateVerticesX(x, data, lineNum) {
        //drawing relational lines (verticle).
        //x is the data.
        //func is the function that inputs x (techincally y value because it is relation) value and a json of inputs.
        //lineNum is the number of the line. IE the first line or the second line.
        let valueChange = false;
        //console.log("data: ", data);
        this.matrixVertice[0][lineNum] = [data.func(0, this.horizontalFunction.get(lineNum)),0];
        for(var i=0;i<=x;i++){ // Loop from left side to current x
            var xvar = data.func(i, data); // Calculate y value from x
            //console.log("x: ", xvar, "y: ", i);
            if (!valueChange && i>=xvar) {
                //console.log("first flip. the y is greater than the x. ", "i: ", i, "xvar: ", xvar);
                valueChange = true;
                const temp = data.func(i, this.horizontalFunction.get(lineNum))//clac the sin value of opposite function. 
                //console.log("temp: ", temp);
                const period = this.horizontalFunction.get(lineNum).w/this.horizontalFunction.get(lineNum).f;
                let xcoord = i;
                let doAddition = false;
                let j=0;
                for (j=0;j<this.numLinesY-1; j++) {
                    //
                    let xcoordtemp = xcoord - period;
                    //console.log("J: ", j);
                    if (doAddition) {
                        xcoordtemp = xcoord+period;
                    }
                    if (((xcoordtemp)<= 0)) {
                        //add it
                        xcoordtemp = i+period;
                        doAddition = true;
                    };
                    xcoord = xcoordtemp;
                    //console.log("found new coord: ", `${[xcoord,i]}`)
                    this.matrixVertice[lineNum][j+1] = [xcoord,i];//should hopefully update inplace. 
                }
                //a[y][x] a[verticle coord][horizontalcoord]
                this.matrixVertice[lineNum][j+1] = [i,temp];

            }
        }
        //console.log("x value: ", x, "y value: ", data.func(x, this.horizontalFunction.get(lineNum)));
        this.matrixVertice[this.numLinesX+1][lineNum] = [data.func(x, this.horizontalFunction.get(lineNum)),x];
    }

    tracePath(coordsIndex) {
        //purpose:
        //to trace a path along a context. 
        //data funcs is the map of functions
        //matrixVertice is the matrix of coordinates. 
        //coords index is defined IN ORDER OF TRACING to tell the thing where to trace. 
        //this.horizontalFunction is the horizontal functions.
        //this is the verictle relations
        //first plot the top:
        const ctx = this.canvasElement.getContext("2d");
        ctx.strokeStyle = "white";
        ctx.fillStyle = "black";
        ctx.beginPath();
        const startDrawingAt = this.matrixVertice[coordsIndex[0][1]][coordsIndex[0][0]]; 
        //console.log("starting drawing at: ", startDrawingAt);
        ctx.moveTo(startDrawingAt[0],startDrawingAt[1]);
        for (let i =0; i<coordsIndex.length-1;i++) {
            //console.log("drawing line from: ", coordsIndex[i], "to: ", coordsIndex[i+1]);
            const indicesStart = coordsIndex[i];
            const indicesEnd = coordsIndex[i+1];
            const { arrayInputs, inputFunc, isRelation } = this.GetValuesTraceInput(indicesStart,indicesEnd);
            const arrayOutputs = [];

            //console.log("is relation: ", isRelation, "array inputs: ", arrayInputs);
            for (let input of arrayInputs) {
                //draw each line 
                const y = inputFunc.func(input, inputFunc);
                if (isRelation) {
                    //it is technically the x value not the y value. 
                    //console.log("drawing line to: ", y, ", ", input);
                    ctx.lineTo(y,input);
                } else {
                    //console.log("drawing line to: ", input, ", ", y);
                    ctx.lineTo(input,y);
                }
                arrayOutputs.push(y);
            }
            //console.log("array: outputs: ", arrayOutputs);
            //const finalCoords = coords[indicesEnd[1]][indicesEnd[0]]
            //console.log("final line to coordinates: ", finalCoords)
            //ctx.lineTo(finalCoords[0], finalCoords[1]);//draw the final line
        }
        //do the final iteration from the first to the last element.
        
        const indicesStart = coordsIndex[coordsIndex.length-1];
        const indicesEnd = coordsIndex[0];
        //console.log("drawing line from: ", indicesStart, "to: ", indicesEnd);
        const { arrayInputs, inputFunc, isRelation } = this.GetValuesTraceInput(indicesStart,indicesEnd);
        for (let input of arrayInputs) {
            //draw each line 

            const y = inputFunc.func(input, inputFunc);
            if (isRelation) {
                //it is technically the x value not the y value. 
                ctx.lineTo(y,input);
            } else {
                ctx.lineTo(input,y);
            }
        }
        ctx.closePath();
        //we have closed the path and can now fill the drawing in. 

    }

    defineRandomQuadrants(numQuadsVisible) {
        let count = 0;
        //should probably have a check to see if there are too manyquadrants visible.
        while (count < numQuadsVisible) {
            const quadX = Math.floor(Math.random() * (this.numLinesX+1));//this is a uniform distribution. 
            const quadY = Math.floor(Math.random() * (this.numLinesY+1));

            if (!this.matrixQuadrant[quadY][quadX]) {
                this.matrixQuadrant[quadY][quadX] = true;
                count++;
            }
        // else: already true, so skip and retry
        }

        return this.matrixQuadrant
    }

    GetValuesTraceInput(indicesStart, indicesEnd) {
        //the start index is the index in the matrix of vertices the line will start from. 
        //the end Index are the indices of the matrix where the line will end.
        //this.matrixVertice is the matrix that contains the quadrants of vertices.
        const coordsStartX = indicesStart[0];
        const coordsStartY = indicesStart[1];
        const start = this.matrixVertice[coordsStartY][coordsStartX];
        
        const coordsEndX = indicesEnd[0];
        const coordsEndY = indicesEnd[1];
        const end = this.matrixVertice[coordsEndY][coordsEndX];
        //console.log("coordinates to start at: ", start, "coordinates to end at: ", end);
        let inputFunc = this.verticleRelation.get(coordsStartX);
        let startInput = start[1];
        let endInput = end[1];
        let isRelation = true;
        if (coordsStartY == coordsEndY) {
            //it is a horizontal trace. (if the y index doesnt change it is horizontal trace.)
            inputFunc = this.horizontalFunction.get(coordsStartY);
            startInput = start[0];
            isRelation = false;
            endInput = end[0];
            //console.log("this.horizontalFunction: ", this.horizontalFunction);
            //console.log("this is a horizontal trace, startInput: ", startInput,"endInput: ", endInput, "coordsStartY: ", coordsStartY);

        }
        //console.log("startInput: ", startInput,"endInput: ", endInput);
        //this rounding may need more logic. essentially we want to number to be 
        let arrayInputs = Array.from(Array(Math.abs(Math.round(startInput-endInput))+1), (x,j) => startInput < endInput ? startInput + j : startInput - j);
        //console.log("array of inputs; ", arrayInputs);
        //console.log("input func: ", inputFunc);
        return { arrayInputs, inputFunc, isRelation };

    }
    fillQuadrants() {
    
        for (const [rowIndex, row] of this.matrixQuadrant.entries()) {
            console.log("looking at the row: ", row);
            for (const [colIndex, val] of row.entries()) {
                //console.log("val: ", val);
                if (!val) {
                    // if val is false it is NOT visible so we must plot it.
                    const coordsIndex = this.defineDrawPath(colIndex, rowIndex);
                    console.log("this is not visible so will be plotted. coords index: ", coordsIndex);
                    this.tracePath(coordsIndex);
                    this.canvasElement.getContext("2d").fill();
                }
            }
        }
    }

}
//TestGame();//place at the end of the gameLogic. 
