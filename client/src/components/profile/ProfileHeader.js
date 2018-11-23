import React, { Component } from 'react'
import isEmpty from '../../validation/is-empty';

class ProfileHeader extends Component {
  render() {
    const { profile } = this.props

    return (
      <div className="row">
      <div className="col-md-12">
        <div className="card card-body bg-dark text-white mb-3">
          <div className="row">
            <div className="col-4 col-md-3 m-auto">
              <img className="rounded-circle" src={profile.user.avatar} alt={profile.user.name} />
            </div>
          </div>
          <div className="text-center">
            <h1 className="display-4 text-center">{profile.user.name}</h1>
            <p className="lead text-center">{profile.status} at {isEmpty(profile.company) ? null : (<i><span>{profile.company}</span></i>)}</p>
            {isEmpty(profile.location) ? null : (<i><p>{profile.location}</p></i>)}
            <p>
              {isEmpty(profile.website) ? null : (
                <a className="text-white p-2" href={profile.website} target="_blank" rel="noopener noreferrer">
                  <i className="fas fa-globe fa-2x"></i>
                </a>
              )}

              {isEmpty(profile.social && profile.social.twitter) ? null : (
                <a className="text-white p-2" href={profile.social.twitter} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-twitter fa-2x"></i>
                </a>
              )}

              {isEmpty(profile.social && profile.social.facebook) ? null : (
                <a className="text-white p-2" href={profile.social.facebook} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-facebook fa-2x"></i>
                </a>
              )}

              {isEmpty(profile.social && profile.social.linkedin) ? null : (
                <a className="text-white p-2" href={profile.social.linkedin} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-linkedin fa-2x"></i>
                </a>
              )}

              {isEmpty(profile.social && profile.social.instagram) ? null : (
                <a className="text-white p-2" href={profile.social.instagram} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram fa-2x"></i>
                </a>
              )}

              {isEmpty(profile.social && profile.social.youtube) ? null : (
                <a className="text-white p-2" href={profile.social.youtube} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-youtube fa-2x"></i>
                </a>
              )}

            </p>
          </div>
        </div>
      </div>
    </div>
    )
  }
}

export default ProfileHeader