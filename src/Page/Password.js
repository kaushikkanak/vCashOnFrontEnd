import React, { Component } from 'react'
// import { Link } from "react-router-dom";


class Password extends Component {
  render() {
    return (
      <>
        <div className="container transform-center">
          <div className="row justify-content-center">
            <div className="col-12 col-md-5 col-xl-4 my-5">
              {/* Heading */}
              <h1 className="display-4 text-center mb-3">
                Password reset
          </h1>
              {/* Subheading */}
              <p className="text-muted text-center mb-5">
                Enter your email to get a password reset link.
          </p>
              {/* Form */}
              <form>
                {/* Email address */}
                <div className="form-group">
                  {/* Label */}
                  <label>Email Address</label>
                  {/* Input */}
                  <input type="email" className="form-control" placeholder="name@address.com" />
                </div>
                {/* Submit */}
                <button className="btn btn-lg btn-block btn-primary mb-3">
                  Reset Password
            </button>
                {/* Link */}
                <div className="text-center">
                  <small className="text-muted text-center">
                    Remember your password? <a href="sign-in.html">Log in</a>.
              </small>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Password;