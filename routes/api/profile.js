const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')
// Validations
const validateProfileInput = require('../../validation/profile')
const validateExperinceInput = require('../../validation/experience')
const validateEducationInput = require('../../validation/education')

// profile model from mongoose
const Profile = require('../../models/Profile')
// user model from mongoose
const User = require('../../models/User')

// GET request for profile testing - public
router.get('/test', (req, res)=> res.json({msg: "profile works"}))

// GET request to get current user profile - private
router.get('/', passport.authenticate('jwt', { session: false}), (req, res) => {
    const errors = {}
    Profile.findOne({ user: req.user.id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile) {
                errors.noprofile = 'There is no profile for this user'
                return res.status(404).json(errors)
            }
            res.json(profile)
        })
        .catch(err => res.status(404).json(err))
})

// POST request to create or edit current user profile - private
router.post('/', passport.authenticate('jwt', { session: false}),
    (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body)

    // Check validation
    if(!isValid) {
        // return any errors with 400 status
        return res.status(400).json(errors)
    }
    // get profile fields
    const profileFields = {}
    profileFields.user = req.user.id
    if(req.body.handle) profileFields.handle = req.body.handle
    if(req.body.company) profileFields.company = req.body.company
    if(req.body.website) profileFields.website = req.body.website
    if(req.body.location) profileFields.location = req.body.location
    if(req.body.bio) profileFields.bio = req.body.bio
    if(req.body.status) profileFields.status = req.body.status
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername

    // Skills splited into arrays
    if(typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(',')
    }

    // profile social networks
    profileFields.social = {}
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram

    //checking profile that exist or not
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if(profile) {
                // profile exist. so this is UPDATING of profile
                Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })
                    .then(profile => res.json(profile))
            } else {
                // CREATING profile

                // check if handle exists
                Profile.findOne({ handle: profileFields.handle })
                    .then(profile => {
                        if(profile) {
                            errors.handle = 'That handle already exist'
                            res.status(400).json(errors)
                        }

                        // Save profile
                        new Profile(profileFields).save().then(profile => res.json(profile))
                    })
            }
        })
})

// GET request api/profile/all - get all profiles - public
router.get('/all', (req, res) => {
    const errors = {}
    Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
        if(!profiles) {
            errors.noprofile = 'There are no profiles'
            return res.status(404).json(errors)
        }
        res.json(profiles)
    })
    .catch(err => res.status(404).json({ profile: 'There are no profiles'}))
})
// GET request - api/profile/handle/:handle - get profile by handle - public
router.get('/handle/:handle', (req, res) => {
    const errors = {}

    Profile.findOne({ handle: req.params.handle })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile) {
                errors.noprofile = 'There is no profile for this user'
                res.status(404).json(errors)
            }

            res.json(profile)
        })
        .catch(err => res.status(404).json(err))
})

// GET request - api/profile/user/:user_id - get profile by user id - public
router.get('/user/:user_id', (req, res) => {
    const errors = {}

    Profile.findOne({ user: req.params.user_id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile) {
                errors.noprofile = 'There is no profile for this user'
                res.status(404).json(errors)
            }

            res.json(profile)
        })
        .catch(err => res.status(404).json({profile: 'There is no profile for this user'}))
})

// POST request - api/profile/experience - add experience to profile - private
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateExperinceInput(req.body)
    // check validation
    if(!isValid) {
        // return any errors with 404 status
        return res.status(404).json(errors)
    }

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }

            // add to experince array
            profile.experience.unshift(newExp)
            profile.save().then(profile => res.json(profile))
        })
})

// POST request - api/profile/education - add education to profile - private
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body)
    // check validation
    if(!isValid) {
        // return any errors with 404 status
        return res.status(404).json(errors)
    }
    
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            const newEdu = {
                school: req.body.school,
                degree: req.body.degree,
                fieldofstudy: req.body.fieldofstudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }

            // add to experince array
            profile.education.unshift(newEdu)
            profile.save().then(profile => res.json(profile))
        })
})

// DELETE request - api/profile/experience/:exp_id - Delete an experience from profile - private
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {    
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            // Get remove index
            const removeIndex = profile.experience.map(item => item.id)
                .indexOf(req.params.exp_id)

            // splice the index out of the array
            profile.experience.splice(removeIndex, 1)

            // save the profile after removing the index
            profile.save().then(profile => res.json(profile))
        })
        .catch(err => res.status(404).json(err))
})

// DELETE request - api/profile/education/:edu_id - Delete an education from profile - private
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {    
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            // Get remove index
            const removeIndex = profile.education
                .map(item => item.id)
                .indexOf(req.params.edu_id)

            // splice the index out of the array
            profile.education.splice(removeIndex, 1)

            // save the profile after removing the index
            profile.save().then(profile => res.json(profile))
        })
        .catch(err => res.status(404).json(err))
})

// DELETE request - api/profile - Delete user and profile - private
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {    
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
        User.findOneAndRemove({ _id: req.user.id}).then(() => 
            res.json({ success: true})
        )
    })
})
module.exports = router