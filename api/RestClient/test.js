
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

const g = {
    family: {
        mum: {
            name: "Cecilia"
        }
    }
}
let y = 'family.mum'
try{
    let r = g['family']['mum']
    console.log(r);
}finally{

}