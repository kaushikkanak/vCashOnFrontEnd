/* eslint-disable eqeqeq */
import React, { Component } from "react";
// import SideBar from "../Page/SideBar/Sidebar";
import { POST, GET, PUT } from "../Common/apiRoute";
import Select from "react-select";
const options = [
	{ value: "1", label: "Male" },
	{ value: "2", label: "Female" },
	{ value: "3", label: "Other" },
];

const optionsType = [
	// { value: "0", label: "Select Account Type" },
	{ value: "9", label: "Administrator Login" },
	{ value: "4", label: "Brand Login" },
];

class Addadmin extends Component {
	state = {
		fname: "",
		lname: "",
		email: "",
		pswd: "",
		gender: "",
		fieldValidation: "",
		serverError: "",
		loader: false,
		selectedOption: null,
		selectedOptiontype: null,
		type: 0,
		brands: [],
		selectedOptionbrand: null,
		id: "",
	};

	componentDidMount() {
		let id = window?.location?.search?.split("?")?.[1];
		this.getBrandsList(id);
		if (id) {
			this.setState({ id });
		}
	}

	getAccountDetails = (id) => {
		GET(`users/getUserById?uid=${id}`)
			.then((res) => {
				// console.log("res =:  ", res.data)
				let data = res.data?.data;
				let brandValue = res.data?.data1?.brandUid;
				let gen = "";
				let type = "";
				let brand = "";
				options.forEach((item) => {
					if (item.value == data?.gender) {
						gen = item;
					}
				});
				optionsType.forEach((item) => {
					if (item.value == data?.roleId) {
						type = item;
					}
				});
				this.state.brands.forEach((item) => {
					if (item?.uid == brandValue) {
						brand = { value: item.uid, label: item.name };
					}
				});
				if (data) {
					this.setState({
						fname: data?.firstName,
						lname: data?.lastName,
						email: data?.email,
						gender: data?.gender,
						pswd: data?.password,
						selectedOption: gen,
						selectedOptiontype: type,
						type: data?.roleId,
						selectedOptionbrand: brand,
					});
				}
			})
			.catch((err) => console.log(err));
	};

	getBrandsList = (id) => {
		GET("brands/brands?lang=en")
			.then((res) => {
				this.setState(
					{
						brands: res.data.data,
					},
					() => {
						if (id) {
							this.getAccountDetails(id);
						}
					}
				);
			})
			.catch((err) => {
				console.log(err);
				if (id) {
					this.getAccountDetails(id);
				}
			});
	};

	handleChange = async (e) => {
		if (e?.value) {
			await this.setState({
				gender: parseInt(e.value),
				selectedOption: e,
			});
		} else {
			let { name, value } = e.target;
			await this.setState({
				[name]: value,
			});
		}
	};

	handleChangebrand = (e) => {
		if (e?.value) {
			this.setState({
				selectedOptionbrand: e,
			});
		}
	};

	handleChangeType = (e) => {
		if (e?.value) {
			this.setState({
				type: parseInt(e.value),
				selectedOptiontype: e,
			});
		}
	};

	handleSubmit = (e) => {
		e.preventDefault();
		let { fname, lname, email, pswd, gender, selectedOptionbrand } = this.state;
		let check =
			this.state.type === 9 ? true : selectedOptionbrand?.value ? true : false;
		if (
			fname !== "" &&
			lname !== "" &&
			email !== "" &&
			pswd !== "" &&
			gender !== "" &&
			check
		) {
			this.setState({
				loader: true,
			});

			let obj = {
				fname: fname,
				lname: lname,
				email: email,
				pswd: pswd,
				gender: gender,
				roleId: this.state.type,
				brandUid: this.state.type === 4 ? selectedOptionbrand?.value : "",
			};
			POST("users/admnuser", obj, { headerStatus: true })
				.then((res) => {
					if (res.data.status === 1) {
						this.setState(
							{
								serverError: res.data.message,
							},
							() => {
								setTimeout(() => {
									this.props.history.push("/manageadmin");
								}, 2000);
							}
						);
					} else {
						this.setState({
							serverError: res.data.message,
							loader: false,
						});
					}
				})
				.catch((err) => {
					this.setState({
						loader: false,
					});
				});
		} else {
			this.setState({
				fieldValidation: "Field Required*",
				loader: false,
			});
		}
	};

	handleUpdate = (e) => {
		e.preventDefault();
		let { fname, lname, gender, selectedOptionbrand } = this.state;
		let check =
			this.state.type === 9 ? true : selectedOptionbrand?.value ? true : false;
		if (fname !== "" && lname !== "" && gender !== "" && check) {
			this.setState({
				loader: true,
			});

			let obj = {
				fname: fname,
				lname: lname,
				gender: gender,
				role: this.state.type,
				brand: this.state.type === 4 ? selectedOptionbrand?.value : "",
				uid: this.state.id,
			};
			PUT("users/updateUserProfile", obj, { headerStatus: true })
				.then((res) => {
					if (res.data.status === 1) {
						this.setState(
							{
								serverError: res.data.message,
							},
							() => {
								setTimeout(() => {
									this.props.history.push("/manageadmin");
								}, 2000);
							}
						);
					} else {
						this.setState({
							serverError: res.data.message,
							loader: false,
						});
					}
				})
				.catch((err) => {
					this.setState({
						loader: false,
					});
				});
		} else {
			this.setState({
				fieldValidation: "Field Required*",
				loader: false,
			});
		}
	};

	render() {
		let Brandsoptions = this.state.brands.map((item) => {
			return { value: item.uid, label: item.name };
		});

		return (
			<div class="main-content">
				<div className="header">
					<div className="container-fluid">
						<div className="header-body">
							<div className="row align-items-end">
								<div className="col">
									<h6 className="header-pretitle">Overview</h6>
									<h1 className="header-title">Add new Account</h1>
								</div>
								<div className="col-auto display-none">
									<a href="/addadmin" className="btn btn-primary lift">
										Add Admin
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="container">
					<div className="form-group">
						<label>Type</label>
						<Select
							className=""
							value={this.state.selectedOptiontype}
							onChange={this.handleChangeType}
							options={optionsType}
							placeholder="Select Account Type"
						/>
						{!this.state.selectedOptiontype?.value ? (
							<span className="text-danger">{this.state.fieldValidation}</span>
						) : null}
					</div>
				</div>
				{this.state.type !== 0 ? (
					<div className="container">
						<div className="row">
							<div className="col-12">
								<form>
									<div className="row">
										<div class="col-12 col-sm-6 col-md-6 col-lg-6">
											<div className="form-group">
												<label>First Name</label>
												<input
													type="text"
													name="fname"
													className="form-control"
													placeholder="First name"
													value={this.state.fname}
													onChange={this.handleChange}
												/>
												{this.state.fname === "" ? (
													<span className="text-danger">
														{this.state.fieldValidation}
													</span>
												) : null}
											</div>
										</div>
										<div class="col-12 col-sm-6 col-md-6 col-lg-6">
											<div className="form-group">
												<label>Last Name</label>
												<input
													type="text"
													name="lname"
													value={this.state.lname}
													className="form-control"
													placeholder="Last name"
													onChange={this.handleChange}
												/>
												{this.state.lname === "" ? (
													<span className="text-danger">
														{this.state.fieldValidation}
													</span>
												) : null}
											</div>
										</div>
										<div class="col-12">
											{" "}
											<hr class="mb-5 mt-3" />
										</div>
										<div class="col-12">
											<div className="form-group">
												<label>Email</label>
												<input
													type="Email"
													name="email"
													value={this.state.email}
													disabled={this.state.id}
													className="form-control"
													onChange={this.handleChange}
												/>
												{this.state.email === "" ? (
													<span className="text-danger">
														{this.state.fieldValidation}
													</span>
												) : null}
											</div>
											<hr class="my-5" />
										</div>
										<div class="col-12">
											<div className="form-group">
												<label>Password</label>
												<input
													type="password"
													value={this.state.pswd}
													disabled={this.state.id}
													name="pswd"
													className="form-control"
													onChange={this.handleChange}
												/>
												{this.state.pswd === "" ? (
													<span className="text-danger">
														{this.state.fieldValidation}
													</span>
												) : null}
											</div>
											<hr class="my-5" />
										</div>
										<div class="col-12">
											<div className="form-group">
												<label>Gender</label>
												<Select
													className=""
													value={this.state.selectedOption}
													onChange={this.handleChange}
													options={options}
												/>
												{this.state.gender === "0" || !this.state.gender ? (
													<span className="text-danger">
														{this.state.fieldValidation}
													</span>
												) : null}
											</div>
											<hr class="my-5" />
										</div>
										{this.state.type === 4 && (
											<div class="col-12">
												<div className="form-group">
													<label>Brand</label>
													<Select
														className=""
														value={this.state.selectedOptionbrand}
														onChange={this.handleChangebrand}
														options={Brandsoptions}
													/>
													{!this.state.selectedOptionbrand?.value ? (
														<span className="text-danger">
															{this.state.fieldValidation}
														</span>
													) : null}
												</div>
												<hr class="my-5" />
											</div>
										)}
										<div class="col-12 text-center">
											{this.state.serverError ? (
												<div className="text-center text-info mt-0">
													<h2>{this.state.serverError}</h2>
												</div>
											) : null}

											<div className="form-group ">
												<button
													className="btn btn-primary mr-3"
													onClick={
														this.state.id
															? this.handleUpdate
															: this.handleSubmit
													}
												>
													{this.state.loader ? (
														<span
															class="spinner-grow spinner-grow-sm"
															role="status"
															aria-hidden="true"
														></span>
													) : null}
													{this.state.id ? "Update Account" : "Create Account"}
												</button>
												<button
													className="btn btn-outline-primary"
													onClick={() =>
														this.props.history.push("/manageadmin")
													}
												>
													Cancel
												</button>
											</div>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
				) : null}
				<footer class="d-md-none d-block navbar-dark navbar-vibrant py-4">
					<div class="container-fluid">
						<p class="d-block text-white text-center mb-0 opacity-8 font-sm">
							<span class="mr-2">
								{/* <img
									className="navbar-brand-img mx-auto"
									src={require("../assets/img/TEST-white-logo.svg")}
									alt="..."
								/> */}
							</span>
							<span class="position-relative top-4">
								Copyright © {new Date().getFullYear()} All Rights Reserved.
							</span>
						</p>
					</div>
				</footer>
			</div>
		);
	}
}

export default Addadmin;
