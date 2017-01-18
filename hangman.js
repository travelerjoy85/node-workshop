//Hangman
var prompt = require('prompt');
var request = require('request');

//
//       MAIN
//

getRandomWord();



//
//     FUNCTIONS
//

function startGame(theWord){
    var stage = 0;
    var lettersGuessed = " ";
    //create guessArray
    var guessArray = [theWord.length];
    for ( var i = 0; i < theWord.length; i++){
        guessArray[i] = "_";
    }

    //introductions to the game
    introductions(theWord);
    promptUserforGuess(theWord,guessArray,stage, lettersGuessed);
}

function fillInGuessArrayIfLetterIsFound(word, letter, guessArray){
    var flag = false;
    for(var i=0; i<word.length;i++) {
        if (word[i] === letter){
            guessArray[i] = letter;
            flag = true;
        }
    }
    if(flag){
        return guessArray;
    }else{
        return flag;
    }
}

function promptUserforGuess(theWord,guessArray,stage, lettersGuessed){
    console.log("\n What is your guess?");
    prompt.start();
    prompt.get(['letter'], function (err, input) {
        if(err){
            console.log("please input a single lowercase char");
        }
        lettersGuessed += input.letter+" ";
        if( fillInGuessArrayIfLetterIsFound(theWord, input.letter, guessArray) ){
            console.log("\nGood guess!");
        }else{
            stage++;
            console.log("\nGet Rekt my friend!");
        }
        outputNicely(stage, guessArray, lettersGuessed);

        if(guessArray.reduce(function(a, b) {return a+b;}) === theWord){
            console.log("CONGRATULATIONS, You've survived! Go on and prosper!");
            promptToPlayAgain();
        }else if(stage === 6){
            console.log("The gallows have taken you life, thanks for playing \nThe word was: "+theWord);
            promptToPlayAgain();
        }else{
            promptUserforGuess(theWord, guessArray, stage, lettersGuessed);
        }
    });
}

function outputNicely(stage,guessArray,lettersGuessed){

    console.log("So far you have guessed:  "+lettersGuessed);
    if(stage === 6){
        outputHangman(stage);
    }else{
        outputHangman(stage);
        console.log( guessArray.reduce(function(a, b) {
            return a+" "+b;
        }));
    }
}

function getRandomWord(){
    request('http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&minCorpusCount=20000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5', function (error, response, body) {
        if (error) {
            console.log("There was an error: " + error);
        }
        if (!error && response.statusCode === 200) {
            var randomWord = JSON.parse(body);
            var theWord = randomWord.word.toLowerCase();
        }
        //pass theWord to next function.
        startGame(theWord);
    });
}

function promptToPlayAgain(){
    console.log("\n Would you like to play again? ( yes or no )");
    prompt.start();
    prompt.get(['yes_or_no'], function (err, input) {
        if(err){
            console.log("please enter yes or no");
            promptToPlayAgain();
        }
        if(input.yes_or_no === "yes"){
            getRandomWord();
        }else{
            console.log("thanks for playing");
        }
    });
}

function introductions(theWord){
    console.log("---                            ---");
    console.log("---   WELCOME TO THE HANGMAN   ---");
    console.log("---                            ---");
    console.log("A random " +theWord.length+ " letter word has been selected, \nit is up to you to guess it, \nlest the gallows take your life!");
}

function outputHangman(stage){
    switch (stage) {
        case 0:
            console.log( " _________     ");
            console.log( "| /       |    ");
            console.log( "|/             ");
            console.log( "|              ");
            console.log( "|              ");
            console.log( "|              ");
            console.log( "|              ");
            break;

        case 1:
            console.log( " _________     ");
            console.log( "| /       |    ");
            console.log( "|/        0    ");
            console.log( "|              ");
            console.log( "|              ");
            console.log( "|              ");
            console.log( "|              ");
            break;

        case 2:
            console.log( " _________     ");
            console.log( "| /       |    ");
            console.log( "|/        0    ");
            console.log( "|         |    ");
            console.log( "|              ");
            console.log( "|              ");
            console.log( "|              ");
            break;

        case 3 :
            console.log( " _________     ");
            console.log( "| /       |    ");
            console.log( "|/        0    ");
            console.log( "|        /|    ");
            console.log( "|              ");
            console.log( "|              ");
            console.log( "|              ");
            break;

        case 4 :
            console.log( " _________     ");
            console.log( "| /       |    ");
            console.log( "|/        0    ");
            console.log( "|        /|\\  ");
            console.log( "|              ");
            console.log( "|              ");
            console.log( "|              ");
            break;

        case 5:
            console.log( " _________     ");
            console.log( "| /       |    ");
            console.log( "|/        0    ");
            console.log( "|        /|\\  ");
            console.log( "|        /     ");
            console.log( "|              ");
            console.log( "|              ");
            break;

        case 6 :
            console.log( " _________     ");
            console.log( "| /       |    ");
            console.log( "|/        0    ");
            console.log( "|        /|\\  ");
            console.log( "|        / \\  ");
            console.log( "|              ");
            console.log( "|              ");
            break;

             default:
    }
}
