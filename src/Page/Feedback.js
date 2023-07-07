/* eslint-disable eqeqeq */
import React, { Component } from "react";
// import SideBar from "../Page/SideBar/Sidebar";
import { GET, PUT } from "../Common/apiRoute";
import { Link } from "react-router-dom";
import moment from "moment";
import { ImageUrl } from "../Common/apiRoute";

class Feedback extends Component {
	state = {
		FeedbackList: [],
		feedEle: {},
		stars: [],
		page: 1,
		pageclass: false,
	};

	componentDidMount() {
		this.getAllfeedback(this.state.page);
	}

	changeFeedBackStatus = (ele, id) => {
		PUT(`users/feedbackstatus/${ele.uid}/${id}`)
			.then((res) => {
				if (res.data.status === 1) {
					this.getAllfeedback(this.state.page);
				} else {
					alert(res.data.message);
				}
			})
			.catch((err) => console.log(err));
	};

	getAllfeedback = async (page) => {
		await GET(`users/allfeedback?page=${page}&limit=10`)
			.then((res) => {
				if (res.data.status == 1) {
					this.setState({
						FeedbackList: res.data.data,
						Message: "",
						pageclass: false,
					});
				} else {
					this.setState({
						Message: res.data.message,
						pageclass: true,
						FeedbackList: [],
					});
				}
			})
			.catch((err) => {
				this.setState({
					Message: "No Response",
				});
			});
	};

	readFeed = (ele) => {
		this.setState({
			FeedbackText: ele.text,
			feedEle: ele,
		});
	};

	pagination = (id) => {
		if (id === "forward") {
			if (this.state.page > 0) {
				this.setState(
					{
						page: this.state.page + 1,
					},
					() => {
						this.getAllfeedback(this.state.page);
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
						this.getAllfeedback(this.state.page);
					}
				);
			}
		}
	};

	render() {
		const { FeedbackList } = this.state;
		return (
			// <div className="section">
			//   <SideBar/>
			<div class="main-content">
				<div className="header">
					<div className="container-fluid">
						<div className="header-body">
							<div className="row align-items-end">
								<div className="col">
									<h6 className="header-pretitle">Overview</h6>

									<h1 className="header-title">Feedback</h1>
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
											<h4 className="card-header-title">Feedback</h4>
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
												<th>
													<Link
														className="text-muted list-sort"
														data-sort="goal-project"
													>
														Brand Name
													</Link>
												</th>
												<th>
													<Link
														className="text-muted list-sort"
														data-sort="goal-status"
													>
														Date
													</Link>
												</th>
												<th>
													<Link
														className="text-muted list-sort"
														data-sort="goal-progress"
													>
														Rating
													</Link>
												</th>
												<th>
													<Link
														className="text-muted list-sort"
														data-sort="goal-date"
													>
														User Name
													</Link>
												</th>
												<th>
													<Link
														className="text-muted list-sort"
														data-sort="goal-date"
													>
														Read Feedback
													</Link>
												</th>
												<th>
													<Link
														className="text-muted list-sort"
														data-sort="goal-date"
													>
														Status
													</Link>
												</th>

												<th />
											</tr>
										</thead>
										<tbody className="list">
											{FeedbackList?.map((ele, index) => {
												return (
													<tr key={index}>
														<td className="goal-project">
															<div class="avatar avatar-xs mr-2">
																<img
																	src={`${ImageUrl}${ele?.offer?.brand?.icon}`}
																	className="avatar-img rounded-circle"
																	alt="..."
																/>
															</div>
															{ele?.offer?.brand?.name?.en}
														</td>
														<td className="goal-progress">
															{moment(new Date(ele?.createdAt)).format(
																"DD-MM-YYYY"
															)}
														</td>
														<td className="goal-status">
															{Array.from({ length: ele?.rating }, (_, i) => (
																<svg
																	key={i}
																	width="1em"
																	height="1em"
																	viewBox="0 0 16 16"
																	class="bi bi-star-fill text-warning"
																	fill="currentColor"
																	xmlns="http://www.w3.org/2000/svg"
																>
																	<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
																</svg>
															))}
															{Array.from(
																{ length: 5 - ele?.rating },
																(_, i) => (
																	<svg
																		key={i}
																		width="1em"
																		height="1em"
																		viewBox="0 0 16 16"
																		class="bi bi-star-fill rating-star"
																		fill="currentColor"
																		xmlns="http://www.w3.org/2000/svg"
																	>
																		<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
																	</svg>
																)
															)}
														</td>
														<td className="goal-date">
															{ele?.user?.firstName +
																(ele?.user?.lastName !== null
																	? ele?.user?.lastName
																	: "")}
														</td>
														<td className="goal-date">
															<Link
																class="feedback"
																data-toggle="modal"
																data-target="#feedback"
																onClick={() => this.readFeed(ele)}
															>
																Read Feedback
															</Link>
														</td>
														{ele.status == "1" ? (
															<td>
																<span class="badge badge-soft-info">
																	created
																</span>
															</td>
														) : ele.status == "2" ? (
															<td>
																<span class="badge badge-soft-success">
																	approved
																</span>
															</td>
														) : (
															<td>
																<span class="badge badge-soft-danger">
																	rejected
																</span>
															</td>
														)}
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
																			this.changeFeedBackStatus(ele, "2")
																		}
																	>
																		Approve
																	</Link>
																	<Link
																		class="dropdown-item"
																		onClick={() =>
																			this.changeFeedBackStatus(ele, "3")
																		}
																	>
																		Deny
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
					<h2>{this.state.Message}</h2>
					<div className="d-flex justify-content-center">
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
						<div></div>
						<div
							className="modal fade"
							id="feedback"
							tabIndex={-1}
							role="dialog"
							aria-labelledby="exampleModalCenterTitle"
							aria-hidden="true"
						>
							<div
								className="modal-dialog modal-dialog-centered"
								role="document"
							>
								<div className="modal-content">
									<div class="modal-card card">
										<div class="card-header">
											<h4
												class="card-header-title"
												id="exampleModalCenterTitle"
											>
												Feedback
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
											<p>{this.state.FeedbackText} </p>
											<div class="text-center">
												<button
													type="button"
													className="btn btn-primary mr-3"
													data-dismiss="modal"
													aria-hidden="true"
													onClick={() =>
														this.changeFeedBackStatus(this.state.feedEle, "2")
													}
												>
													Approve
												</button>
												<button
													type="button"
													className="btn btn-outline-primary"
													aria-hidden="true"
													onClick={() =>
														this.changeFeedBackStatus(this.state.feedEle, "3")
													}
												>
													Deny
												</button>
											</div>
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
				</div>{" "}
			</div>
		);
	}
}

export default Feedback;
