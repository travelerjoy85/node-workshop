## NodeJS basic workshop

### Base instructions
  * Fork this repository and clone it in a new Cloud9 workspace.
  * As you open the project in Cloud9, open notice there is a file called `.gitignore`. Open this file to check its contents.
  * Notice that the `.gitignore` file contains one line that says "`node_modules`". What this is doing is telling Git that it should ignore the contents of the `node_modules` directory. Since the code in there comes from the outside world, we don't need to save it in our repo.
  * **All the code of this workshop will go in master**. After your first commit, push and create a pull-request titled "Nodes basic workshop - _yourName_".
  * After each exercise, commit your changes and push.

### First program
  * Create a file called `hello-world.js`. In it, write a simple node program that outputs "`Hello World!`" to the console.
  * Add an instruction to your program that will output "`Hello World Again!!`" 10 seconds after the program was run.
  * Save, commit and push.

### A wild interval has appeared!
If you never tried `setInterval`, give it a try first. Like `setTimeout`, it takes a callback function and a time in milliseconds. But instead of calling your callback once, it calls it **once every x milliseconds**. In this exercise, you'll have to mimic what setInterval is doing but **only with `setTimeout`**!

Your exercise: Write a piece of code using `setTimeout` that prints "Hello World!" every 10 seconds forever.

One idea that may come to you is to do something like this:
```javascript
setTimeout(function() {
  console.log('Hello World!');
  setTimeout(function() {
    console.log('Hello World!');
    // when does this stop??
  }, 1000);
}, 1000);
```

This won't work, because you'd have to write an infinite amount of code.

Another idea you might have is to do the following:

```javascript
while (true) {
  setTimeout(function() {
    console.log('Hello World!');
  }, 1000);
}
```

Up to you to figure out why this does not work ;) Ask us if you can't figure it out. Then, find a real solution.

**Two BIG hints**: the solution involves recursion. You will have to write a function.

### Getting some data
  * Create a file called `iss.js`. In it, write a simple node program that will output the latitude and longitude of the International Space Station.
  * Practice your [google-fu](http://www.urbandictionary.com/define.php?term=google-fu) by searching for "iss api" and figuring out the correct URL to use. *Hint: there are many options and they are all good :)*
  * Notice that the values provided by the API are very precise. Round off the values to two decimal digits for a nicer display. *Hint: toFixed*
  * Save/commit/push

### Augmenting our application
  * Create a file called `iss-augmented.js`. It will be similar to `iss.js` but more difficult!
  * Augment your ISS application to tell the user how "far" the ISS is from them. Here is how you will do it:
  * Using the `prompt` module, ask the user to enter their location (e.g. "montreal")
  * Using Google's Geolocation API, find out the latitude and longitude of the provided location. Here is how:
    * This URL: https://maps.googleapis.com/maps/api/geocode/json?address=montreal will show the lat/long for montreal
    * Explore this URL in your web browser to figure out where the lat/lng is located. Try to pass different values for "address" for educational purposes :)
  * When you are comfortable with finding the location based on an input address, you can then calculate the distance between the ISS and the user:
    * Look at this URL: http://www.movable-type.co.uk/scripts/latlong.html
    * It specifies a formula for calculating the distance. Scroll the page to the JavaScript portion, and create a function that uses the provided code. You don't need to understand what is going on in there, it is **very** mathy!
    * **NOTE**: In order for this code to work, you'll need to add the following code at the beginning of your program:
```javascript
  Number.prototype.toRadians = function() {
    return this * Math.PI / 180;
  }
```
  * Be aware that _toFixed()_ will convert your number to a string, which may or may not be a problem. Read more about his [here](http://stackoverflow.com/questions/2283566/how-can-i-round-a-number-in-javascript-tofixed-returns-a-string) to learn how to convert back to a number or do rounding differently.
  * Finally, display a message which says something like "_The ISS is XXXXXX kilometers away from you._".
  * Save/commit/push

### Number guessing game!
  * Create a file called `number-guessing-game.js`.
  * In this file, re-write your number guessing game (from the basic javascript workshop) for the command line!
  * Instead of using `prompt` and `alert`, you will have to use capabilities from NodeJS and any external module. **HINT**: there is an npm library called `prompt` that can help you with that :)
  * Reminder: to install an npm library, run `npm install theLibraryName`. In this case theLibraryName is `prompt`.s
  * Save/commit/push

### Challenge: Hangman!
  * Create a file called `hangman.js`.
  * In this file, write a program that will let the user play hangman. The program should work as follows:
    * Choose a random word from a list of words.
    * In a loop, do the following:
      * Ask the user to guess a letter
      * If the user guessed a wrong letter, then add one step to the hangman "drawing"
      * Display the current completion of the word next to a hangman ASCII "drawing". You can get some inspiration from either [here](http://www.berkeleyinternet.com/perl/node30.html) or [here](http://ascii.co.uk/art/hangman)
      * Keep looping until either the word is found or the hangman is hanged!
    * Display a message to the user letting them know what happened
  * Save/commit/push
