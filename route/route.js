const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.post('/create', userController.userCreated);
router.post('/login', userController.loginUser);
router.get("/users", userController.getUser);
router.put("/user/:userId",userController.updateData);
router.delete("/user/:userId",userController.deleteUser);

router.post("/task", userController.taskCreated);

router.all("/*" , function(req, res){
    res.status(400).send({status:false, message:"Invalid request"});
})
module.exports = router; 