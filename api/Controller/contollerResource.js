
/**
 * 
 * @param {*} req : the http request object
 * @param {*} res : the http response object
 */
const getController = (req, res) =>{
    const basicInfo = {
    "name": "Chukwunazaekpere Obioma",
    "github": "@Chukwunazaekpere",
    "email": "ceo.naza.tech@gmail.com",
    "mobile": "0816-954-7035",
    "twitter": "No registered twitter account"
    }

    const surname = basicInfo['name'].split(" ")[1];
    return res.status(200).json({
        "message": `${surname}'s Basic Info`,
        "status": "success",
        "data": {
            ...basicInfo
        }
    })
}


/**
 * 
 * @param {*} req : the http request object
 * @param {*} res : the http response object
 */
const validationController = (req, res) =>{
    const { rule, data } = req.body

    // =========================== Step one ========================
    // Call the Rule - data validation function
    isRuleDataValid(res, rule, data)
    // If operation is returned here, it then implies that the required fields and their
    // respective field - values were passed as intended and has been parsed for validation as to the 
    // condiitons of; data - type, emptiness etc

    // console.log("\n\t After validation ");

    // ========================== Step two =========================
    const field = rule["field"]
    const fieldValue = data[field]

    // Check if "field" is dotted in rule
    try{
        // Try splitting to see if the rule - field is dotted.
        const dataField = rule['field'].split(".")[0]
        const dataFieldValue = rule['field'].split(".")[1]
        if( dataFieldValue !== undefined ){ // The rule - field is dotted
            try{
                // If the rule - field is dotted, check if such field, as well as its property,
                // is present in the Data - field
                const valueInDataProp = data[dataField][dataFieldValue]
                if(valueInDataProp){
                    // The data - field has a correspodinng field as the rule - field.
                    const comparatorResult = comparator(rule['condition'], valueInDataProp, rule["condition_value"])
                    // call the cotroller response to assert the field validation based on the
                    // rule - condition-value.
                    controllerResponse(comparatorResult, rule, valueInDataProp, res)
                }else{
                    // The data - field does't have a correspodinng field as the rule - field.
                    const error = `${"Data"} property does not contain either ${dataField} or ${dataFieldValue} property as passed in the ${"Rule"} property.`
                    throw res.status(400).json({
                        "message": `${error}`,
                        "status": "error",
                        "data": null
                    })
                }
            
            }finally{

            }
        }else{
            // The rule - field isn't dotted.
            const comparatorResult = comparator(rule['condition'], fieldValue, rule['condition_value'])
            controllerResponse(comparatorResult, rule, fieldValue, res)
        }
    }catch{
        // We won't be catching any error here; since we just want to ascertain if 
        // the "rule-field" is dotted or not; which does not connote an error
    }
    
}

/**
 * 
 * @param {*} boolValue: the comparison value based on the "rule['condition-value']"
 * @param {*} rule : all fields of the rule - property.
 * @param {*} fieldValue : the corresponding data - field-value as the rule-field-value
 * @param {*} res : the response object
 */
const controllerResponse = (boolValue, rule, fieldValue, res) => {
    if(boolValue){
        throw res.status(200).json({
            "message": `field ${rule['field']} successfully validated.`,
            "status": "success",
            "data": {
                "validation": {
                    "error": false,
                    "field": `${rule['field']}`,
                    "field_value": `${fieldValue}`,
                    "condition": `${rule['condition']}`,
                    "condition_value": `${rule['condition_value']}`
                }
            }
        })
    }else{
        res.status(400).json({
            "message": `field ${rule['field']} failed validation.`,
            "status": "error",
            "data": {
                "validation": {
                    "error": true,
                    "field": `${rule['field']}`,
                    "field_value": `${fieldValue}`,
                    "condition": `${rule['condition']}`,
                    "condition_value": `${rule['condition_value']}`
                }
            }
        })
    }
}

/**
 * 
 * @param {*} res : the http response object
 * @param {*} rule : all fields of the rule - property.
 * @param {*} data : all fields of the data - property.
 */

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
            const ruleFieldsPassed = Object.keys(rule)
            const dataFieldsPassed = Object.keys(data)
            const ruleFieldProp = rule['field'].split(".")[0]
            const acceptedRuleFields = ["field", "condition", "condition_value"]
            const acceptedDataFields = ["name", "crew", "age", "position", ruleFieldProp]

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

        // ===================================== Data field - value validation ======================= //
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
                
                if((field === 'name' || field === "position" || field === "crew") && fieldValueType !== "string"){
                    let error = `The field; ${acceptedDataFields[index]}, in data, must be of string - type. You passed a/an ${fieldValueType}.`;
                    throw error

                }else{
                    if (field === "age" && fieldValueType !== "number"){
                        let error = `There are irregularities with either the age or ${ruleFieldProp} field, in data. The age field must be of number - type. Then, either an object or a number - type for the ${ruleFieldProp} field.`;
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
    

}

/**
 * 
 * @param {*} eqSign : the rule['condition']
 * @param {*} fieldValue : the corresponding data - field-value as the rule-field-value
 * @param {*} conditionValue : the rule['condition_value']
 */
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
            // Default not needed due to prior validation before calling the 
            // "comparator" function
    }
}

const controller = {
    getController,
    validationController,
}
export default controller;