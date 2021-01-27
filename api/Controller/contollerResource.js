
const getController = (req, res) =>{
    const basicInfo = {
    "name": "Chukwunazaekpere Obioma",
    "github": "@Chukwunazaekpere",
    "email": "emmanuelchinaza5777@gmail.com",
    "mobile": "0816-954-7035",
    "twitter": "No registered twitter account"
    }

    const surname = basicInfo['name'].split(" ")[1];
    res.status(200).json({
        "message": `${surname}'s Basic Info`,
        "status": "success",
        "data": {
            ...basicInfo
        }
    })
}

const validationController = (req, res) =>{
    const { rule, data } = req.body

    // Call the validation function
    let validationResponse =  isRuleDataValid(res, rule, data)
    console.log("resp: ", validationResponse);
    
}

const isRuleDataValid = (res, rule, data) => {
    try {
        // Ensure rule prop is passed.
        if(rule === undefined){
            throw res.status(400).json({
                "message": "rule is required.",
                "status": "error",
                "data": null
              })

        // Ensure data prop is passed.
        }else if(data === undefined){
            throw res.status(400).json({
                "message": "data is required.",
                "status": "error",
                "data": null
              })

        // Ensure data - type is of the desired type.
        }else if(typeof(rule) !== "object"){
            throw res.status(400).json({
                "message": "rule should be object - type.",
                "status": "error",
                "data": null
              })
        }else if(typeof(data) !== "object"){
            throw res.status(400).json({
                "message": "data should be object - type.",
                "status": "error",
                "data": null
              })
        }
        
        // Validate payload fields
        else{
            const acceptedRuleFields = ["field", "condition", "condition_value"]
            const acceptedDataFields = ["name", "crew", "age", "position", "missions"]
            const ruleFieldsPassed = Object.keys(rule)
            const dataFieldsPassed = Object.keys(data)

            // if a field in "acceptedRuleFields" isn't present in "ruleFieldsPassed",
            acceptedRuleFields.forEach(acceptedField => {
                if(!ruleFieldsPassed.includes(acceptedField) ){
                    throw res.status(400).json({
                        "message": `field ${acceptedField} is missing from rule.`,
                        "status": "error",
                        "data": null
                      })
                }
            })

            // if a field in "acceptedDataFields" isn't present in "dataFieldsPassed",
            acceptedDataFields.forEach(acceptedField => {
                if(!dataFieldsPassed.includes(acceptedField) ){
                    throw res.status(400).json({
                        "message": `field ${acceptedField} is missing from data.`,
                        "status": "error",
                        "data": null
                      })
                }
            })

        }
    }finally {
        // console.log("Missing fields")
    }

    return "error"
}

const controller = {
    getController,
    validationController,
}
export default controller;