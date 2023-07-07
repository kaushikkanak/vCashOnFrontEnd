import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { PUT, GET } from "../Common/apiRoute";
import { ImageUrl } from "../Common/apiRoute";

class Banner extends Component {
	state = {
		banners: [],
		bannerError: "",
		page: 1,
	};

	componentDidMount() {
		this.getBannersList(this.state.page);
	}

	getBannersList = (page) => {
		GET("offer/homebanner")
			.then((res) => {
				if (res.data.status === 1) {
					this.setState({
						banners: res.data.data,
						pageclass: false,
					});
				} else {
					this.setState({
						bannerError: res.data.message,
						pageclass: true,
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
						this.getBannersList(this.state.page);
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
						this.getBannersList(this.state.page);
					}
				);
			}
		}
	};

	activeStatus = async (status, banner) => {
		if (status === "active") {
			PUT(`offer/bannervisibility/${banner.uid}`, { active: false })
				.then((res) => {
					if (res.data.status === 1) {
						this.getBannersList();
					} else {
						this.setState({
							serverError: res.data.message,
						});
					}
				})
				.catch((err) => console.log(err));
		}
	};

	render() {
		const { bannerError, banners } = this.state;
		return (
			<>
				<div class="main-content">
					<div className="header">
						<div className="container-fluid">
							<div className="header-body">
								<div className="row align-items-end">
									<div className="col">
										<h6 className="header-pretitle"> Overview</h6>
										<h1 className="header-title">Banners</h1>
									</div>
									<div className="col-auto">
										<Link to="/AddBanner" className="btn btn-primary lift">
											Create Banner
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class="container-fluid">
						<div class="row">
							<div class="col-12">
								<div class="card">
									<div class="card-header">
										<div className="row align-items-center">
											<div className="col">
												<h4 class="card-header-title">All Banners</h4>
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
										</div>
									</div>
									<div class="table-responsive mb-0">
										<table class="table table-sm table-wrap card-table">
											<thead>
												<tr>
													<th scope="col">Title</th>
													<th scope="col">Description</th>
													<th scope="col">Published</th>
												</tr>
											</thead>
											<tbody>
												{bannerError !== "" ? (
													<div>
														<span className="text-center text-info">
															{bannerError}
														</span>
													</div>
												) : null}
												{banners?.map((ele, index) => {
													return (
														<tr key={index}>
															<Link
																to={{
																	pathname: "/Bannerdetail",
																	state: { bannerDetail: ele },
																}}
																className="display-content"
															>
																<td>
																	<div class="d-flex align-items-center">
																		<div class="avatar avatar-xs">
																			<img
																				class="avatar-img rounded mr-3"
																				src={`${ImageUrl}${ele?.images?.[0]}`}
																				alt="..."
																			/>
																		</div>
																		<div class="ml-3">
																			<h4 class="font-weight-normal mb-1">
																				{ele?.title?.en}
																			</h4>
																		</div>
																	</div>
																</td>
																<td>{ele?.desc?.en}</td>
																<td>
																	{moment(ele?.createdAt).format("DD-MM-YYYY")}
																</td>
															</Link>
															<td class="text-right">
																<div class="dropdown">
																	<Link
																		class="dropdown-ellipses dropdown-toggle"
																		role="button"
																		data-toggle="dropdown"
																		aria-haspopup="true"
																		aria-expanded="false"
																	>
																		<i class="fe fe-more-vertical"></i>
																	</Link>
																	<div class="dropdown-menu dropdown-menu-right">
																		<Link
																			class="dropdown-item"
																			onClick={() =>
																				this.activeStatus("active", ele)
																			}
																		>
																			Delete
																		</Link>
																		<Link
																			to={{
																				pathname: "/AddBanner",
																				state: { bannerDetail: ele },
																			}}
																			class="dropdown-item"
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
			</>
		);
	}
}
export default Banner;
