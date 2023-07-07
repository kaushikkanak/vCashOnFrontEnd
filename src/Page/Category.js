/* eslint-disable eqeqeq */
import React, { Component } from "react";
import { GET, DELETE } from "../Common/apiRoute";
// import SideBar from "../Page/SideBar/Sidebar";
import { Link } from "react-router-dom";

class Category extends Component {
	state = {
		categories: [],
		categoryId: "",
		page: 1,
	};

	componentDidMount() {
		this.getCategoryList(this.state.page);
	}

	getCategoryList = (page) => {
		GET("category/list")
			.then((res) => {
				if (res.data.status == 1) {
					const sort = res?.data?.data.sort((a, b) =>
						a?.name?.en.toLowerCase() > b?.name?.en.toLowerCase()
							? 1
							: b?.name?.en.toLowerCase() > a?.name?.en.toLowerCase()
							? -1
							: 0
					);
					this.setState({
						categories: sort,
						Message: "",
						pageclass: false,
					});
				} else {
					this.setState({
						Message: res.data.message,
						pageclass: true,
						categories: [],
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
						this.getCategoryList(this.state.page);
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
						this.getCategoryList(this.state.page);
					}
				);
			}
		}
	};

	deleteCategory = (categoryUid, unique) => {
		if (unique === "close") {
			DELETE(`category/category/${this.state.categoryId}`)
				.then((res) => {
					if (res.data.status === 1) {
						this.getCategoryList();
					} else {
						this.setState({
							serverError: res.data.message,
						});
					}
				})
				.catch((err) => console.log(err));
		} else {
			this.setState({
				categoryId: categoryUid,
			});
		}
	};

	render() {
		return (
			// <div className="section">
			// <SideBar/>
			<div class="main-content">
				<div className="header">
					<div className="container-fluid">
						<div className="header-body">
							<div className="row align-items-end">
								<div className="col">
									<h6 className="header-pretitle">Overview</h6>
									<h1 className="header-title">Categories</h1>
								</div>
								<div className="col-auto">
									<Link to="/createcategory" className="btn btn-primary lift">
										Create Category
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
											<h4 className="card-header-title">All Category</h4>
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
											<Link to="/addoffer" className="btn btn-sm btn-white">
												Add Offer
											</Link>
										</div>
									</div>
								</div>
								<div className="table-responsive mb-0">
									<table className="table table-sm table-wrap card-table">
										<thead>
											<tr>
												<th colSpan="2">
													<Link
														className="text-muted list-sort"
														data-sort="goal-project"
													>
														CATEGORY NAME
													</Link>
												</th>
											</tr>
										</thead>
										<tbody className="list">
											{this.state.categories?.map((ele, index) => {
												return (
													<tr key={index}>
														<td>{ele.name.en}</td>
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
																		onClick={() =>
																			this.deleteCategory(ele.uid, "open")
																		}
																		data-toggle="modal"
																		data-target="#modal-category"
																	>
																		Delete
																	</Link>
																	<Link
																		to={{
																			pathname: "/createcategory",
																			state: { CategoryDetail: ele },
																		}}
																		className="dropdown-item"
																	>
																		Edit
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
											Do you really want to Delete Category.
										</p>
										<div class="text-center mt-4">
											<button
												type="button"
												className="btn btn-primary mr-3"
												data-dismiss="modal"
												onClick={() =>
													this.deleteCategory(this.state.categoryId, "close")
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

export default Category;
