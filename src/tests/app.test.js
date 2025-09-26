console.log(data.question_count);

let test_questions = getGameResponseIntoObject(data);
console.log(test_questions.get(0).options);
console.log("################################################################");
console.log("the test object has been created successfully. begining tests app,js.")
console.log("################################################################")
console.log("TEST 1");
// console.assert(test_questions.get(0).answer === , "❌ add(2,3) should be 5");
let temp_question = test_questions.get(0);
console.assert(temp_question.options[temp_question.answer] === "2004", "the correct answer to question 0 (1) should be 2004. (TISm question)");
temp_question = test_questions.get(1);
console.assert(temp_question.options[temp_question.answer] === "1990", "the correct answer to question 1 (2) should be 1990. (black crowes question)");
temp_question = test_questions.get(2);
console.assert(temp_question.questionText === "what song of the The Grogans - Grogan Grove album is trending the most on spotify?", "the question text doesnt match for question 3. check if any changes have been made to question text.");
temp_question = test_questions.get(3);
let temp_tester = []; 
for (val of temp_question.options) {
    temp_tester.push(val.id);
}
console.assert(temp_tester.includes(temp_question.answer),"The led zepplin question failed. the answer is not in the options.");
// console.assert(window.subtract(5, 2) === 3, "❌ subtract(5,2) should be 3");
console.log("################################################################");
console.log("✅ All browser app.jstests passed!")
console.log("################################################################")