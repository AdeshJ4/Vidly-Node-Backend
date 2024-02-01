const event = require('events');
const eventEmitter = new event.EventEmitter();


eventEmitter.on('intro', (fname)=> {
    console.log(`Hello ${fname}`);
})


eventEmitter.emit('intro', 'Adesh Jadhav');

