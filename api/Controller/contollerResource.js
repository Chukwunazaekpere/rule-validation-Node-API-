
const getController = (req, res) =>{
    const basicInfo = {
    "name": "Chukwunazaekpere Obioma",
    "github": "@Chukwunazaekpere",
    "email": "emmanuelchinaza5777@gmail.com",
    "mobile": "08169547035",
    "twitter": "no twitter account"
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

const validateRuleController = (req, res) =>{
    console.log(req.body);

}

const controller = {
    getController,
    validateRuleController,
}

export default controller;