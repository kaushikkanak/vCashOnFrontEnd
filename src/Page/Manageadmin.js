/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable eqeqeq */
import React, { Component } from "react";
// import SideBar from "../Page/SideBar/Sidebar";
import { GET, DELETE } from "../Common/apiRoute";
import { Link } from "react-router-dom";
class Manageadmin extends Component {
	state = {
		adminList: [],
		loadingDel: false,
		modalShowDelete: false,
		page: 1,
		uid: "",
		name: "",
	};

	componentDidMount() {
		this.manageAccountList(this.state.page);
	}

	manageAccountList = (page) => {
		GET("users/users/6,4,9")
			.then((res) => {
				if (res.data.status == 1) {
					this.setState({
						adminList: res.data.data,
						Message: "",
						pageclass: false,
					});
				} else {
					this.setState({
						Message: res.data.message,
						pageclass: true,
						adminList: [],
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
						this.manageAccountList(this.state.page);
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
						this.manageAccountList(this.state.page);
					}
				);
			}
		}
	};

	deleteCategory = (uid, unique) => {
		if (unique === "close") {
			DELETE(
				`users/deleteuser?uid=${uid}&type=${
					this.state.name === "Inactive" ? 0 : 1
				}`
			)
				.then((res) => {
					if (res.data.status === 1) {
						this.setState({ name: "", page: 1 }, () => {
							this.manageAccountList(this.state.page);
						});
					} else {
						this.setState({ name: "" });
						alert(res?.data?.message);
					}
				})
				.catch((err) => console.log(err));
		} else {
			this.setState({
				uid,
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
						{/* Body */}
						<div className="header-body">
							<div className="row align-items-end">
								<div className="col">
									{/* Pretitle */}
									<h6 className="header-pretitle">Overview</h6>
									{/* Title */}
									<h1 className="header-title">Manage Account</h1>
								</div>
								<div className="col-auto">
									{/* Button */}
									{/* <a href="/addadmin" className="btn btn-primary lift">
                    Add Account
                  </a> */}
									<Link to="/addadmin" className="btn btn-primary lift">
										Add Account
									</Link>
								</div>
							</div>{" "}
							{/* / .row */}
						</div>{" "}
						{/* / .header-body */}
					</div>
				</div>
				<div className="container-fluid">
					<div className="row">
						<div className="col-12">
							<div class="card">
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
										<div className="col-auto display-none">
											<a href="#!" className="btn btn-sm btn-white">
												Export
											</a>
										</div>
									</div>
								</div>
								<div
									class="table-responsive"
									data-list='{"valueNames": ["tables-row", "tables-first", "tables-last", "tables-handle"]}'
								>
									<table class="table table-sm table-nowrap card-table">
										<thead>
											<tr>
												<th scope="col">
													<a
														href="#"
														class="text-muted list-sort"
														data-sort="tables-row"
													>
														Name
													</a>
												</th>
												<th scope="col">
													<a
														href="#"
														class="text-muted list-sort"
														data-sort="tables-first"
													>
														Email
													</a>
												</th>
												<th scope="col">
													<a
														href="#"
														class="text-muted list-sort"
														data-sort="tables-first"
													>
														Status
													</a>
												</th>
												<th colSpan="2">
													<a
														href="#"
														class="text-muted list-sort"
														data-sort="tables-first"
													>
														Type
													</a>
												</th>
											</tr>
										</thead>
										<tbody class="list">
											{this.state.adminList?.map((ele, index) => {
												return (
													<tr key={index}>
														<th scope="row" class="tables-row">
															{ele.firstName + " " + ele.lastName}
														</th>
														<td class="tables-first">{ele.email}</td>
														<td class="tables-first">
															{ele.isActive ? (
																<span style={{ color: "#00D97E" }}>Active</span>
															) : (
																<span style={{ color: "red" }}>Inactive</span>
															)}
														</td>
														{ele.roleId === 9 || ele.roleId === 6 ? (
															<td>Administration</td>
														) : ele.roleId === 4 ? (
															<td>Brand</td>
														) : null}
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
																<div className="dropdown-menu dropdown-menu-right">
																	<Link
																		to={{
																			pathname: "/adminchange",
																			state: { userDetail: ele },
																		}}
																		className="dropdown-item"
																	>
																		Change Password
																	</Link>
																	<Link
																		to={`/addadmin?${ele.uid}`}
																		class="dropdown-item"
																	>
																		Edit
																	</Link>
																	<Link
																		className="dropdown-item"
																		onClick={() => {
																			this.setState(
																				{
																					name: ele.isActive
																						? "Inactive"
																						: "Active",
																				},
																				() => {
																					this.deleteCategory(ele.uid, "open");
																				}
																			);
																		}}
																		data-toggle="modal"
																		data-target="#modal-category"
																	>
																		{ele.isActive ? "Inactive" : "Active"}
																	</Link>
																</div>
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

					{/* --------------------------------------modal----------------------------------- */}
					<div
						className="modal fade"
						id="modal-category"
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
											Category
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
											Do you really want to{" "}
											{this.state.name === "Inactive" ? "Inactive" : "Active"}{" "}
											this account.
										</p>
										<div class="text-center mt-4">
											<button
												type="button"
												className="btn btn-primary mr-3"
												data-dismiss="modal"
												onClick={() =>
													this.deleteCategory(this.state.uid, "close")
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
				</div>
			</div>
		);
	}
}

export default Manageadmin;
