# Intro to long-running operations in JS

  * Last week we looked at `setTimeout` as a way to "pause" and run some code later
  * `setTimeout` does not work like a pause function. It takes a callback function and a duration, and calls the callback function after that duration, simulating a pause
  * Let's see why JavaScript does that by trying to write a regular `pause` function:
  
```js
function pause(durationInMs) {
    var functionStartTime = Date.now();
    
    while (Date.now() - functionStartTime < durationInMs) {
        // ... do nothing ...
    }
    
    return;
}

// Use the pause function to wait for 2 seconds and pring "hello"
pause(2000);
console.log("hello");
```

  * While this would work fine in some other programming languages, it's not a good solution for JS
  * JS can only run one piece of code at the same time, so when we are in the `while` loop, we cannot do anything else
  * Let's look in the browser to see how our `pause` function affects things...
  * This is the general pattern in JavaScript code: anytime we ask a function something that takes a long time, we will get the result in a callback function.
  * What are some things other than `pause` that we can ask and that take a long time? making HTTP requests and making SQL requests are two examples.
  * Any function that needs to wait on I/O (input/output) will take a callback as an extra parameter, and call that callback with the result of the I/O when it is done.
  * Meanwhile if our code has other things to do like paint the screen at 60 frames per second, then it can do it
  * Callback code can quickly become hard to read and maintain. Every time there is some I/O, we create a new level of callback.
  * Here's a simple example where we wait for a timeout, then wait for another one after the first one is done:
  
```js
setTimeout(
    function() {
        
        console.log('one second has passed');
        
        setTimeout(
            function() {
                
                console.log('one more second has passed');
                
                setTimeout(
                    function() {
                        
                        console.log('one more second has passed');
                        
                    }, 1000);
        
            }, 1000);
    
    }, 1000);
```

  * Let's look at a more interesting example: making SQL queries to a database...
  
# NodeJS and NPM

  * NodeJS is a JavaScript environment that is meant to run directly on the computer, not through a browser
  * As such, NodeJS allows us to do everything a general purpose programming language allows: read/write from the disk, connect to servers, etc.
  * When we install NodeJS, it comes with a basic set of networking functions that allow it to connect to any server on the internet and talk to it
  * Building up on top of this functionality allows us to make NodeJS talk to SQL servers, HTTP servers and so on
  * However, rather than having to write that basic functionality ourselves, we can first check if someone else has done it and re-use their code
  * NodeJS comes with a package manager called NPM (Node Package Manager). NPM allows us to easily download more JavaScript code and use it as part of our own programs
  * Someone has already written a package that enables NodeJS to communicate with a MySQL server. The package is aptly called `mysql` on NPM.
  * We can install packages from the command line by using the `npm` command. Before installing any packages, we will initialize a project file using `npm init -y`
  * This will create a file called `package.json`. It will contain some information about our project.
  * Once this file is here, we can use the `npm install` command to install packages. Let's install the `mysql` package with `npm install mysql`
  * Once the installation is complete, note that there is a new directory in the project: `node_modules`. This is where `npm` copies the JavaScript code that we just downloaded
  * Normally, the code inside `node_modules` is not code that we want to include in our Git repository. We don't need to keep track of it because we can always re-download it.
  * For this reason, if we add the `--save` option to `npm install`, it will add an entry to the `package.json` file to remember that we installed this package.
  * If we share our Git repository on GitHub, `package.json` is enough to know which modules to install. Therefore we will tell Git to **ignore** the `node_modules` directory
  * To do this, Git looks for a special file at the root of the project with the name `.gitignore`. This file contains one line per item we want Git to ignore
  * Let's create `.gitignore` and put only one line in it: `node_modules/`. This will tell Git to ignore the `node_modules` directory.
  * Finally we can use the `mysql` package in our own code! To do this, we simply have to import that code using the globally available `require` function. This function is provided by NodeJS and is not part of JavaScript.
  * In the next section we'll look at how to use the NodeJS `mysql` package to send SQL queries to our database and get back responses.
  
# Querying a MySQL server with JavaScript and NodeJS-style callbacks

  * Let's first look at the simplest possible example:
  
```js
var mysql = require('mysql');

var connection = mysql.createConnection({
    user: 'root',
    database: 'finances'
});

connection.query('SELECT * FROM expenses', function(error, result) {
    console.log(result);
});
```

  * Let's dissect this example...
  * First we use `require` to load an external module that we installed from NPM
  * Then, we create a connection to a database and store it in a variable called `connection` -- an object
  * Then, we call the `query` method of the connection. This will issue an SQL query to the database and wait for the answer
  * Because the function is waiting for I/O, it will give us the result back in a callback function.
  * This is the standard NodeJS style of callbacks: a long-running function takes an additional callback as its last parameter, then calls it when it receives the answer
  * This makes it so that the long-running function is not keeping the JavaScript engine busy while waiting for the database to reply, and so other things can happen at the same time.
  * Let's look at an example where we do one query, then another one after the first one has completed:
  
```js
connection.query('INSERT INTO expenses (expenseDate, expenseType, expenseAmountInCents, clientId) VALUES (?, ?, ?, ?)', ['2012-04-12', 'food', 1505, 1], function(error, result) {
    if (error) {
        console.log('there was an error with the first query, cannot continue');
    }
    else {
        connection.query('SELECT * FROM expenses', function(error, result) {
            if (error) {
                console.log('There was an error with the second query');
            }
            else {
                console.log(result);
            }
        });
    }
});
```

  * Just like for the `setTimeout` example above, every time we need to do something after a long-running operation, we have to write that code in the callback function
  * As with `setTimeout`, this can eventually lead to the so-called pyramid of hell, where we nest one more level every time we have a long-running operation
  * This also means that long-running functions don't actually have a useful `return` value: the function has to end before knowing the answer, so the only useful thing it can return is `undefined`. The real "return" value will be passed to the provided callback
  * Last week we looked at the `class` keyword introduced in ES6 as a way to simplify the writing of constructor functions.
  * ES6 also introduces a new type of object called a `Promise`, that simplifies the writing of callback-based code without changing its behavior.
  * When a long-running function uses `Promise`s, it will return a `Promise` object instead of accepting a callback as its last parameter
  * The `Promise` object represents an **eventual result** as an object. The internal state of this object is initially `pending`, and later on it will become `resolved` or `rejected`.
  * To retrieve the eventual result, we have to call the `then` method of a `Promise` and pass it a callback that will receive the result.
  * To do any of this, we need to have access to a function that uses `Promise` rather than NodeJS callbacks. In terms of talking to MySQL, an NPM package called `promise-mysql` -- oh so creative -- does exactly that. Let's see how we can use it...
  
# Querying a MySQL server with JavaScript and `Promise`s

  * Let's install the `promise-mysql` package after removing the callback-based `mysql` package:
  
```bash
npm remove --save mysql
npm install --save promise-mysql
```

  * Here's what the new, sweetened version of the code will look like:
  
```js
var mysql = require('promise-mysql');

var connection = mysql.createPool({
    user: 'root',
    database: 'finances'
});

connection.query('INSERT INTO expenses (expenseDate, expenseType, expenseAmountInCents, clientId) VALUES (?, ?, ?, ?)', ['2012-04-12', 'food', 1505, 1]).then(function(result) {
    connection.query('SELECT * FROM expenses').then(function(result) {
        console.log(result);
    });
})
```

  * The code looks very similar... Rather than passing a callback directly to the `query` method, we call `.then` on the return value of `query` and pass the callback there
  * It looks like nothing much has changed, and the code still looks pyramidal: every time we have a long-running operation, we have to provide a callback to its `.then` method.
  * The nice thing about `Promise`s is that they are self-aware. Just like some `Array` methods like `filter` and `map` return new arrays, the `then` method of `Promise` returns a new `Promise`!
  * More importantly, if we ourselves return a `Promise` from the callback we pass to a `then` method, the new `Promise` returned by that `then` method will resolve when the `Promise` we return from our callback resolves
  * This sounds like a lot of inception, but straightening out the above example can shed some light on it:
  
```js
connection.query('INSERT INTO expenses (expenseDate, expenseType, expenseAmountInCents, clientId) VALUES (?, ?, ?, ?)', ['2012-04-12', 'food', 1505, 1])
.then(function(result) {
    return connection.query('SELECT * FROM expenses'); // we are returning a Promise
})
.then(function(result) { // This callback will be called when the Promise we returned from the last callback resolves
    console.log(result); // Array of expense objects
});
```

  * This means we can chain calls to long-running operations, but never have to nest the callbacks
  * Notice this also removes the need to have an `error` parameter as the first parameter of NodeJS-style callbacks. Does this mean there can never be anymore errors??
  * Nope. They are just handled in a more elegant way. In addition to a `then` method, `Promise`s also have a `catch` method to catch any errors in a string of long-running operations. Here's the full example:
  
```js
connection.query('INSERT INTO expenses (expenseDate, expenseType, expenseAmountInCents, clientId) VALUES (?, ?, ?, ?)', ['2012-04-12', 'food', 1505, 1])
.then(function(result) {
    return connection.query('SELECT * FROM expenses'); // we are returning a Promise
})
.then(function(result) { // This callback will be called when the Promise we returned from the last callback resolves
    console.log(result); // Array of expense objects
})
.catch(function(error) { // This callback will trigger if an error occurs in either query
    console.error('An error happened', error.stack);
})
```

# Making HTTP requests using NodeJS and `Promise`s

  * In addition to allowing us to connect to an SQL server and send queries to it, NodeJS also allows us to connect to HTTP (web) servers and send HTTP requests to them
  * Normally, we make HTTP requests by using a web browser, and the URLs we request will return HTML web pages. However, some web servers return pure, structured data instead of HTML
  * You may have heard of the XML or JSON data formats. They are basically text formats like HTML, but they are used when we need to transfer data between different systems.
  * XML used to be the standard data exchange format, but in the last few years JSON has surpassed it as a lighter alternative.
  * JSON is simply a text format that encodes data using JavaScript Object Notation -- the object-litteral notation you already know about, with a few extra rules:
    1. JSON does not support functions as values, only simple values like numbers, strings, booleans, arrays and objects.
    2. Every object key in JSON has to be double-quoted, even if JavaScript would allow you to write it without quotes
    3. Strings must be double-quoted. You don't have the choice to use single-quotes if you are writing JSON.
  * This is an example of a JSON document:
  
```json
{
  "timestamp": 1491960791,
  "message": "success",
  "iss_position": {
    "longitude": "175.8053",
    "latitude": "33.5353"
  }
}
```

  * This JSON document was obtained by making an HTTP request to `http://api.open-notify.org/iss-now.json`. Try it for yourself.
  * We will learn more about the HTTP protocol next week. For now, at least know that some web servers will return other things than HTML, and we can use that to incorporate their data in our own programs.
  * Here's one more example: open a new browser tab and go to `https://www.reddit.com/r/montreal.json` and look at the data. If it looks all piled up together in your browser, make sure to install the JSONView plugin, available for Chrome and Firefox.
  * The data that you see on that last page is exactly the same data you would see if you went to the Montreal subreddit without the `.json`, but without the fluff of HTML and CSS. Only arrays of objects.
  * Even though this data looks like a JavaScript object, remember that JSON is just a string of text that *represents* a JavaScript object. There is a JavaScript function called `JSON.parse` that can read that text and create an object out of it.
  * Every major programming language other than JavaScript also has a function to read in the JSON text, and transform it in the data structures of the language.
  * (For example in PHP there is a function called `json_decode` that can read a string of JSON and transform it to something called an "associative array", which is the PHP equivalent of JavaScript objects when used as dictionaries)
  * Let's look at an example of making an HTTP request using NodeJS. We will use the `request-promise` package from NPM to do this:
  
```js
var request = require('request-promise');

request('http://api.open-notify.org/iss-now.json')
.then(function(response) {
    var data = JSON.parse(response); // Make the JSON string into the object it represents.
    
    // Then use data like any JavaScript object, because it is one :)
    console.log(data.iss_position);
})
.catch(function(error) {
    console.error('Something went wrong!', error.stack);
});
```

  * As you can see the idea is very similar to making SQL queries. The `request` function returns a `Promise` for a response.
  * In the `then` callback, the `response` variable will be a string. In this case it's a string of JSON so we parse it to turn it into the object it represents.
  * If we want to make a function that returns a `Promise` for the ISS position, it's easy. We simply have to `return` the result we want from the last `then` callback:
  
```js
var request = require('request-promise');

function getIssPosition() {
    return request('http://api.open-notify.org/iss-now.json')
    .then(function(response) {
        var data = JSON.parse(response); // Make the JSON string into the object it represents.
        
        // Then use data like any JavaScript object, because it is one :)
        return data.iss_position;
    });
}

getIssPosition()
.then(function(position) {
    console.log('The position of the ISS is ', position);
})
.catch(function(error) {
    console.log('Something went wrong', error.stack);
});
```

  * Normally, the definition of the function will not be in the same file as the usage of that function.
  * NodeJS allows us to use the same `require` mechanism to make modules out of our own code.
  * NodeJS makes it really simple: each file in our code is a module, and it can export stuff by assigning it as a property of the `exports` global variable
  * For example we can create a file called `library.js` with only function definitions and their dependencies, and export the functions:
  
```js
var request = require('request-promise');

function getIssPosition() {
    return request('http://api.open-notify.org/iss-now.json')
    .then(function(response) {
        var data = JSON.parse(response); // Make the JSON string into the object it represents.
        
        // Then use data like any JavaScript object, because it is one :)
        return data.iss_position;
    });
}

exports.getIssPosition = getIssPosition; // not calling the function, simply exporting it.
```

  * Then in another file called `app.js`, we can use `require` to load up the `library.js` file, and get access to the things we exported:
  
```js
var library = require('./library.js'); // We have to use a relative path starting with . or .. otherwise NodeJS will look in `node_modules`

library.getIssPosition()
.then(function(position) {
    console.log('The ISS position is', position);
})
.catch(function(error) {
    console.error('Something went wrong', error.stack);
});
```

  * Here's another example of API, the Google Maps Geocoding API. We can pass it the name of a place, and it will return a set of coordinates for it
  * Try the following URL in your browser: `https://maps.googleapis.com/maps/api/geocode/json?address=montreal`. You will get back a lot of data.
  * We're interested in the path `results[0].geometry.location` which will give us an approximate latitude/longitude for the address we asked
  * Let's see how we can make this into a JavaScript function:
  
```js
function getAddressCoordinates(address) {
    return request('https://maps.googleapis.com/maps/api/geocode/json?address=' + address)
    .then(function(response) {
        var data = JSON.parse(response);
        
        return data.results[0].geometry.location;
    });
}
```

  * Easy peasy! Now we have a function that returns the location of the ISS, and another one that returns the location of an address
  * Let's use the two functions together to find the distance between an address and the ISS:
  
```js
// This function is completely wrong but we don't care. It returns the euclidian distance but earth is not flat. Don't even try.
function findDistance(pos1, pos2) {
    return Math.pow(pos1.lat - pos2.lat, 2) + Math.pow(pos1.lng - pos2.lng, 2);
}

var issPosition; // We need this global variable for later

getIssPosition()
.then(function(position) {
    issPosition = position; // We have to assign position to a global var or we won't be able to use it in the next function
    return getAddressCoordinates("montreal");
})
.then(function(addressPosition) {
    // Here we can use the issPosition and addressPosition to find the distance between them
    console.log('The distance is: ' + findDistance(issPosition, addressPosition));
});
```

  * Here notice that we first fetch the ISS position, then the position of the address
  * However these two operations don't have to be done in sequence. They don't depend on each other!
  * `Promise` provides us with a function called `Promise.all` that takes an array of `Promise`s and returns a new `Promise` that resolves when all the `Promise`s in the array are resolved.
  * We can use this to make the two requests in parallel and get the response in one callback. We also eliminate the global variable:
  
```js
Promise.all([
    getIssPosition(),
    getAddressCoordinates("montreal")
])
.then(function(results) {
    // Here results is an array with [0] being the result of getIssPosition and [1] being getAddressCoordinates
    
    console.log('The distance is: ' + findDistance(results[0], results[1]));
})
.catch(function(error) {
    console.error('Something went wrong', error.stack);
});
```

# The `Promise` constructor
  * In some very rare cases, you will want to execute a long-running operation that does not have a `Promise`-returning version. No problem, you can use the `Promise` constructor to create a new promise, and use a NodeJS-style callback to resolve the Promise.
  * For example, if the `promise-mysql` package did not exist, you could make a basic `Promise`-returning function using the regular `mysql` package:
  
```js
var mysql = require('mysql');

var connection = mysql.createConnection({
    user: 'root'
});

function doQuery(query, parameters) {
    return new Promise(function(resolve, reject) {
        connection.query(query, parameters, function(error, result) {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
}
```

  * The `Promise` constructor takes one parameter: a function. This function will be executed and passed two other functions: `resolve` and `reject`. You have to call one of the two functions once and only once to settle the `Promise`
  * Here, we use a regular NodeJS-style callback to receive the SQL query result, then simply forward the result to the `resolve` function. This in turn will resolve the new `Promise`.
  * If we call `reject` instead of calling `resolve`, then the new `Promise` will be rejected.
  * Here's another example of using the callback-based `setTimeout` to create a `wait` function that returns a `Promise`:
  
```js
function wait(durationInMs) {
    return new Promise(function(resolve) {
        setTimeout(resolve, durationInMs);
    });
}
```

  * Since waiting cannot fail, we don't need to accept the `reject` parameter. We simply tell `setTimeout` to call the `resolve` function after the requested duration. There are no arguments. This is possibly the simplest case of creating a new `Promise`
  * :warning: **NOTE**: It's very rare that we need to call `new Promise`! Most long-running operations already have a `Promise` version.