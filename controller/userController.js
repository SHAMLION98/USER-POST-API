const userModel = require("../model/userModel")
const bcrypt = require('bcryptjs')

const register = async (req, res) => {
    const {username, gmail, password} = req.body
    if (!username || !gmail || !password) {
        return res.json({MSG: "Enter all input"}).status(404)
    }
    try {
        const user = await userModel.findOne({gmail})
    if (user) {
        return res.json({MSG: 'User already exist'}).status(409)
    }
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)
    
    const newUser = new userModel({...req.body, password: hashedPassword})
        await newUser.save()
        res.json({user: newUser})
    } catch (error) {
        console.log(error)
    }
}

const userLogin = async (req,res) => {
    const { gmail, password } = req.body
    try{
        const user = await userModel.findOne({gmail})
        if (!user) {
            return res.json({MSG: "Gmail or Password Incorrect!"})
        }
        const comparePass = await bcrypt.compare(password, user.password)
        if (!comparePass) {
            res.json({MSG: 'Gmail or Password Incorrect!'}).status(404)
        }
        const token = tokengenerated(user._id)
        const {password: _, ...userData} = user.toObject()

        res
        .cookie('token', token, {httpOnly: true, sameSite: 'strict'})
        .status(200)
        .json({user: userData})
    } catch (error) {
        console.log(error)
    }
}

const allUsers = async (req, res) => {
    const users= await userModel.find()
    if (!users) {
        res.json({MSG: 'No User Found'})
    }
    res.json({users: users}).status(200)
}

const delete_A_User = async (req, res) => {
    const paraId = areq.params.id
    const tokenId = req.user.id

if (paraId === tokenId) {
    try {
    await userModel.findIdAndDelete(paraId)
    res.json({MSG: 'User Deleted Successflly'}).status(200)
} catch (error) {
    console.log(error)
} 
} else {
    return res.json({MSG: 'You can delete your account alone'}.status(404))
}}

const update_A_User = async (req, res) => {
    const paraId = req.params.id
    const token = req.user.id
    const body = req.body

    if (paraId === tokenId) {
        try {
            const updatedUser = userModel.findByIdAndUpdate(paraId, {$set: body}, {new: true})
        res.json({user: updatedUser}).status(200)
        } catch (error){
            console.log(error)        
    }
    } else {
    return res.json({MSG: 'You can on'})
}
    


}



    


module.exports = {register, userLogin, allUsers, delete_A_User, update_A_User}