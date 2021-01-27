import express from "express";
const router = express.Router();

// Assign required controller to respective route.
import controller from "../Controller/contollerResource.js"

// Destructure constituting controllers.
const { getController, validationController } = controller;

// Route for get.
router.get("/", getController)

// Route for validation.
router.post("/validate-rule", validationController)


export default router;
