import React, { Component } from "react";
import { POST, PUT } from "../Common/apiRoute";
// import SideBar from '../Page/SideBar/Sidebar'
import { Link } from "react-router-dom";

class Createcategory extends Component {
	state = {
		name: {
			en: "",
			ar: "",
		},
		serverError: "",
		categoryUid: "",
		ValidError: "",
		loader: false,
	};

	componentDidMount() {
		if (this.props.location.state !== undefined) {
			let { name, uid } = this.props.location.state.CategoryDetail;
			this.setState({
				name: {
					...this.state.name,
					en: name.en,
					ar: name.ar,
				},
				categoryUid: uid,
			});
		}
	}

	handleChange = (e) => {
		let { name, value } = e.target;
		this.setState({
			name: {
				...this.state.name,
				[name]: value,
			},
		});
	};

	handleSubmit = (e) => {
		e.preventDefault();
		let obj = {
			name: this.state.name,
			shortDesc: {
				en: "apparel",
				ar: "السياحة",
			},
			desc: {
				en: "apparel",
				ar: "السياحة",
			},
			icon: "https://asdas.com",
		};
		if (obj.name.en !== "" || obj.name.ar !== "") {
			this.setState({
				loader: true,
			});
			if (this.state.categoryUid !== "") {
				PUT(`category/category/${this.state.categoryUid}`, obj)
					.then((res) => {
						if (res.data.status === 1) {
							this.setState(
								{
									serverError: res.data.message,
								},
								() => {
									setTimeout(() => {
										this.props.history.push("/category");
									}, 2000);
								}
							);
						} else {
							this.setState({
								serverError: res.data.message,
							});
						}
					})
					.catch((err) => {
						this.setState({
							loader: false,
						});
					});
			} else {
				POST("category/category", obj, { headerStatus: true })
					.then((res) => {
						if (res.data.status === 1) {
							this.setState(
								{
									serverError: res.data.message,
								},
								() => {
									setTimeout(() => {
										this.props.history.push("/category");
									}, 2000);
								}
							);
						} else {
							this.setState({
								serverError: res.data.message,
							});
						}
					})
					.catch((err) => {
						this.setState({
							loader: false,
						});
					});
			}
		} else {
			this.setState({
				ValidError: "Field Required!",
				loader: false,
			});
		}
	};

	render() {
		return (
			// <div className="section">
			//     <SideBar/>
			<div class="main-content">
				<div className="header">
					<div className="container-fluid">
						<div className="header-body">
							<div className="row align-items-end">
								<div className="col">
									<h6 className="header-pretitle">Overview</h6>
									{this.state.categoryUid !== "" ? (
										<h1 className="header-title">Edit Category</h1>
									) : (
										<h1 className="header-title">Create Category</h1>
									)}
								</div>
								<div className="col-auto display-none">
									<Link to="/Createcategory" className="btn btn-primary lift">
										Create Category
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="container">
					{this.state.serverError ? (
						<div className="text-center alert alert-success mb-5" role="alert">
							{this.state.serverError}
						</div>
					) : null}
					<div class="row">
						<div className="col-12 col-md-12">
							<div className="form-group">
								<label> Name In English</label>
								<input
									type="text"
									className="form-control"
									placeholder="English"
									name="en"
									value={this.state.name.en}
									onChange={this.handleChange}
								/>
								{this.state.name.en === "" ? (
									<span className="text-danger">{this.state.ValidError}</span>
								) : null}
							</div>
							<div className="form-group">
								<label>Name In Arabic</label>
								<input
									type="text"
									className="form-control"
									dir="rtl"
									name="ar"
									placeholder="Arabic"
									value={this.state.name.ar}
									onChange={this.handleChange}
								/>
								{this.state.name.ar === "" ? (
									<span className="text-danger">{this.state.ValidError}</span>
								) : null}
							</div>
							<hr class="my-5" />
						</div>

						<div className="col-12 text-center">
							<div className="form-group ">
								{/* <button class="btn btn-primary" type="button" disabled>
                                    <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                    Loading...
                                </button> */}
								{this.state.categoryUid !== "" ? (
									<button
										className="btn btn-primary mr-3"
										onClick={this.handleSubmit}
									>
										{this.state.loader ? (
											<span
												class="spinner-grow spinner-grow-sm"
												role="status"
												aria-hidden="true"
											></span>
										) : null}
										Update Category
									</button>
								) : (
									<button
										className="btn btn-primary mr-3"
										onClick={this.handleSubmit}
									>
										{this.state.loader ? (
											<span
												class="spinner-grow spinner-grow-sm"
												role="status"
												aria-hidden="true"
											></span>
										) : null}
										Create Category
									</button>
								)}
								<button
									className="btn btn-outline-primary"
									onClick={() => this.props.history.push("/category")}
								>
									Cancel
								</button>
							</div>
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

export default Createcategory;
