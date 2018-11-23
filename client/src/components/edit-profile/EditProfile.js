import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import TextFieldGroup from '../common/TextFieldGroup'
import TextAreaFieldGroup from '../common/TextAreaFieldGroup'
import InputGroup from '../common/InputGroup'
import SelectListGroup from '../common/SelectListGroup'
import { createProfile, getCurrentProfile } from '../../actions/profileActions'
import isEmpty from '../../validation/is-empty'


class CreateProfile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            displaySocialInputs: false,
            handle: '',
            company: '',
            website: '',
            location: '',
            status: '',
            skills: '',
            githubusername: '',
            bio: '',
            twitter: '',
            facebook: '',
            linkedin: '',
            youtube: '',
            instagram: '',
            errors: {}
        }

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    componentDidMount() {
        this.props.getCurrentProfile()
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.errors) {
            this.setState({errors: nextProps.errors})
        }

        if(nextProps.profile.profile) {
            const profile = nextProps.profile.profile

            // bring skills array back to comma seprated value
            const skillsCSV = profile.skills.join(',')

            // if profile fields does not exist, make them empty strings
            profile.company = !isEmpty(profile.company) ? profile.company : ''
            profile.website = !isEmpty(profile.website) ? profile.website : ''
            profile.location = !isEmpty(profile.location) ? profile.location : ''
            profile.githubusername = !isEmpty(profile.githubusername) ? profile.githubusername : ''
            profile.bio = !isEmpty(profile.bio) ? profile.bio : ''
            profile.social = !isEmpty(profile.social) ? profile.social : {}
            profile.twitter = !isEmpty(profile.social.twitter) ? profile.social.twitter : ''
            profile.facebook = !isEmpty(profile.social.facebook) ? profile.social.facebook : ''
            profile.linkedin = !isEmpty(profile.social.linkedin) ? profile.social.linkedin : ''
            profile.youtube = !isEmpty(profile.social.youtube) ? profile.social.youtube : ''
            profile.instagram = !isEmpty(profile.social.instagram) ? profile.social.instagram : ''

            // set component fields state
            this.setState({
                handle: profile.handle,
                company: profile.company,
                website: profile.website,
                location: profile.location,
                status: profile.status,
                skills: skillsCSV,
                githubusername: profile.githubusername,
                bio: profile.bio,
                twitter: profile.twitter,
                facebook: profile.facebook,
                linkedin: profile.linkedin,
                youtube: profile.youtube,
                instagram: profile.instagram
            })
        }
    }

    onSubmit(e) {
        e.preventDefault()

        const profileData = {
            handle: this.state.handle,
            company: this.state.company,
            website: this.state.website,
            location: this.state.location,
            status: this.state.status,
            skills: this.state.skills,
            githubusername: this.state.githubusername,
            bio: this.state.bio,
            twitter: this.state.twitter,
            facebook: this.state.facebook,
            linkedin: this.state.linkedin,
            youtube: this.state.youtube,
            instagram: this.state.instagram
        }

        this.props.createProfile(profileData, this.props.history)
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }
    
    render() {
      const { errors, displaySocialInputs } = this.state

      let socialInputs

      if(displaySocialInputs) {
        socialInputs = (
            <div>
                <InputGroup
                  placeholder="Twitter Profile URL"
                  name="twitter"
                  icon="fab fa-twitter"
                  value={this.state.twitter}
                  onChange={this.onChange}
                  error={errors.twitter}
                />
                <InputGroup
                  placeholder="Facebook Page URL"
                  name="facebook"
                  icon="fab fa-facebook"
                  value={this.state.facebook}
                  onChange={this.onChange}
                  error={errors.facebook}
                />
                <InputGroup
                  placeholder="Linkedin Profile URL"
                  name="linkedin"
                  icon="fab fa-linkedin"
                  value={this.state.linkedin}
                  onChange={this.onChange}
                  error={errors.linkedin}
                />
                <InputGroup
                  placeholder="YouTube Channel URL"
                  name="youtube"
                  icon="fab fa-youtube"
                  value={this.state.youtube}
                  onChange={this.onChange}
                  error={errors.youtube}
                />
                <InputGroup
                  placeholder="Instagram Page URL"
                  name="instagram"
                  icon="fab fa-instagram"
                  value={this.state.instagram}
                  onChange={this.onChange}
                  error={errors.instagram}
                />
            </div>
        )
      }

      // select options for status
      const options = [
          { label: '* Select professional status', value: 0 },
          { label: 'Developer', value: 'Developer'},
          { label: 'Junior Developer', value: 'Junior Developer'},
          { label: 'Senior Developer', value: 'Senior Developer'},
          { label: 'DevOps', value: 'DevOps'},
          { label: 'Freelance Developer', value: 'Freelance Developer'},
          { label: 'Manager', value: 'Manager'},
          { label: 'Project Manager', value: 'Project Manager'},
          { label: 'Student or Learning', value: 'Student or Learning'},
          { label: 'Instructor or Teacher', value: 'Instructor or Teacher'},
          { label: 'Intern', value: 'Intern'},
          { label: 'Other', value: 'Other'}
      ]

      return (
        <div className="create-profile">
            <div className="container">
                <div className="col-md-8 m-auto">
                    <Link to="/dashboard" className="btn btn-light">
                      Go Back
                    </Link>
                    <h1 className="display-4 text-center">Edit Your Profile</h1>
                    <small className="d-block pb-3">* = required fields</small>
                    <form onSubmit={this.onSubmit}>
                      <TextFieldGroup
                        placeholder="* Profile Handle"
                        name="handle"
                        value={this.state.handle}
                        onChange={this.onChange}
                        error={errors.handle}
                        info="A unique handle for your profile URL. Full name, company name, nickname and etc."
                      />
                      <SelectListGroup
                        placeholder="Status"
                        name="status"
                        value={this.state.status}
                        onChange={this.onChange}
                        options={options}
                        error={errors.status}
                        info="Give us an idea of where you are at in your career."
                      />
                      <TextFieldGroup
                        placeholder="Company"
                        name="company"
                        value={this.state.company}
                        onChange={this.onChange}
                        error={errors.company}
                        info="Company name where you are there."
                      />
                      <TextFieldGroup
                        placeholder="Website"
                        name="website"
                        value={this.state.website}
                        onChange={this.onChange}
                        error={errors.website}
                        info="Could be your own personal website or a company one."
                      />
                      <TextFieldGroup
                        placeholder="Location"
                        name="location"
                        value={this.state.location}
                        onChange={this.onChange}
                        error={errors.location}
                        info="City or city & country suggested (eg. Tabriz, Iran)."
                      />
                      <TextFieldGroup
                        placeholder="* Skills"
                        name="skills"
                        value={this.state.skills}
                        onChange={this.onChange}
                        error={errors.skills}
                        info="Use comma seprated values (eg. Javascript,Node.js,React,Angular)."
                      />
                      <TextFieldGroup
                        placeholder="Github Username"
                        name="githubusername"
                        value={this.state.githubusername}
                        onChange={this.onChange}
                        error={errors.githubusername}
                        info="If you want your latest repos and a Github link, include your username."
                      />
                      <TextAreaFieldGroup
                        placeholder="Short Bio"
                        name="bio"
                        value={this.state.bio}
                        onChange={this.onChange}
                        error={errors.bio}
                        info="Tell us a little about yourself and your career."
                      />

                      <div className="mb-3">
                        <button type="button"
                            onClick={() => {
                            this.setState(prevState => ({
                                displaySocialInputs: !prevState.displaySocialInputs
                            }))
                        }} className="btn btn-secondary">
                        Add Social Network Links
                        </button>
                        <span style={{marginLeft: '5px'}} className="text-muted">Optional</span>
                      </div>
                      {socialInputs}
                      <input type="submit" value="Edit / Update" className="btn btn-info btn-block mt-4"/>
                    </form>
                </div>  
            </div>
        </div>
      )
    }
}

CreateProfile.propTypes = {
    createProfile: PropTypes.func.isRequired,
    getCurrentProfile: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile,
    errors: state.errors
})

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(withRouter(CreateProfile))
