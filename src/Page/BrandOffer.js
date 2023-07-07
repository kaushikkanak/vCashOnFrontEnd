/* eslint-disable eqeqeq */
import React, { Component } from "react";
import { Link } from "react-router-dom";
// import SideBar from '../Page/SideBar/Sidebar'
import { GET, DELETE } from "../Common/apiRoute";
import moment from "moment";
// import { ImageUrl } from "../Common/apiRoute";

class BrandOffer extends Component {
	state = {
		offersList: [],
		offerid: "",
		// page: 1,
		// pageclass: false,
		Message: "",
	};

	componentDidMount() {
		this.getOfferList();
		// this.getOfferList(this.state.page)
	}

	getOfferList = () => {
		// GET(`offer/offers?lang=en&page=${page}&limit=10`)
		let branduid = localStorage.getItem("brandUid");
		GET(`brands/offers/${branduid}`)
			.then((res) => {
				console.log(res.data);
				if (res.data.status == 1) {
					this.setState({
						offersList: res.data.data,
						Message: "",
						// pageclass: false
					});
				} else {
					this.setState({
						Message: res.data.message,
						// pageclass: true,
						offersList: [],
					});
				}
			})
			.catch((err) => console.log(err));
	};

	deleteOffer = (offerUid, unique) => {
		if (unique === "close") {
			DELETE(`offer/offer/${this.state.offerid}`)
				.then((res) => {
					if (res.data.status === 1) {
						this.getOfferList();
						// this.getOfferList(this.state.page)
					} else {
						this.setState({
							serverError: res.data.message,
						});
					}
				})
				.catch((err) => console.log(err));
		} else {
			this.setState({
				offerid: offerUid,
			});
		}
	};

	// pagination = (id) => {
	//   if (id === "forward") {
	//     if (this.state.page > 0) {
	//       this.setState({
	//         page: this.state.page + 1
	//       }, () => {
	//         this.getOfferList(this.state.page)
	//       })
	//     }
	//   }
	//   else if (id === "backward") {
	//     if (this.state.page > 1) {
	//       this.setState({
	//         page: this.state.page - 1
	//       }, () => {
	//         this.getOfferList(this.state.page)
	//       })
	//     }

	//   }
	// }

	//   featureMark = async (uid) => {
	//     await this.setState({
	//       featureId: uid
	//     }, () => {
	//       PUT(`offer/markfeature/${uid}`)
	//         .then(res => {
	//           console.log(res);
	//           if (res.data.status === 200) {
	//             this.getOfferList(this.state.page)
	//           } else {
	//             alert(res.data.message)
	//           }

	//         })
	//         .catch(err => {
	//           console.log(err);
	//         })
	//     })

	//   }

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
									<h1 className="header-title">Brand Offers</h1>
								</div>
								<div className="col-auto">
									<Link to="/addbrandoffer" className="btn btn-primary lift">
										Create Brand Offer
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
											<h4 className="card-header-title">All Brand Offers</h4>
										</div>
										{/* <div className="col-auto display-none">
                      <Link to="/addoffer" className="btn btn-sm btn-white">
                        Add Brand Offer ---------------
                        </Link>
                    </div> */}
									</div>
								</div>
								<div className="table-responsive mb-0">
									<table className="table table-sm table-wrap card-table">
										<thead>
											<tr>
												{/* <th class="w-20">
                          <Link to="#" className="text-muted list-sort" data-sort="goal-project">
                            Brand Name
                            </Link>
                        </th> */}

												<th>
													<Link
														className="text-muted list-sort"
														data-sort="goal-progress"
													>
														Offer Name
													</Link>
												</th>
												<th>
													<Link
														className="text-muted list-sort"
														data-sort="goal-date"
													>
														Offer Description
													</Link>
												</th>
												{/* <th class="w-10">
                          <Link to="#" className="text-muted list-sort" data-sort="goal-date">
                            Start date
                            </Link>
                        </th> */}
												<th class="w-10">
													<Link
														to="#"
														className="text-muted list-sort"
														data-sort="goal-date"
													>
														End date
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
												<th colSpan="2">
													<Link
														className="text-muted list-sort"
														data-sort="goal-date"
													>
														Featured
													</Link>
												</th>
											</tr>
										</thead>
										<tbody className="list">
											{this.state.offersList.length > 0 &&
												this.state.offersList?.map((ele, index) => {
													return (
														<tr key={index}>
															<Link
																to={{
																	pathname: "/details",
																	state: { offerDetail: ele },
																}}
																className="display-content"
															>
																{/* <td className="goal-project">
                                  <div className="avatar avatar-xs d-inline-block mr-2">
                                    <span class="">{ele.brand?.icon ? <img src={`${ImageUrl}${ele.brand?.icon}`} className="avatar-img rounded-circle" alt="..." /> : <span>{(ele.brand?.name.en?.split("")[0])?.toUpperCase()}</span>}</span>
                                  </div>
                                  {ele.brand?.name.en}
                                </td> */}
																<td className="goal-progress">
																	{ele?.title.en}
																</td>
																<td className="goal-date">{ele?.desc?.en}</td>
																<td className="goal-date">
																	{moment(new Date(ele.validUpto)).format(
																		"DD-MM-YYYY"
																	)}
																</td>
																{/* <td><span class="badge badge-soft-light">{ele.claimedCoupons}/{ele.totalCoupons}</span></td> */}
																<td>
																	<span class="badge badge-soft-light">
																		{ele.isActive ? "active" : "inactive"}
																	</span>
																</td>
															</Link>
															<td>
																<div class="custom-control custom-checkbox checklist-control d-block">
																	<input
																		type="checkbox"
																		onChange={() => this.featureMark(ele.uid)}
																		checked={ele.isFeatured}
																	/>
																</div>
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
																	<div className="dropdown-menu dropdown-menu-right">
																		<Link
																			to={{
																				pathname: "/addbrandoffer",
																				state: { OfferDetail: ele },
																			}}
																			className="dropdown-item"
																		>
																			Edit
																		</Link>
																		<Link
																			className="dropdown-item"
																			onClick={() =>
																				this.deleteOffer(ele.uid, "open")
																			}
																			data-toggle="modal"
																			data-target="#modal-offer"
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
							{/* <h2>{this.state.Message}</h2> */}
						</div>
					</div>
					{/* <div class="mb-4">
            <Link className="btn btn-primary btn-md mr-3" onClick={() => this.pagination("backward")}>
              <span className="glyphicon glyphicon-backward"></span> Back
                </Link>
            <Link className={this.state.pageclass ? "btn btn-primary btn-md d-none" : "btn btn-primary btn-md"} onClick={() => this.pagination("forward")}>
              <span className="glyphicon glyphicon-forward"></span> Next
                </Link>
          </div> */}
				</div>
				<div
					className="modal fade"
					id="modal-offer"
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
										Offer
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
									<p class="text-center">Do you really want to Delete Offer.</p>

									<div class="text-center mt-4">
										<button
											type="button"
											className="btn btn-primary mr-3"
											data-dismiss="modal"
											onClick={() =>
												this.deleteOffer(this.state.offerid, "close")
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
			// </div>
		);
	}
}

export default BrandOffer;
