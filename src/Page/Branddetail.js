import React, { Component } from "react";
// import SideBar from './SideBar/Sidebar'
import { GET, PUT } from "../Common/apiRoute";
import { Link, NavLink } from "react-router-dom";
import moment from "moment";
import { ImageUrl } from "../Common/apiRoute";

class Branddetail extends Component {
	state = {
		brandOfferList: [],
		brandDetail: {},
		featureId: "",
	};

	async componentDidMount() {
		await this.setState(
			{
				brandDetail: this.props.location.state.brandDetail,
			},
			() => {
				this.getbrandOffers();
			}
		);
	}

	getbrandOffers = () => {
		GET(
			`offer/brandOffers/${this.state.brandDetail.uid}?lang=en&page=1&limit=1000`
		)
			.then((res) => {
				console.log(res);
				this.setState({
					brandOfferList: res.data.data.bindOfferUsage,
				});
			})
			.catch((err) => console.log(err));
	};

	featureMark = async (uid) => {
		await this.setState(
			{
				featureId: uid,
			},
			() => {
				PUT(`offer/markfeature/${uid}`)
					.then((res) => {
						console.log(res);
						if (res.data.status === 200) {
							this.getbrandOffers();
						} else {
							alert(res.data.message);
						}
					})
					.catch((err) => {
						console.log(err);
					});
			}
		);
	};

	render() {
		const { name, tagline, webUrl, icon, images } = this.state.brandDetail;

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
									<h1 className="header-title text-capitalize">{name}</h1>
								</div>
								<div className="col-auto display-none">
									<NavLink to="/addoffer" className="btn btn-primary lift">
										Add Offer
									</NavLink>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="container">
					<div class="row">
						<div class="col-12 col-sm-3 col-md-3 col-lg-3">
							<div class="card lift mb-0 mob-mb-30">
								<span
									class="avatar-title rounded-circle"
									style={{ height: "190px" }}
								>
									{images ? (
										<img
											src={`${ImageUrl}${images && images[0]}`}
											className="avatar-img rounded"
											alt="..."
										/>
									) : (
										<span
											style={{
												"font-size": "xxx-large",
												"text-transform": "uppercase",
											}}
										>
											{name?.split("")[0]}
										</span>
									)}
								</span>
							</div>
						</div>
						<div class="col-12 col-sm-9 col-md-9 col-lg-9">
							<div class="row d-flex align-items-start mb-3">
								<div className="col-auto">
									<div class="avatar avatar-xl">
										<span class="avatar-title rounded-circle">
											{icon ? (
												<img
													src={`${ImageUrl}${icon}`}
													className="avatar-img rounded-circle"
													alt="..."
												/>
											) : (
												<span>{name?.split("")[0]}</span>
											)}
										</span>
									</div>
								</div>
								<div className="col ml-n2">
									<h2 class="mb-3 text-capitalize">{name}</h2>
									<p class="mb-0 line-height">{tagline}</p>
									<small class="text-muted">{webUrl}</small>
								</div>
							</div>
						</div>
						<div class="col-12">
							<hr class="my-5" />
						</div>
					</div>
					<div className="row">
						<div className="col-12">
							<div className="card">
								<div className="card-header">
									<div className="row align-items-center">
										<div className="col">
											<h4 className="card-header-title">All Offer</h4>
										</div>
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
												<th>
													<Link
														className="text-muted list-sort"
														data-sort="goal-date"
													>
														Validtill
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
												{/* <th colSpan="2">
                          <Link className="text-muted list-sort" data-sort="goal-date">
                            Featured
                            </Link>
                        </th> */}
											</tr>
										</thead>
										<tbody className="list">
											{this.state.brandOfferList?.map((ele, index) => {
												return (
													<tr key={index}>
														<td className="goal-progress">{ele.title}</td>
														<td className="goal-date">{ele.desc}</td>
														<td className="goal-date">
															{moment(ele.validUpto).format("DD-MM-YYYY")}
														</td>
														<td>
															<span class="badge badge-soft-light">
																{ele.claimedCoupons}/{ele.totalCoupons}
															</span>
														</td>

														{/* <td class="text-center">
                                <div class="custom-control custom-checkbox checklist-control d-block">
                                  <input type="checkbox" onChange={() => this.featureMark(ele.uid)} checked={ele.isFeatured} />
                                </div>
                              </td>
                              <td className="text-right">
                                <div className="dropdown">
                                  <Link className="dropdown-ellipses dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i className="fe fe-more-vertical" />
                                  </Link>
                                  <div className="dropdown-menu dropdown-menu-right">
                                    <Link className="dropdown-item">
                                      Active
                                  </Link>
                                  </div>
                                </div>
                              </td> */}

														{/* <input class="custom-control-input" id={`${this.state.featureId}`} type="checkbox" onChange={()=>this.featureMark(ele.uid)}/>
                                  <label class="custom-control-label" for={`${this.state.featureId}`}></label> */}
													</tr>
												);
											})}
										</tbody>
									</table>
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

export default Branddetail;
