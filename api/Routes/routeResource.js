import express from "express";
const router = express.Router();

// import the required controller for the respective routes
import controller from "../Controller/contollerResource.js"

// Destructure constituting controllers.
const { getController, validationController } = controller;

// Route for get.
router.get("/", getController)

// Route for validation.
router.post("/validate-rule", validationController)


export default router;
