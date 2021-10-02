const v1 = require('express').Router()

v1.use('/people', require("./people"))
v1.use('/projects', require("./projects"))
v1.use('/compete', require("./compete"))
v1.get('/', (req,res)=>{
    res.send('v1')
})

module.exports = v1;
