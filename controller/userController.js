const userModel = require('../model/userModel');
const bcrypt = require('bcrypt')
const taskmodel = require('../model/taskModel')


const taskCreated = async function (req, res) {
    let userData = req.body;
    let {title,description } = userData;
    if(!title) return res.status(400).send({status:false,message:"title is required"});
    if(!description) return res.status(400).send({status:false,message:"description is required"});
    let createdData = await taskmodel.create(userData);
    res.status(200).send({ status: true, message: "User created successfully", data: createdData });
}

const userCreated = async function (req, res) {
    let userData = req.body;
    let { name, email, password } = userData;

    name = userData.name = userData.name.trim();
    if (!name) return res.status(400).send({ status: false, message: "Name is required" });

    email = userData.email = userData.email.trim().toLowerCase();
    if (!email) return res.status(400).send({ status: false, message: "email is required" });
    if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) return res.status(400).send({ status: false, message: "Email is not valid" });

    password = userData.password = userData.password.trim();
    if (!password) return res.status(400).send({ status: false, message: "password is required" });
    if (password.length < 8) return res.status(400).send({ status: false, message: "Password should be atleast 8 characters long" });

    const checkEmail = await userModel.findOne({ email: email });
    console.log("checkMail:", checkEmail);
    console.log("____________________")
    if (checkEmail) return res.status(400).send({ status: false, message: "Email already exists" });


    const hashedPassword = await bcrypt.hash(password, 10);
    password = userData.password = hashedPassword;

    let createdData = await userModel.create(userData);
    res.status(200).send({ status: true, message: "User created successfully", data: createdData });
}

const loginUser = async function(req,res){
    let userData = req.body;
    let { email, password } = userData;
    email = userData.email = userData.email.trim();
    if (!email) return res.status(400).send({ status: false, message: "Email is required" });
    password = userData.password = userData.password.trim();
    if (!password) return res.status(400).send({ status: false, message: "Password is required" });
    const user = await userModel.findOne({email:email, isDeleted: false});
    if(!user) return res.status(404).send({status: false, message: "User not found"});
    console.log("password",user.password)
    const match = await bcrypt.compare(password, user.password);
    if(!match) return res.status(400).send({status: false, message: "Incorrect password"});
    res.header('x-api-key', user._id);
    res.status(200).send({status: true, message: "Login successful", data: user});


}

const getUser = async function (req, res) {
    let data = await userModel.find({ isDeleted: false }).select({ password:0, isDeleted:0, createdAt:0, updatedAt:0, __v:0});
    res.status(200).send({ status: true, message: "User details", data: data });
}

const updateData = async function (req, res) {
    let id = req.params.userId;
    if (!id) return res.status(400).send({ status: false, message: "Id is required" });
    let userData = req.body;
    let { name, email, password } = userData;
    if (name) {
        name = userData.name = userData.name.trim();
        if (!name) return res.status(400).send({ status: false, message: "Name is required" });
    }
    if (email) {
        email = userData.email = userData.email.trim();
        if (!email) return res.status(400).send({ status: false, message: "email is required" });
        if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) return res.status(400).send({ status: false, message: "Email is not valid" });
        console.log("email:", email)
        const checkEmail = await userModel.findOne({ email: email });
        console.log("checkMail:", checkEmail);
        if (checkEmail) return res.status(400).send({ status: false, message: "Email already exists" });
    }
    if (password) {
        password = userData.password = userData.password.trim();
        if (!password) return res.status(400).send({ status: false, message: "password is required" });
        if (password.length < 8) return res.status(400).send({ status: false, message: "Password should be atleast 8 characters long" });
        const hashedPassword = await bcrypt.hash(password, 256);
        password = userData.password = hashedPassword;
    }

    let updatedData = await userModel.findOneAndUpdate({ _id: id, isDeleted: false }, userData, { new: true });
    if (!updatedData) return res.status(400).send({ status: false, message: "User not found" });
    res.status(200).send({ status: true, message: "User updated successfully", data: updatedData });
}

const deleteUser = async function (req, res) {
    let id = req.params.userId;
    if (!id) return res.status(400).send({ status: false, message: "Id is required" });
    let data = await userModel.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true }, { new: true });
    if (!data) return res.status(400).send({ status: false, message: "User not found" });
    res.status(200).send({ status: true, message: "User deleted successfully", data: data });
}

module.exports = { userCreated,loginUser, getUser, updateData, deleteUser ,taskCreated}