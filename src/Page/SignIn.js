import React, { Component } from "react";
import { Link } from "react-router-dom";
import { GET, POST } from "../Common/apiRoute";

class SignIn extends Component {
	state = {
		email: "",
		password: "",
		fieldValidation: "",
		serverError: "",
		passEye: "password",
		serverErrorClass: "",
	};

	componentDidMount() {
		if (localStorage.getItem("token")) {
			GET("users/userDetail")
				.then((res) => {
					if (
						res.data.status === 1 &&
						res.data.data.isActive &&
						res.data.data.roleId === 4
					) {
						if (res.data.data.roleId === 4) {
							this.props.history.push("/userbrand");
						} else {
							this.props.history.push("/user");
						}
					} else {
						localStorage.clear();
					}
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}

	handleChange = (e) => {
		let { name, value } = e.target;
		this.setState({
			[name]: value,
		});
	};

	handleSubmit = (e) => {
		e.preventDefault();
		let { email, password } = this.state;
		let obj = {
			email: email,
			pswd: password,
		};
		if (password !== "" && email !== "") {
			POST("users/admnlogin", obj)
				.then((res) => {
					if (res.data.status === 1) {
						console.log(res.data.roleId);
						localStorage.setItem("token", res.data.token);
						if (res.data.roleId === 4) {
							this.props.history.push("/userbrand");
						} else {
							this.props.history.push("/user");
						}
					} else {
						this.setState(
							{
								serverError: res.data.message,
								serverErrorClass:
									"text-center alert alert-danger sign-alert fade show",
							},
							() => {
								setTimeout(() => {
									this.setState({
										serverError: "",
									});
								}, 2000);
							}
						);
					}
				})
				.catch((err) => {
					this.setState({
						serverError: "Network Error!",
						serverErrorClass: "text-center text-danger",
					});
				});
		} else {
			this.setState({
				fieldValidation: "Field Required*",
			});
		}
	};

	passEye = (e) => {
		if (this.state.passEye === "password") {
			this.setState({
				passEye: "text",
			});
		} else {
			this.setState({
				passEye: "password",
			});
		}
	};

	render() {
		return (
			<>
				<div class="border-top border-top-2 border-primary">
					<div className="container transform-center">
						{this.state.serverError ? (
							<div className={this.state.serverErrorClass}>
								<h2 class="mb-0">{this.state.serverError}</h2>
							</div>
						) : null}
						<div className="row justify-content-center">
							<div className="col-12 col-md-5 col-xl-4 my-5">
								<h1 className="display-4 text-center mb-3">Sign in</h1>

								<p className="text-muted text-center mb-5">
									Access TEST service management dashboard.
								</p>
								<form>
									<div className="form-group text-left">
										<label>Email Address</label>
										<input
											type="email"
											name="email"
											className="form-control"
											placeholder="Name@address.com"
											onChange={this.handleChange}
										/>
										{this.state.email === "" ? (
											<span className="text-danger">
												{this.state.fieldValidation}
											</span>
										) : null}
									</div>
									<div className="form-group text-left">
										<div className="row">
											<div className="col">
												<label>Password</label>
											</div>
											{/* <div className="col-auto">
                                                <a href="/Password" className="form-text small text-muted">
                                                    Forgot password?
                                            </a>
                                            </div> */}
										</div>
										<div className="input-group input-group-merge">
											<input
												type={this.state.passEye}
												name="password"
												className="form-control form-control-appended"
												placeholder="Enter your password"
												onChange={this.handleChange}
											/>

											<div className="input-group-append">
												<span
													className="input-group-text"
													onClick={(e) => this.passEye(e)}
												>
													<Link>
														<i className="fe fe-eye" />
													</Link>
												</span>
											</div>
										</div>
										{this.state.password === "" ? (
											<span className="text-danger">
												{this.state.fieldValidation}
											</span>
										) : null}
									</div>

									<button
										className="btn btn-lg btn-block btn-primary mb-3"
										onClick={this.handleSubmit}
									>
										Sign in
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default SignIn;
