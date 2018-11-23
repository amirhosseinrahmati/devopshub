import React, { Component } from 'react'
import isEmpty from '../../validation/is-empty'
import PropTypes from 'prop-types'
class ProfileAbout extends Component {

  render() {

    const { profile } = this.props

    // spliting out the first name of the user
    const firstName = profile.user.name.trim().split(' ')[0]

    // map the skills array and make the list
    const skills = profile.skills.map((skill, index) => (
      <div key={index} className="p-3">
        <i className="fa fa-check" /> {skill}
      </div>
    ))

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-light mb-3">
            <h3 className="text-center text-info">{firstName}'s Bio</h3>
            <p className="lead">{isEmpty(profile.bio) ? (<i><span>{firstName} does not have a bio</span></i>) : (<i><span>{profile.bio}</span></i>)}
            </p>
            <hr />
            <h3 className="text-center text-info">Skills & Expertise</h3>
            <div className="row">
              <div className="d-flex flex-wrap justify-content-center align-items-center">
                {skills}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired
}

export default ProfileAbout