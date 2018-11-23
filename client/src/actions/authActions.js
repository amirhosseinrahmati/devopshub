import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'
import jwt_decode from 'jwt-decode'
import { GET_ERRORS, SET_CURRENT_USER } from './types'

// Register user (sign up)
export const registerUser = (userData, history) => dispatch => {
    axios.post('/api/users/register', userData)
      .then(res => history.push('/login'))
      .catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        }))
    }

// Login - get user token
export const loginUser = userData => dispatch => {
    axios.post('/api/users/login', userData)
        .then(res => {
            // save token to localstorage
            const { token } = res.data
            // set token to localstorage
            localStorage.setItem('jwtToken', token)
            // set token to auth header 
            setAuthToken(token)
            // decode token to get user data
            const decoded = jwt_decode(token)
            // set current user
            dispatch(setCurrentUser(decoded))
        })
        .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        }))
    }

    // Set logged in user 
    export const setCurrentUser = (decoded) => {
        return {
            type: SET_CURRENT_USER,
            payload: decoded
        }
    }

    // Logout the user
    export const logoutUser = () => dispatch => {
        // remove token from localstorage
        localStorage.removeItem('jwtToken')
        // remove auth header from future requests
        setAuthToken(false)
        // set current user to an empty object {} which will set isAuthenticated to false
        dispatch(setCurrentUser({}))
    }