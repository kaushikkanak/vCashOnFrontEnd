/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react'
// import { Link } from "react-router-dom";
import { PUT } from '../Common/apiRoute';
import { passwordValidation } from "../Common/helperFunctions"


class Adminchange extends Component {
    state = {
        userDetail: {},
        userUid: "",
        newPass: "",
        confirmPass: "",
        loader: false
    }

    componentDidMount() {
        console.log(this.props.location.state);
        if (this.props.location?.state?.userDetail) {
            this.setState({
                userDetail: this.props.location.state.userDetail,
                userUid: this.props.location.state.userDetail.uid
            })
        }
    }

    handleChange = (e) => {
        let { name, value } = e.target
        this.setState({
            [name]: value,
            passMessage: ""
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        if (this.state.newPass === this.state.confirmPass) {
            let obj = {
                uid: this.state.userUid,
                pswd: this.state.newPass
            }
            console.log(obj);
            if (passwordValidation(this.state.newPass)) {
                this.setState({
                    loader: true
                })
                PUT("users/setpswd", obj)
                    .then(res => {
                        if (res.data.status === 1) {
                            this.setState({
                                successMessage: res.data.message,
                                loader: false
                            }, () => {
                                setTimeout(() => {
                                    this.setState({
                                        successMessage: ""
                                    })
                                    this.props.history.push("/manageadmin")
                                }, 2000)
                            })
                        } else {
                            this.setState({
                                successMessage: res.data.message,
                                loader: false
                            })
                        }
                        console.log(res);
                    })
                    .catch(err => {
                        this.setState({
                            loader: false
                        })
                    })
            } else {
                this.setState({
                    passMessage: "You must complete password conditions !",
                    loader: false
                })
            }

        } else {
            this.setState({
                passMessage: "Password not matched !",
                loader: false
            })
        }

    }


    render() {
        return (
            <>
                <div class="main-content">
                    <div className="header">
                        <div className="container-fluid">
                            <div className="header-body">
                                <div className="row align-items-end">
                                    <div className="col">
                                        <h6 className="header-pretitle"> Overview </h6>
                                        <h1 className="header-title">Change</h1>
                                    </div>
                                    <div className="col-auto display-none">
                                        <a href="#" className="btn btn-primary lift">Add Admin </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="container">
                        <div class="row">
                            <div class="col-12 col-md-12 col-lg-12 col-sm-12 mb-5">
                                <div className="form-group">
                                    <label>Name</label>
                                    <p class="mb-2">{`${this.state.userDetail.firstName} ${this.state.userDetail.lastName}`} </p>
                                </div>
                            </div>
                            <div class="col-12 col-md-12 col-lg-12 col-sm-12 mb-5">
                                <div className="form-group">
                                    <label>Email</label>
                                    <p class="mb-2">{this.state.userDetail.email} </p>
                                </div>
                                <hr class="my-5" />
                            </div>
                        </div>
                        <div class="row">
                            <div className="col-12 col-md-6">
                                <h2 className="text-center text-success">{this.state.successMessage}</h2>
                                <form>
                                    <span className="text-danger">{this.state.passMessage}</span>
                                    <div className="form-group">
                                        <label>
                                            New Password
                                        </label>
                                        <input type="password" className="form-control" name="newPass" onChange={this.handleChange} />
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            Confirm New Password
                                        </label>
                                        <input type="password" className="form-control" name="confirmPass" onChange={this.handleChange} />
                                    </div>
                                    <button className="btn btn-block btn-primary lift" onClick={this.handleSubmit}>
                                        {
                                            this.state.loader
                                                ?
                                                <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                                :
                                                null
                                        }
                                        Update password
                                    </button>
                                </form>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="card bg-light border ml-md-4 mt-5">
                                    <div className="card-body">
                                        <p className="mb-2">Password requirements</p>
                                        <p className="small text-muted mb-2"> To create a new password, you have to meet all of the following requirements: </p>
                                        <ul className="small text-muted pl-4 mb-0">
                                            <li> Minimum 8 character</li>
                                            <li> At least one special character </li>
                                            <li> At least one number </li>
                                            <li> Can’t be the same as a previous password</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Adminchange;