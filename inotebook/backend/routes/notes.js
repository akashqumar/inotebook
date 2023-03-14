const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    const obj = {
        "notes": "akash",
        "age": 21
    }
    res.json(obj);


});

module.exports = router;