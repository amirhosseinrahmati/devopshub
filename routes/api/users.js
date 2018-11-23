const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const keys = require('../../config/keys')
const User = require('../../models/User')
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')

//GET api test
router.get('/test', (req, res) => res.json({msg: "users works"}))

//POST api register user
router.post('/register', (req, res) =>{
    const { errors, isValid } = validateRegisterInput(req.body)

    //check validation //
    if(!isValid){
        return res.status(400).json(errors)
    }
    // check if user exist or not //
    User.findOne({ email: req.body.email})
        .then(user =>{
            if(user) {
                errors.email = 'Email already exists'
                return res.status(400).json(errors)
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200', // size of image
                    r: 'pg', //rating for image
                    d: 'mm' //default
                })
                const newUser = new User({
                  name: req.body.name,
                  email: req.body.email,
                  avatar,
                  password: req.body.password  
                })

                bcrypt.genSalt(10, (err, salt) =>{
                    bcrypt.hash(newUser.password, salt, (err, hash) =>{
                        if(err) throw err
                        newUser.password = hash
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))
                    })
                })
            }
        })
})

// POST api / users login, returning json web token
router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body)

    //check validation //
    if(!isValid){
        return res.status(400).json(errors)
    }

    const email = req.body.email
    const password = req.body.password

    // find user by email
    User.findOne({email})
        .then(user =>{
            if(!user) {
                errors.email = 'User not found'
                return res.status(404).json(errors)
            }

            // checking password with bcrypt compare method
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch){
                        // user matched
                        const payload = { id: user.id, name: user.name, avatar: user.avatar} // create jwt payload

                        // sign token
                        jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) =>{
                            res.json({success:true, token: 'Bearer ' + token})
                        })
                    } else {
                        errors.password = 'Password is wrong'
                        return res.status(400).json(errors)
                    }
                })
        })
})

// GET api to return current user token
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    })
})
module.exports = router



