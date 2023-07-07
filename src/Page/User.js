/* eslint-disable eqeqeq */
import moment from "moment";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { GET, PUT } from "../Common/apiRoute";

class User extends Component {
	state = {
		usersList: [],
		userStatus: null,
		userId: "",
		page: 1,
		pageclass: false,
		view: false,
		searchData: [],
	};

	componentDidMount() {
		this.getUsersList(this.state.page);
	}

	changeCancel = () => {
		this.setState({
			view: false,
		});
	};

	getUsersList = (page) => {
		GET("users/users/1")
			.then((res) => {
				if (res.data.status == 1) {
					this.setState({
						usersList: res.data.data,
						Message: "",
						pageclass: false,
					});
				} else {
					this.setState({
						Message: res.data.message,
						pageclass: true,
						usersList: [],
					});
				}
			})
			.catch((err) => console.log(err));
	};

	pagination = (id) => {
		if (id === "forward") {
			if (this.state.page > 0) {
				this.setState(
					{
						page: this.state.page + 1,
					},
					() => {
						this.getUsersList(this.state.page);
					}
				);
			}
		} else if (id === "backward") {
			if (this.state.page > 1) {
				this.setState(
					{
						page: this.state.page - 1,
					},
					() => {
						this.getUsersList(this.state.page);
					}
				);
			}
		}
	};

	changeStatus = (userId, userStatus, unique) => {
		if (unique === "close") {
			let obj = {
				uid: this.state.userId,
				uState: !this.state.userStatus,
			};
			PUT("users/ustate", obj, { headerStatus: true })
				.then((res) => {
					if (res.data.status === 1) {
						this.getUsersList();
					} else {
						this.setState({
							serverError: res.data.message,
						});
					}
				})
				.catch((err) => console.log(err));
		} else {
			this.setState({
				userStatus: userStatus,
				userId: userId,
			});
		}
	};

	setUserLogs = (userId) => {
		GET(`users/getUserLogsByUid?userId=${userId}`)
			.then((res) => {
				console.log("lskjdfl", res.data.users);
				if (res.data.status === 1) {
					this.setState({
						view: true,
						searchData: res.data.users,
					});
				} else {
					this.setState({
						serverError: res.data.message,
					});
				}
			})
			.catch((err) => console.log(err));
	};

	render() {
		return (
			// <div className="section">
			//   <SideBar />
			<div className="main-content">
				<div className="header">
					<div className="container-fluid">
						<div className="header-body">
							<div className="row align-items-end">
								<div className="col">
									<h6 className="header-pretitle">Overview</h6>
									<h1 className="header-title">Users</h1>
								</div>
								<div className="col-auto display-none">
									<Link to="/addbrand" className="btn btn-primary lift">
										Add Brands
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="container-fluid">
					<div className="row">
						<div className="col-12">
							<div className="card">
								<div className="card-header">
									<div className="row align-items-center">
										<div className="col">
											<h4 className="card-header-title">All User</h4>
										</div>
										{/* <div className="col-sm-3">
                      <div className="input-group input-group-flush input-group-merge">
                        <input
                          type="search"
                          className="form-control form-control-prepended search"
                          // onChange={this.handleUserSearch}
                          // value={userListSearch}
                          placeholder="Search"
                        />
                        <div className="input-group-prepend">
                          <div className="input-group-text">
                            <span className="fe fe-search" />
                          </div>
                        </div>
                      </div>
                    </div> */}
										{/* <div className="col-auto ">
                      <Link className="btn btn-sm btn-white">Export</Link>
                    </div> */}
									</div>
								</div>
								<div className="table-responsive mb-0">
									<table className="table table-sm table-wrap card-table">
										<thead>
											<tr>
												<th>
													<Link
														className="text-muted list-sort"
														data-sort="goal-project"
													>
														Name
													</Link>
												</th>
												<th>
													<Link
														className="text-muted list-sort"
														data-sort="goal-progress"
													>
														Email
													</Link>
												</th>
												<th>
													<Link
														className="text-muted list-sort"
														data-sort="goal-date"
													>
														Phone
													</Link>
												</th>
												<th>
													<Link
														className="text-muted list-sort"
														data-sort="goal-date"
													>
														Membership Code
													</Link>
												</th>
												<th>
													<Link
														className="text-muted list-sort"
														data-sort="goal-date"
													>
														Governorate
													</Link>
												</th>
												<th>
													<Link
														className="text-muted list-sort"
														data-sort="goal-date"
													>
														User Subscription Status
													</Link>
												</th>
												<th>
													<Link
														className="text-muted list-sort"
														data-sort="goal-date"
													>
														expiry Date
													</Link>
												</th>
												<th />
											</tr>
										</thead>
										<tbody className="list">
											{this.state.usersList?.map((ele, index) => {
												return (
													<tr
														key={index}
														class={ele.isActive ? "" : "soft-dange"}
													>
														<td className="goal-project">{ele.firstName}</td>

														<td className="goal-progress">{ele.email}</td>
														<td className="goal-date">{ele.phone}</td>
														<td className="goal-date">{ele.couponCode}</td>
														<td className="goal-date">
															{ele.governorate?.name?.split(" ")[0]}
														</td>
														<td className="goal-date">
															{ele.userSubscriptionStatus === true ? (
																<span
																	class="badge badge-soft-primary px-3"
																	style={{ fontSize: "13px" }}
																>
																	Yes
																</span>
															) : (
																<span
																	class="badge badge-soft-danger px-3"
																	style={{ fontSize: "13px" }}
																>
																	No
																</span>
															)}
														</td>
														<td className="goal-date">
															{moment(ele.expiryDate).format("DD-MM-YYYY")}
														</td>
														<td className="text-right">
															<div className="dropdown">
																<Link
																	className="dropdown-ellipses dropdown-toggle"
																	role="button"
																	data-toggle="dropdown"
																	aria-haspopup="true"
																	aria-expanded="false"
																>
																	<i className="fe fe-more-vertical" />
																</Link>

																{ele.isActive ? (
																	<div className="dropdown-menu dropdown-menu-right">
																		<Link
																			className="dropdown-item"
																			onClick={() =>
																				this.changeStatus(
																					ele.uid,
																					ele.isActive,
																					"open"
																				)
																			}
																			data-toggle="modal"
																			data-target="#Suspend-Account"
																		>
																			Suspend Account
																		</Link>
																		<Link
																			className="dropdown-item"
																			onClick={() => this.setUserLogs(ele.uid)}
																			data-toggle="modal"
																			data-target="#siddik"
																		>
																			View
																		</Link>
																	</div>
																) : (
																	<div className="dropdown-menu dropdown-menu-right">
																		<Link
																			className="dropdown-item"
																			onClick={() =>
																				this.changeStatus(
																					ele.uid,
																					ele.isActive,
																					"open"
																				)
																			}
																			data-toggle="modal"
																			data-target="#Activate-Account"
																		>
																			Activate Account
																		</Link>
																		<Link
																			className="dropdown-item"
																			onClick={() => this.setUserLogs(ele.uid)}
																			data-toggle="modal"
																			data-target="#siddik"
																		>
																			View
																		</Link>
																	</div>
																)}
															</div>
														</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>
							</div>
							<h2>{this.state.Message}</h2>
						</div>
					</div>

					{/* {this.state.view ? (
						<div
							className="modal-dialog modal-dialog-centered"  
							aria-hidden="true"
							// id="siddik"
							style={{ maxHeight: "700px" }}
						>
							<div
								className="modal-content"
								// style={{ minHeight: "800px", maxWidth: "800px" }}
							>
								<div class="modal-card card">
									<div style={{ display: "flex", justifyContent: "end" }}>
										<button
											type="button"
											className="close mr-4 mt-3"
											data-dismiss="modal"
											aria-label="Close"
											style={{ color: "#000" }}
											onClick={() => this.changeCancel()}
										>
											<span aria-hidden="true">×</span>
										</button>
									</div>
									<div class="card-body">
										{this.state.view ? (
											<div className="container-fluid">
												<div className="row">
													<div className="col-12">
														<div className="card">
															<div class="card-header">
																<div className="row">
																	<div className="col-5">
																		<h4> List</h4>
																	</div>
																	<div className="col-6">
																		<h4>User Offer Visit History</h4>
																	</div>
																</div>
															</div>
															<div
																className="table-responsive mb-0"
																style={{
																	maxHeight: "300px",
																	overflowY: "auto",
																}}
															>
																<table className="table table-sm table-wrap card-table brand-border-top">
																	<thead>
																		<tr>
																			<th scope="col">Offer Name</th>
																			<th scope="col">Visit On</th>
																		</tr>
																	</thead>
																	<tbody>
																		{this.state.searchData.length > 0 ? (
																			this.state.searchData?.map(
																				(ele, index) => {
																					return (
																						<tr key={index}>
																							<td>{ele?.name}</td>
																							<td>
																								{ele.viewAt
																									? moment(ele?.viewAt).format(
																											"DD/MM/YYYY HH:mm"
																									  )
																									: ""}
																							</td>
																						</tr>
																					);
																				}
																			)
																		) : (
																			<tr>
																				<td colSpan={3}>No Data Found</td>
																			</tr>
																		)}
																	</tbody>
																</table>
															</div>
														</div>
													</div>
												</div>
											</div>
										) : (
											""
										)}
									</div>
								</div>

								{/* {this.state.view ? (
							<div className="container-fluid">
								<div className="row">
									<div className="col-12">
										<div className="card">
											<div class="card-header">
												<div className="row">
													<div className="col-5">
														<h4> List</h4>
													</div>
													<div className="col-6">
														<h4>User Offer Visit History</h4>
													</div>
												</div>
											</div>
											<div
												className="table-responsive mb-0"
												style={{ maxHeight: "300px", overflowY: "auto" }}
											>
												<table className="table table-sm table-wrap card-table brand-border-top">
													<thead>
														<tr>
															<th scope="col">Offer Name</th>
															<th scope="col">Visit On</th>
														</tr>
													</thead>
													<tbody>
														{this.state.searchData.length > 0 ? (
															this.state.searchData?.map((ele, index) => {
																return (
																	<tr key={index}>
																		<td>{ele?.name}</td>
																		<td>
																			{ele.viewAt
																				? moment(ele?.viewAt).format(
																						"DD/MM/YYYY HH:mm"
																				  )
																				: ""}
																		</td>
																	</tr>
																);
															})
														) : (
															<tr>
																<td colSpan={3}>No Data Found</td>
															</tr>
														)}
													</tbody>
												</table>
											</div>
										</div>
									</div>
								</div>
							</div>
						) : (
							""
						)} */}

					{/* <div className="d-flex justify-content-center">
            <div class="mb-4">
              <Link
                className="btn btn-primary btn-md mr-3"
                onClick={() => this.pagination("backward")}
              >
                <span className="glyphicon glyphicon-backward"></span> Back
              </Link>
              <Link
                className={
                  this.state.pageclass
                    ? "btn btn-primary btn-md d-none"
                    : "btn btn-primary btn-md"
                }
                onClick={() => this.pagination("forward")}
              >
                <span className="glyphicon glyphicon-forward"></span> Next
              </Link>
            </div>
          </div> */}
					{/* </div> */}
					{/* </div> */}
					{/* ) : ( */}
					{/* "" */}
					{/* )} */}

					<div
						className="modal fade"
						id="Suspend-Account"
						tabIndex={-1}
						role="dialog"
						aria-labelledby="exampleModalCenterTitle"
						aria-hidden="true"
					>
						<div className="modal-dialog modal-dialog-centered" role="document">
							<div className="modal-content">
								<div class="modal-card card">
									<div class="card-header">
										<h4 class="card-header-title" id="exampleModalCenterTitle">
											Account Confirmation
										</h4>
										<button
											type="button"
											class="close"
											data-dismiss="modal"
											aria-label="Close"
										>
											<span aria-hidden="true">×</span>
										</button>
									</div>
									<div class="card-body">
										<p class="text-center">
											Do you really want to Suspend Account.
										</p>

										<div class="text-center mt-4">
											<button
												type="button"
												className="btn btn-primary mr-3"
												data-dismiss="modal"
												onClick={() =>
													this.changeStatus(
														this.state.userId,
														this.state.userStatus,
														"close"
													)
												}
											>
												Yes
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div
						className="modal fade"
						id="Activate-Account"
						tabIndex={-1}
						role="dialog"
						aria-labelledby="exampleModalCenterTitle"
						aria-hidden="true"
					>
						<div className="modal-dialog modal-dialog-centered" role="document">
							<div className="modal-content">
								<div class="modal-card card">
									<div class="card-header">
										<h4 class="card-header-title" id="exampleModalCenterTitle">
											Account Confirmation
										</h4>
										<button
											type="button"
											class="close"
											data-dismiss="modal"
											aria-label="Close"
										>
											<span aria-hidden="true">×</span>
										</button>
									</div>
									<div class="card-body">
										<p class="text-center">
											Do you really want to Activate Account.
										</p>

										<div class="text-center mt-4">
											<button
												type="button"
												className="btn btn-primary mr-3"
												data-dismiss="modal"
												onClick={() =>
													this.changeStatus(
														this.state.userId,
														this.state.userStatus,
														"close"
													)
												}
											>
												Yes
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/* //ukjhkhl */}
					<div
						className="modal fade"
						id="siddik"
						tabIndex={-1}
						role="dialog"
						aria-labelledby="exampleModalCenterTitle"
						aria-hidden="true"
					>
						<div className="modal-dialog modal-dialog-centered" role="document">
							<div className="modal-content">
								{this.state.view ? (
									<div class="modal-card card">
										<div style={{ display: "flex", justifyContent: "end" }}>
											<button
												type="button"
												className="close mr-4 mt-3"
												data-dismiss="modal"
												aria-label="Close"
												style={{ color: "#000" }}
												onClick={() => this.changeCancel()}
											>
												<span aria-hidden="true">×</span>
											</button>
										</div>
										<div class="card-body">
											<div className="container-fluid">
												<div className="row">
													<div className="col-12">
														<div className="card">
															<div class="card-header">
																<div className="row">
																	<div className="col-5">
																		<h4> List</h4>
																	</div>
																	<div className="col-6">
																		<h4>User Offer Visit History</h4>
																	</div>
																</div>
															</div>
															<div
																className="table-responsive mb-0"
																style={{
																	maxHeight: "300px",
																	overflowY: "auto",
																}}
															>
																<table className="table table-sm table-wrap card-table brand-border-top">
																	<thead>
																		<tr>
																			<th scope="col">Offer Name</th>
																			<th scope="col">Visit On</th>
																		</tr>
																	</thead>
																	<tbody>
																		{this.state.searchData.length > 0 ? (
																			this.state.searchData?.map(
																				(ele, index) => {
																					return (
																						<tr key={index}>
																							<td>{ele?.name}</td>
																							<td>
																								{ele.viewAt
																									? moment(ele?.viewAt).format(
																											"DD/MM/YYYY HH:mm"
																									  )
																									: ""}
																							</td>
																						</tr>
																					);
																				}
																			)
																		) : (
																			<tr>
																				<td colSpan={3}>No Data Found</td>
																			</tr>
																		)}
																	</tbody>
																</table>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								) : (
									""
								)}
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
				</div>{" "}
			</div>
		);
	}
}

export default User;
