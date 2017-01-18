var prompt = require('prompt');
prompt.start();

var target = Math.floor(Math.random()*101)
var tryCount = 4

function game(random, count){
    if(count <= tryCount){
      var randomNumber = random;
      // console.log(randomNumber);
          prompt.get(["number"],function(undefined, result){
            if(result.number == randomNumber){
              console.log("Congratulations! You guessed the number correctly!");
              return
            }else if(result.number>randomNumber){
              console.log("Too high!")
              game(random, count+1);
            }else if(result.number<randomNumber){
              console.log("Too low!")
              game(random, count+1);
            }else if(isNaN(Number(result.number))){
              console.log("That's not a number.... type a number please.");
              game(random, count)
            }
          });
      }else{
        console.log("You lose, game over. (y/n to play again)")
        prompt.get(["try_again"],function(undefined, result){
          if(result.try_again == "y"){
            game(Math.floor(Math.random()*101), 0);
          }
        })
      }
}

game(target, 0);
