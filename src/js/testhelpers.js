function getTestPlaylist() {
    return [
  {
    "id": "Skitz Shit",
    "coverSource": "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da847a5356195a7c08a946997f55",
    "playlistTitle": "Skitz Shit",
    "trackCount": 501
  },
  {
    "id": "B Tier",
    "coverSource": "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da8498eeb8c6d896182a8a383769",
    "playlistTitle": "B Tier",
    "trackCount": 492
  },
  {
    "id": "bangerz",
    "coverSource": "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da84c71c7b7748d87012a7efb9dd",
    "playlistTitle": "bangerz",
    "trackCount": 172
  },
  {
    "id": "shit aint right",
    "coverSource": "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da8451eae8d8c4e3127f0ece314d",
    "playlistTitle": "shit aint right",
    "trackCount": 82
  },
  {
    "id": "trash",
    "coverSource": "https://mosaic.scdn.co/60/ab67616d00001e02072e9faef2ef7b6db63834a3ab67616d00001e022f44aec83b20e40f3baef73cab67616d00001e02600adbc750285ea1a8da249fab67616d00001e02e42b5fea4ac4c3d6328b622b",
    "playlistTitle": "trash",
    "trackCount": 91
  },
  {
    "id": "ya nan",
    "coverSource": "https://mosaic.scdn.co/60/ab67616d00001e0244f804700550dd335e9aec78ab67616d00001e027586047ed2cb60ea3188b5bdab67616d00001e02dfe4bfe695c4192e547e72c7ab67616d00001e02f30e1411889fd752e21cc515",
    "playlistTitle": "ya nan",
    "trackCount": 61
  },
  {
    "id": "The play.    list",
    "coverSource": "https://mosaic.scdn.co/60/ab67616d00001e026994bc99995860421956ea83ab67616d00001e02b1472111dcfb4c0eb5bf5bdeab67616d00001e02cb4d117414b45fffca56ccb4ab67616d00001e02d84b5673b7a8b8247d4bde4e",
    "playlistTitle": "The play.    list",
    "trackCount": 10
  },
  {
    "id": "Runnin' for a g",
    "coverSource": "https://mosaic.scdn.co/60/ab67616d00001e0205a19220d37bc871db939b64ab67616d00001e020b51f8d91f3a21e8426361aeab67616d00001e0285c160f9951c570a8e81f998ab67616d00001e02e87fc9dee06ae964efd36bea",
    "playlistTitle": "Runnin' for a g",
    "trackCount": 22
  },
  {
    "id": "B Tier",
    "coverSource": "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da8498eeb8c6d896182a8a383769",
    "playlistTitle": "B Tier",
    "trackCount": 492
  },
  {
    "id": "B Tier",
    "coverSource": "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da8498eeb8c6d896182a8a383769",
    "playlistTitle": "B Tier",
    "trackCount": 492
  }
]

}

function TestGame() {
    setLoadingState(setupContainer,"loading-state");
    userProgressObject.beginGame();
    console.log("game begun fools.");

}
const questionText = ["what year did the album The Positions by Gang of Youths get released?"]

const tempQSearchData = [{id: "Q0-A0", text:"Pink Floyd - Meddle"}, {id: "Q0-A1",text:"Jarrad Wright - The Big Lez Show Soundtrack"},
    {id: "Q0-A2",text: "Sticky Fingers - Land of Pleasure"},
    {id:"Q0-A3", text: "Mt.Joy - Mt.Joy"}, {id: "Q0-A4", text:"Lorde - Pure Heroine"}, {id: "Q0-A5", text:"Fidlar - Almost Free"}
];

const albumCoverQuestionData = {id: 0, questionNumber: 0, completionStatus: false, type:"albumCoverQuestion", answer: "Q0-A1",
    templateName: "guess-album-cover-template",options: tempQSearchData, questionText: "Can you guess the album cover?",
numGuessesAllow: 5, image: "https://i.scdn.co/image/ab67616d00001e02ab4da6c3f47506c90c5e56a3"};

const tempOptions = [["2017","2011","2014", "1999"]];
let questions = new Map();
function createQuestions() {
    //let questions = new Map()
    questions.set(0, new guessAlbumCover(albumCoverQuestionData));

    
    tempData = {"id": 1,"element": null,"questionNumber": 1,"completionStatus": false,"type": "multiChoice", "answer": 2, 
        "userAnswer": null,"questionText": questionText, "templateName": "multi-choice-template","options": tempOptions[0]};
    questions.set(1,new albumReleaseMultiChoice(tempData));
    questions.get(1).imageLocation = "https://i.scdn.co/image/ab67616d00004851b57074c36a92143915fecee3";
    questions.get(0).artistTopic = "Jarrad Wright";
    questions.get(1).artistTopic = "Gang of Youths";


    //set up data for the last question.
    //this question will be guess based on lyrics.
//why did i do this like this? 

    const tempQSearchDataQ4 = [{id: "Q4-A0", text:"Cant you here me knocking"}, {id: "Q4-A1",text:"Brown Sugar"},
    {id: "Q4-A2",text: "Wild horses"},
    {id:"Q4-A3", text: "Dead flowers"}, {id: "Q4-A4", text:"I got the blues"}, {id: "Q4-A5", text:"Bitch"}
    ];//this is not used at the moment. 

    const tempOptions4 = ["Can't you hear me knocking", "Brown Sugar", "Wild horses", "Dead flowers", "I got the blues", "bitch"];
    tempData = {"id": 2,"element": null,"questionNumber": 2,"completionStatus": false,"type": "multiChoice", "answer": 2, 
        "userAnswer": null,"questionText": "what song of the Rolling Stones - Sticky Fingers album is trending the most on spotify?", "templateName": "albumSelectOption","options": tempOptions4};
    questions.set(2, new albumReleaseMultiChoice(tempData));
    //this isnt really gonna work. maybe just do multiple choice for now, but still i think it would be nice to have the whole tracklist. 
    //essentially it just needs the image not the drawing over the top of it. 
    questions.get(2).imageLocation = "https://i.scdn.co/image/ab67616d00001e02a1d9c9969f2a7ed27e449a3c"
    console.log("test questions created.");
    questions.get(2).artistTopic = "Rolling Stones";
    return questions
    
}

