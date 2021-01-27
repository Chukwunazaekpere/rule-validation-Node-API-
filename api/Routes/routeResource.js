import express from "express";
const router = express.Router();


import controller from "../Controller/contollerResource.js"

const { getController, validateRuleController } = controller;

router.get("/", getController)

router.post("/validate-rule", validateRuleController)


export default router;
