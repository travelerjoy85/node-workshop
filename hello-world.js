console.log('hello world')

function helloWorld() {
  setTimeout( () => {
    console.log('Hello world again!')
    helloWorld()
  }, 2000)
}

helloWorld()
