const express = require("express")
const router = express.Router()

const {
    getAllRuns, 
    getRun, 
    createRun, 
    updateRun, 
    deleteRun 
} = require("../controllers/runs")

router.route("/").post(createRun).get(getAllRuns)
router.route("/:id").get(getRun).delete(deleteRun).patch(updateRun)

module.exports = router 