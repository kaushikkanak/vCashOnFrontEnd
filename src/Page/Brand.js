import React, { Component } from "react";
// import SideBar from '../Page/SideBar/Sidebar'
import { GET, DELETE } from "../Common/apiRoute";
import { Link, Redirect, NavLink } from "react-router-dom";
import moment from "moment";
import { ImageUrl } from "../Common/apiRoute";

class Brand extends Component {
	state = {
		brands: [],
		brandDetail: {},
		isRedirect: false,
		brandUid: "",
		page: 1,
	};

	componentDidMount() {
		this.getBrandsList(this.state.page);
	}

	getBrandsList = (page) => {
		GET("brands/brands?lang=en")
			.then((res) => {
				// eslint-disable-next-line eqeqeq
				if (res.data.status == 1) {
					this.setState({
						brands: res.data.data,
						Message: "",
						pageclass: false,
					});
				} else {
					this.setState({
						Message: res.data.message,
						pageclass: true,
						brands: [],
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
						this.getBrandsList(this.state.page);
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
						this.getBrandsList(this.state.page);
					}
				);
			}
		}
	};

	deleteBrand = async (brand, unique) => {
		if (unique === "close") {
			DELETE(`brands/brand/${this.state.brandUid}`)
				.then((res) => {
					if (res.data.status === 1) {
						console.log(res.data);
						this.getBrandsList();
					} else {
						this.setState({
							serverError: res.data.message,
						});
					}
				})
				.catch((err) => console.log(err));
		} else {
			await this.setState({
				brandUid: brand.uid,
			});
		}
	};

	editbrand = (uid) => {
		GET(`brands/brand/${uid}`)
			.then((res) => {
				this.setState({
					brandDetail: res.data.data,
					isRedirect: true,
				});
			})
			.catch((err) => console.log(err));
	};

	render() {
		if (this.state.isRedirect) {
			return (
				<Redirect
					to={{
						pathname: "/addbrand",
						state: { brandDetail: this.state.brandDetail },
					}}
				/>
			);
		}
		return (
			// <div className="section">
			//   <SideBar />
			<div class="main-content">
				<div className="header">
					<div className="container-fluid">
						<div className="header-body">
							<div className="row align-items-end">
								<div className="col">
									<h6 className="header-pretitle">Overview</h6>
									<h1 className="header-title">Brands</h1>
								</div>
								<div className="col-auto">
									<NavLink to="/addbrand" className="btn btn-primary lift">
										Create Brands
									</NavLink>
								</div>
							</div>
						</div>
					</div>
				</div>
				{this.state.serverError ? (
					<div className="text-center text-info mt-0">
						<h2>{this.state.serverError}</h2>
					</div>
				) : null}
				<div className="container-fluid">
					<div className="row">
						<div className="col-12">
							<div className="card">
								<div className="card-header">
									<div className="row align-items-center">
										<div className="col">
											<h4 className="card-header-title">All Brand</h4>
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
											<NavLink to="/addbrand" className="btn btn-sm btn-white">
												Add Brand
											</NavLink>
										</div>
									</div>
								</div>
								<div className="table-responsive mb-0">
									<table className="table table-sm table-wrap card-table">
										<thead>
											<tr>
												<th class="w-20">
													<Link
														className="text-muted list-sort"
														data-sort="goal-project"
													>
														Brand Name
													</Link>
												</th>
												<th>
													<Link className="text-muted">Tagline</Link>
												</th>
												<th colSpan="2" class="w-10">
													<Link className="text-muted">Created On</Link>
												</th>
											</tr>
										</thead>
										<tbody className="list">
											{this.state.brands?.map((ele, index) => {
												return (
													<tr key={index}>
														<Link
															to={{
																pathname: "/branddetail",
																state: { brandDetail: ele },
															}}
															className="display-content"
														>
															<td className="goal-project">
																<div className="avatar avatar-xs d-inline-block mr-2">
																	<span class="">
																		{ele.icon ? (
																			<img
																				src={`${ImageUrl}${ele?.icon}`}
																				className="avatar-img rounded-circle"
																				alt="..."
																			/>
																		) : (
																			<span>W</span>
																		)}
																	</span>
																</div>
																{ele.name}
															</td>
															<td className="goal-status">{ele.tagline}</td>
															<td
																className="goal-status"
																style={{ width: "12%" }}
															>
																{moment(ele.createdAt).format("DD-MM-YYYY")}
															</td>
														</Link>
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
																		className="dropdown-item"
																		onClick={() => this.editbrand(ele.uid)}
																	>
																		Edit
																	</Link>
																	<Link
																		className="dropdown-item"
																		onClick={() =>
																			this.deleteBrand(ele, "open")
																		}
																		data-toggle="modal"
																		data-target="#modal-brand"
																	>
																		Delete
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
					<div
						className="modal fade"
						id="modal-brand"
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
											Brand
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
											Do you really want to Delete Brand.
										</p>

										<div class="text-center mt-4">
											<button
												type="button"
												className="btn btn-primary mr-3"
												data-dismiss="modal"
												onClick={() =>
													this.deleteBrand(this.state.brandUid, "close")
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
			</div>
		);
	}
}

export default Brand;
