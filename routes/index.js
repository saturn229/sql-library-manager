const express = require('express');
const router = express.Router();

/* Redirects localhost to the homepage */
router.get('/', (req,res) => {
    res.redirect('/books')
})


module.exports = router;
