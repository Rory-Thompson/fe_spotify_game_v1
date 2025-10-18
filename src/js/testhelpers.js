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
//sessionStorage.setItem("play_as_guest", "true");
function TestGame() {
    sessionStorage.setItem("play_as_guest", "true");
    console.log("running test game/");
}
const questionText = ["what year did the album The Positions by Gang of Youths get released?"]

const tempQSearchData = [{id: "Q0-A0", text:"Pink Floyd - Meddle"}, {id: "Q0-A1",text:"Jarrad Wright - The Big Lez Show Soundtrack"},
    {id: "Q0-A2",text: "Sticky Fingers - Land of Pleasure"},
    {id:"Q0-A3", text: "Mt.Joy - Mt.Joy"}, {id: "Q0-A4", text:"Lorde - Pure Heroine"}, {id: "Q0-A5", text:"Fidlar - Almost Free"},{id: "Q0-A6", text:"The Beatles - Abbey Road"},
    {id:"Q0-A7", text: "LMFAO - Sorry For Party Rocking"},{id:"Q0-A8", text: "50 Cent - Get Rich Or Die Tryin'"},
    {id:"Q0-A9", text: "Chumbawamba - Tubthumper"},{id:"Q0-A10", text: "The Monkees - More of The Monkees"}
];

const albumCoverQuestionData = {id: 0, questionNumber: 0, completionStatus: false, type:"albumCoverQuestion", answer: "Q0-A7",
    templateName: "guess-album-cover-template",options: tempQSearchData, questionText: "Can you guess the album cover?",
numGuessesAllow: 5, image: "https://i.scdn.co/image/ab67616d00001e021db908d5f66645cb158837ca"};
//"https://i.scdn.co/image/ab67616d00001e02ab4da6c3f47506c90c5e56a3" jarrad wright album cover.
const tempOptions = [["Anakin's Theme","He Is the Chosen One","Duel of the Fates", "Qui-Gin's Noble End"]];
let questions = new Map();
function createQuestions() {
    //let questions = new Map()
    questions.set(0, new guessAlbumCover(albumCoverQuestionData));

    
    tempData = {"id": 1,"element": null,"questionNumber": 1,"completionStatus": false,"type": "multiChoice", "answer": 2, 
        "userAnswer": null,"questionText": "What song of the John Williams - Star Wars: The Phantom Menace is trending the most on spotify?", "templateName": "multi-choice-template","options": tempOptions[0]};
    questions.set(1,new albumReleaseMultiChoice(tempData));
    //jarradd "https://i.scdn.co/image/ab67616d00004851b57074c36a92143915fecee3"
    questions.get(1).imageLocation = "https://i.scdn.co/image/ab67616d000048518b344822c35025ba9439f004";
    questions.get(0).artistTopic = "LMFAO";
    questions.get(1).artistTopic = "John Williams";


    //set up data for the last question.
    //this question will be guess based on lyrics.
    //why did i do this like this? 


    const tempOptions4 = ["2012", "1999", "2004", "2007", "2009", "2003"];
    tempData = {"id": 2,"element": null,"questionNumber": 2,"completionStatus": false,"type": "multiChoice", "answer": 5, 
        "userAnswer": null,"questionText": "What year was the Album, Get Rich Or Die Tryin' by 50 Cent Released?", "templateName": "albumSelectOption","options": tempOptions4};
    questions.set(2, new albumReleaseMultiChoice(tempData));
    //this isnt really gonna work. maybe just do multiple choice for now, but still i think it would be nice to have the whole tracklist. 
    //essentially it just needs the image not the drawing over the top of it. 
    questions.get(2).imageLocation = "https://i.scdn.co/image/ab67616d00004851d843fabb75fef14010e30cae"

    questions.get(2).artistTopic = "50 Cent";

    //question 4
    //guess abbey road album cover. 
    const albumCoverQuestion4Data = {id: 3, questionNumber: 3, completionStatus: false, type:"albumCoverQuestion", answer: "Q0-A6",
    templateName: "guess-album-cover-template",options: tempQSearchData, questionText: "Can you guess the album cover?",
    numGuessesAllow: 5, image: "https://i.scdn.co/image/ab67616d00001e02dc30583ba717007b00cceb25"};
    questions.set(3, new guessAlbumCover(albumCoverQuestion4Data));
    questions.get(3).artistTopic = "The Beatles";

    //question 5
    //nirvana question.
    const tempOptions5 = ["$1", "$2","$10", "$20", "$50", "$100"];
    tempData = {"id": 4,"element": null,"questionNumber": 4,"completionStatus": false,"type": "multiChoice", "answer": 0, 
        "userAnswer": null,"questionText": "On the album cover, Nirvana - Nevermind, what is the denomination of currency on the album cover bill?", "templateName": "albumSelectOption","options": tempOptions5};
    questions.set(4, new albumReleaseMultiChoice(tempData));
    //this isnt really gonna work. maybe just do multiple choice for now, but still i think it would be nice to have the whole tracklist. 
    //essentially it just needs the image not the drawing over the top of it. 
    questions.get(4).imageLocation = "https://i.scdn.co/image/ab67616d00004851fbc71c99f9c1296c56dd51b6"
    console.log("test questions created.");
    questions.get(4).artistTopic = "Nirvana";

    //question 6
    //guess Tubthumper album cover. 
    const albumCoverQuestion6Data = {id: 5, questionNumber: 5, completionStatus: false, type:"albumCoverQuestion", answer: "Q0-A9",
    templateName: "guess-album-cover-template",options: tempQSearchData, questionText: "Can you guess the album cover?",
    numGuessesAllow: 5, image: "https://i.scdn.co/image/ab67616d00001e026cfc470251e23a7bb6a38d66"};
    questions.set(5, new guessAlbumCover(albumCoverQuestion6Data));
    questions.get(5).artistTopic = "Chumbawamba";

    //question 7
    //Hello goodbye question
    const tempOptions7 = ["Goodbye", "Yes","No", "Hello", "I don't know", "Slow"];
    tempData = {"id": 6,"element": null,"questionNumber": 6,"completionStatus": false,"type": "multiChoice", "answer": 3, 
        "userAnswer": null,"questionText": "According to the beatles, ff you say 'Goodbye', I say '...' ", "templateName": "albumSelectOption","options": tempOptions7};
    questions.set(6, new albumReleaseMultiChoice(tempData));
    //this isnt really gonna work. maybe just do multiple choice for now, but still i think it would be nice to have the whole tracklist. 
    //essentially it just needs the image not the drawing over the top of it. 
    questions.get(6).imageLocation = "https://i.scdn.co/image/ab67616d00004851692d9189b2bd75525893f0c1"
    console.log("test questions created.");
    questions.get(6).artistTopic = "The Beatles";

    return questions
    
}

