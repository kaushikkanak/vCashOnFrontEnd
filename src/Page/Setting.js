/* eslint-disable eqeqeq */
import React, { Component } from "react";
import { GET, POST, PUT } from "../Common/apiRoute";
import { passwordValidation } from "../Common/helperFunctions";
// import SideBar from '../Page/SideBar/Sidebar'

class Setting extends Component {
	state = {
		userDetail: {},
		fname: "",
		lname: "",
		phn: "",
		uid: "",
		newPass: "",
		confirmPass: "",
		currentPass: "",
		loader: false,
		roleId: "",
	};
	componentDidMount() {
		this.getUserDetails();
	}
	getUserDetails = () => {
		GET("users/userProfile")
			.then((res) => {
				console.log(res);
				this.setState({
					userDetail: res.data.data,
					fname: res.data.data.firstName,
					lname: res.data.data.lastName,
					phn: res.data.data.phone,
					uid: res.data.data.uid,
					roleId: res.data.data.roleId,
				});
			})
			.catch((err) => console.log(err));
	};

	handleChange = (e) => {
		let { name, value } = e.target;
		this.setState({
			[name]: value,
		});
	};

	handleChangePass = (e) => {
		let { name, value } = e.target;
		this.setState({
			[name]: value,
			passMessage: "",
		});
	};

	changeDetail = (e) => {
		e.preventDefault();
		let obj = "";
		if (this.state.roleId == 9) {
			obj = {
				firstName: this.state.fname,
				lastName: this.state.lname,
				phone: this.state.phn,
			};
		} else {
			obj = { firstName: this.state.fname, lastName: this.state.lname };
		}
		POST("users/updateProfile", obj, { headerStatus: true })
			.then((res) => {
				if (res.data.status == 1) {
					this.getUserDetails();
				} else {
					alert(res.data.datamessage);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	handleSubmit = (e) => {
		console.log("1");
		e.preventDefault();
		if (this.state.newPass === this.state.confirmPass) {
			let obj = {
				uid: this.state.uid,
				currentpassword: this.state.currentPass,
				newpassword: this.state.newPass,
			};
			console.log(obj);
			if (passwordValidation(this.state.newPass)) {
				this.setState({
					loader: true,
				});
				PUT("users/changePswd", obj)
					.then((res) => {
						if (res.data.status === 1) {
							this.setState(
								{
									successMessage: res.data.message,
									loader: false,
								},
								() => {
									setTimeout(() => {
										this.setState({
											successMessage: "",
										});
										this.props.history.push("/user");
									}, 2000);
								}
							);
						} else {
							this.setState({
								successMessage: res.data.message,
								loader: false,
							});
						}
						console.log(res);
					})
					.catch((err) => {
						this.setState({
							loader: false,
						});
					});
			} else {
				this.setState({
					passMessage: "You must complete password conditions !",
					loader: false,
				});
			}
		} else {
			this.setState({
				passMessage: "Password not matched !",
				loader: false,
			});
		}
	};

	render() {
		return (
			// <div className="section">
			//      <SideBar/>
			<div class="main-content">
				<div className="header">
					<div className="container-fluid">
						<div className="header-body">
							<div className="row align-items-end">
								<div className="col">
									<h6 className="header-pretitle">Overview</h6>
									<h1 className="header-title">Settings</h1>
								</div>
								<div className="col-auto display-none">
									<a href="/addbrand" className="btn btn-primary lift">
										Add Brands
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="container">
					<div className="row justify-content-between align-items-center">
						<div class="col-12 col-sm-6 col-lg-6 col-md-6">
							<div className="form-group">
								<label> First Name </label>
								<input
									type="text"
									className="form-control"
									name="fname"
									value={this.state.fname}
									onChange={this.handleChange}
								/>
							</div>
						</div>
						<div class="col-12 col-sm-6 col-lg-6 col-md-6">
							<div className="form-group">
								<label> Last Name </label>
								<input
									type="text"
									className="form-control"
									name="lname"
									onChange={this.handleChange}
									value={this.state.lname}
								/>
							</div>
						</div>
						{this.state.roleId == 9 ? (
							<div class="col-12 col-sm-12 col-lg-12 col-md-12">
								<div className="form-group">
									<label>Phone</label>
									<input
										type="text"
										className="form-control"
										name="phn"
										onChange={this.handleChange}
										value={this.state.phn}
									/>
								</div>
							</div>
						) : (
							""
						)}
						<div class="col-12 col-sm-12 col-lg-12 col-md-12">
							<div className="form-group">
								<label>Email</label>
								<input
									type="email"
									className="form-control text-secondary"
									disabled
									value={this.state.userDetail?.email}
								/>
							</div>
						</div>
						<div class="col-12 col-sm-12 col-lg-12 col-md-12">
							<div className="form-group">
								<label>Password</label>
								<input
									type="Password"
									className="form-control text-secondary"
									disabled
									value={this.state.userDetail?.password}
								/>
							</div>
						</div>
						<div class="col-12">
							<div className="form-group">
								<button class="btn btn-primary" onClick={this.changeDetail}>
									{" "}
									Save{" "}
								</button>
							</div>
							<hr class="my-5"></hr>
						</div>
						<div class="col-12 col-md-9 col-xl-7 mb-5">
							<h2 class="mb-2"> Change your password </h2>
							<p class="text-muted mb-xl-0">
								Changing password will immediately change you password. You will
								need to login with the new password in your next sign-in to the
								dashboard.
							</p>
						</div>
						{/* <div class="col-12 col-xl-auto">
                            <button class="btn btn-white">
                                Forgot your password?
                                    </button>
                        </div> */}
						<div className="col-12 col-md-6 order-md-2 mb-4">
							<h2 className="text-center text-success">
								{this.state.successMessage}
							</h2>
							<div className="card bg-light border ml-md-4">
								<span className="text-danger">{this.state.passMessage}</span>
								<div className="card-body">
									<p className="mb-2">Password requirements</p>
									<p className="small text-muted mb-2">
										To create a new password, you have to meet all of the
										following requirements:
									</p>
									<ul className="small text-muted pl-4 mb-0">
										<li>Minimum 8 character</li>
										<li>At least one special character</li>
										<li>At least one number</li>
										<li>Can’t be the same as a previous password</li>
									</ul>
								</div>
							</div>
						</div>
						<div className="col-12 col-md-6  mb-4">
							<form>
								<div className="form-group">
									<label>Current Password</label>
									<input
										type="password"
										className="form-control"
										name="currentPass"
										onChange={this.handleChange}
									/>
								</div>
								<div className="form-group">
									<label>New password</label>
									<input
										type="password"
										className="form-control"
										name="newPass"
										onChange={this.handleChange}
									/>
								</div>
								<div className="form-group">
									<label>Confirm new password</label>
									<input
										type="password"
										className="form-control"
										name="confirmPass"
										onChange={this.handleChange}
									/>
								</div>
								<button
									className="btn btn-block btn-primary lift"
									onClick={this.handleSubmit}
								>
									{this.state.loader ? (
										<span
											class="spinner-grow spinner-grow-sm"
											role="status"
											aria-hidden="true"
										></span>
									) : null}
									Update password
								</button>
							</form>
						</div>
					</div>
				</div>

				<footer class="d-md-none d-block navbar-dark navbar-vibrant py-4">
					<div class="container-fluid">
						<p class="d-block text-white text-center mb-0 opacity-8 font-sm">
							{/* <span class="mr-2">
								<img
									className="navbar-brand-img mx-auto"
									src={require("../assets/img/test-white-logo.svg")}
									alt="..."
								/>
							</span>
							<span class="position-relative top-4">
								Copyright © {new Date().getFullYear()} test.All Rights
								Reserved.
							</span> */}
						</p>
					</div>
				</footer>
			</div>
			// </div>
		);
	}
}

export default Setting;
