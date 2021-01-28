
let k = {
    food: 'error',
    home: '',
    flour: 'wheat'
}


try {
    if(k === 5){
        console.log("unknown");
    }
    let error = "hmmm"
    throw error
} catch (error) {
    // console.log("Not String!", error);
    
}

const possibleConditions = {
    eq: '===',
    neq: '!==',
    gt: '>',
    gte: '>=',
}

console.log(possibleConditions['eq']);