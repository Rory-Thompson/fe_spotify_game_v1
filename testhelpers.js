
function TestGame() {
    setLoadingState(setupContainer,"loading-state");
    userProgressObject.beginGame();
    console.log("game begun fools.");

}
const questionText = ["name someone who is really cool.", " name someone who is kinda wierd.","do you like peanuts?"]

const tempQSearchData = [{id: "Q0-A0", text:"Pink Floyd - Meddle"}, {id: "Q0-A1",text:"Jarrad Wright - The Big Lez Show Soundtrack"},
    {id: "Q0-A2",text: "Sticky Fingers - Land of Pleasure"},
    {id:"Q0-A3", text: "Mt.Joy - Mt.Joy"}, {id: "Q0-A4", text:"Lorde - Pure Heroine"}, {id: "Q0-A5", text:"Fidlar - Almost Free"}
];

const albumCoverQuestionData = {id: 0, questionNumber: 0, completionStatus: false, type:"albumCoverQuestion", answer: "Q0-A1",
    templateName: "guess-album-cover-template",options: tempQSearchData, questionText: "Can you guess the album cover?",
numGuessesAllow: 5};

const tempOptions = [["Rory", "rory", "Roary the racing car"],["Andrew","father", "papa", "Andy"], ["YES","HELL NO WHAT THE HELLY"]];
let questions = new Map();
function createQuestions() {
    let questions = new Map()
    questions.set(0, new guessAlbumCover(albumCoverQuestionData))

    for (let i=1; i<questionCount; i++) {
        tempData = {"id": i,"element": null,"questionNumber": i,"completionStatus": false,"type": "multiChoice", "answer": 0, 
            "userAnswer": null,"questionText": questionText[i-1], "templateName": "multi-choice-template","options": tempOptions[i-1]};
        questions.set(i,new multipleChoiceQuestion(tempData));
    }
    console.log("test questions created.")
    return questions
}