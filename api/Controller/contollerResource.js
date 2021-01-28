
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

    // =========================== Step one ========================
    // Call the Rule - data validation function
    isRuleDataValid(res, rule, data)
    // If operation is returned here, it then implies that the required fields and their
    // respective field - values were passed as intended and has been parsed for validation as to the 
    // condiitons of; data - type, emptiness etc

    // ========================== Step two =========================

    // Thus the next validation centres on value property of "field" and "condition_value"
    
    const conditionValue = rule["condition_value"]
    const field = rule["field"]
    const fieldValue = data[field]

    const comparatorResult = comparator(rule['condition'], fieldValue, conditionValue)

    if(comparatorResult){
        res.status(200).json({
            "message": `field ${field} successfully validated.`,
            "status": "success",
            "data": {
                "validation": {
                    "error": false,
                    "field": `${field}`,
                    "field_value": `${fieldValue}`,
                    "condition": `${rule['condition']}`,
                    "condition_value": `${conditionValue}`
                }
            }
        })
    }else{
        res.status(400).json({
            "message": `field ${field} failed validation.`,
            "status": "error",
            "data": {
                "validation": {
                    "error": true,
                    "field": `${field}`,
                    "field_value": `${fieldValue}`,
                    "condition": `${rule['condition']}`,
                    "condition_value": `${conditionValue}`
                }
            }
        })
    }
// iv/ gte: Means the field value should be greater than or equal to the condition value 
}



const isRuleDataValid = (res, rule, data) => {
    try {
        // Ensure rule prop is passed.
        if(rule === undefined){
            let error = "rule is required."
            throw error

        // Ensure data prop is passed.
        }else if(data === undefined){
          let error = "data is required."
          throw error

        // Ensure data - type is of the desired type.
        }else if(typeof(rule) !== "object"){
            const passedType = typeof(rule)
            let error = `rule should be of object - type, not ${passedType}.`
            throw error;

        }else if(typeof(data) !== "object"){
            const passedType = typeof(data)
            let error = `data should be of object - type, not ${passedType}.`
            throw error

        }else{
        // ===================================== Field - value validation ======================= //
        // -------------------------------------------------------------------------------

            // Validate payload fields
            const acceptedRuleFields = ["field", "condition", "condition_value"]
            const acceptedDataFields = ["name", "crew", "age", "position", "missions"]
            const ruleFieldsPassed = Object.keys(rule)
            const dataFieldsPassed = Object.keys(data)

        // ===================================== Rule - field validation ======================= //
            // Check for needless fields in rule.
            if(ruleFieldsPassed.length > acceptedRuleFields.length){
                let error = `Needless fields passed in rule.`
                throw error
            }

            // if a field in "acceptedRuleFields" isn't present in "ruleFieldsPassed",
            acceptedRuleFields.forEach(acceptedField => {
                // Check if the required rule fields were given
                if(!ruleFieldsPassed.includes(acceptedField) ){
                    let error = `The field ${acceptedField}, is missing from rule.`
                    throw error;
                }
            })

            // Individual field - type validation. This is where we ensure that the required fields in "rule"
            // contain the desired data - type.
            let index = 0
            ruleFieldsPassed.forEach(field => {
                const fieldValueType = typeof(rule[field])
                const fieldValue = rule[field]

                if(field === "condition_value" && fieldValueType !== "number"){
                    let error = `The field: ${acceptedRuleFields[index]}, in rule, must be of number - type. You passed a ${fieldValueType}.`;
                    throw error
                }else{
                    if(field !== "condition_value" && fieldValueType !== "string"){
                        let error = `The field: ${acceptedRuleFields[index]}, in rule, must be of string - type. You passed a ${fieldValueType}.`;
                        throw error
                    }
                    
                    const conditionTypes = ["gte", "gt", "eq", "neq", "contains"]
                    if(field === "condition"){
                        const search = conditionTypes.includes(fieldValue)
                        if(!search){
                            let error = `Unrecognised condition - type in rule. Condition - type must be: ${[...conditionTypes]}.`;
                            throw error
                        }
                    }
                }   
                index++
            })

        // ===================================== Data - field validation ======================= //
            // Check for needless fields in data
            if(dataFieldsPassed.length > acceptedDataFields.length){
                let error = `Needless fields passed in data.`
                throw error
}
            // if a field in "acceptedDataFields" isn't present in "dataFieldsPassed",
            acceptedDataFields.forEach(acceptedField => {
                // Check if the required data fields were given
                if(!dataFieldsPassed.includes(acceptedField) ){
                    let error = `The field; ${acceptedField}, is missing from data.`
                    throw error
                }
            })

            // Individual field - type validation for data. As above, we ensure that the required fields in "data"
            // contain the desired data - type.
            index = 0
            dataFieldsPassed.forEach(field => {
                const fieldValueType = typeof(data[field])
                const fieldValue = data[field]

                if((field === 'age' || field === "missions") && fieldValueType !== "number"){
                    let error = `The field; ${acceptedDataFields[index]}, in data, must be of number - type. You passed a/an ${fieldValueType}.`;
                    throw error
                }else{
                    if((field !== 'age' || field !== "missions") && fieldValueType !== "string"){
                        let error = `The field; ${acceptedDataFields[index]}, in data, must be of string - type. You passed a/an ${fieldValueType}.`;
                        throw error
                    }
                }
                index++
            })
           

        }
    }catch(error) {
        throw res.status(400).json({
            "message": `${error}`,
            "status": "error",
            "data": null
          })
    }
    console.log("\n\t Done validating...");
}

const comparator = (eqSign, fieldValue, conditionValue) => {
    switch(eqSign){
        case 'eq':
            return fieldValue === conditionValue
        case 'neq':
            return fieldValue !== conditionValue
        case 'gt':
            return fieldValue > conditionValue
        case 'gte':
            return fieldValue >= conditionValue
        case 'contains':
            return fieldValue.includes(conditionValue)
        default:
            // Default not needed due to prior validatio before callinng the 
            // "comparator" function
    }
}

const controller = {
    getController,
    validationController,
}
export default controller;