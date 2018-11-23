import React from 'react'
import { Link } from 'react-router-dom'
import './style.css';
export default function NotFound() {
  return (
    <div className="container">
        <div className="row">
        <div className="col-md-12">
        <div className="notfound">
         <div class="notfound-404">
           <h1>4<span></span>4</h1>
         </div>
            <h2>Oops! Page Not Be Found</h2>
            <p>Sorry but the page you are looking for does not exist, have been removed. name changed or is temporarily unavailable</p>
            <Link to="/">Back to homepage</Link>
        </div>
        </div>
        </div>
    </div>

  )
}
