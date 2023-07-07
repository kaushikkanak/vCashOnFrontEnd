import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import SideBar from "../Page/SideBar/Sidebar";
import { GET } from "../Common/apiRoute";
import moment from "moment";
import { ImageUrl } from "../Common/apiRoute";

class ActiveCoupon extends Component {
	state = {
		offersList: [],
		uid: "",
		icon: "",
		name: "",
	};

	componentDidMount() {
		this.getuserBrandList();
	}

	getuserBrandList = async () => {
		GET("brands/UserBrandOffers")
			.then(async (res) => {
				if (res?.data) {
					let data = res.data?.brand;
					this.setState(
						{
							uid: data.uid,
							icon: data?.icon,
							name: data?.name?.en,
						},
						() => {
							this.getOfferList(this.state.uid);
						}
					);
				}
			})
			.catch((err) => console.log(err));
	};

	getOfferList = (uid) => {
		GET(`offer/findOfferByBrandUid?brandUid=${uid}`)
			.then((res) => {
				if (res.data.status === 1) {
					let data = res.data?.data;
					console.log("data 1 = ", data);
					this.setState({
						offersList: data,
					});
				}
			})
			.catch((err) => console.log(err));
	};

	handleDateFormat = (date) => {
		let format = date.split("T").slice(0)[0].split("-");
		return `${format[1]}-${format[2]}-${format[0]}`;
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
									<h1 className="header-title">Offers</h1>
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
											<h4 className="card-header-title">All Offers</h4>
										</div>
									</div>
								</div>
								<div className="table-responsive mb-0">
									<table className="table table-sm table-wrap card-table">
										<thead>
											<tr>
												<th class="w-20">Brand Name</th>

												<th>Offer Name</th>
												<th>Offer Description</th>
												<th>Expiry date</th>
												<th>Status</th>
											</tr>
										</thead>
										<tbody className="list">
											{this.state.offersList?.length > 0 ? (
												this.state.offersList?.map((ele, index) => {
													return (
														<tr key={index}>
															<td className="goal-project">
																<div className="avatar avatar-xs d-inline-block mr-2">
																	<span class="">
																		{this.state.icon ? (
																			<img
																				src={`${ImageUrl}${this.state.icon}`}
																				className="avatar-img rounded-circle"
																				alt="..."
																			/>
																		) : (
																			<span>
																				{this.state.name
																					?.split("")[0]
																					?.toUpperCase()}
																			</span>
																		)}
																	</span>
																</div>
																{this.state.name}
															</td>
															<td className="goal-progress">
																{ele?.title?.en}
															</td>
															<td className="goal-date">
																<span
																	style={{
																		maxHeight: "62px",
																		overflowY: "auto",
																		display: "inline-block",
																	}}
																>
																	{ele?.desc?.en}
																</span>
															</td>
															<td className="goal-date">
																{moment(new Date(ele.validUpto)).format(
																	"YYYY-MM-DD"
																)}
															</td>
															<td>
																<span class="badge badge-soft-light">
																	{/* {ele.claimedCoupons}/{ele.availCount === -1 ? "infinite" : ele.availCount} */}
																	{ele.availCount === -1
																		? "infinite"
																		: ele.availCount}
																</span>
															</td>
														</tr>
													);
												})
											) : (
												<tr>
													<td colSpan={5}>No Data Found</td>
												</tr>
											)}
										</tbody>
									</table>
								</div>
							</div>
							<h2>{this.state.Message}</h2>
						</div>
					</div>
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
			</div>
		);
	}
}

export default ActiveCoupon;
