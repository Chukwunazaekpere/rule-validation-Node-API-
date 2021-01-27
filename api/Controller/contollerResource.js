
const getController = (req, res) =>{
    res.send("Hello from getController")
}

const validateRuleController = (req, res) =>{
    res.send("Hello from validateRuleController")

}

const controller = {
    getController,
    validateRuleController,
}

export default controller;