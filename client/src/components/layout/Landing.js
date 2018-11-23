import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'

class Landing extends Component {

  // pushing user from Landing "/" to dashboard but i don't do this
  // and just hide the signup/login button from the landing to the loged in user
  // componentDidMount() {
  //   if(this.props.auth.isAuthenticated) {
  //     this.props.history.push('/dashboard')
  //   }
  // }

  render() {

    const notLogedinUser = (
      <div>
        <Link to="/register" className="btn btn-lg btn-outline-primary mr-2">Sign Up</Link>
        <Link to="/login" className="btn btn-lg btn-outline-light ">Login</Link>
      </div>
    )

    const logedinUser = (
      <div>
        <Link to="/dashboard" className="btn btn-lg btn-outline-primary">Dashboard</Link>
      </div>
    )

    return (
        <div className="landing">
        <div className="dark-overlay landing-inner text-light">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h1 className="display-3 mb-4">DevOps Hub, Where developers connected togetherヽ(•‿•)ノ
                </h1>
                <p className="lead"> Create a developer profile/portfolio, share posts and get help from other developers</p>
                {this.props.auth.isAuthenticated ? logedinUser : notLogedinUser}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Landing.propTypes = {
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps)(Landing)
