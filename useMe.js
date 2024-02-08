const dateReturned = new Date();
const dateOut = new Date();

console.log('dateReturned:', dateReturned);
console.log('dateOut:', dateOut);

const daysLate = Math.ceil((dateReturned - dateOut) / (1000 * 3600 * 24)); 


console.log(daysLate);
