import React, { Component } from "react";
// import Flatpickr from "react-flatpickr";
import { GET, POST } from "../Common/apiRoute";
import { Link } from "react-router-dom";
import moment from "moment";
import Select from "react-select";
import "flatpickr/dist/themes/material_green.css";
// import { getBrandImage } from "../Common/helperFunctions";
//import ReactTimeout from 'react-timeout'
// import QrReader from "react-qr-scanner";
//import "../App.css";
// import Html5QrcodePlugin from './Html5QrcodePlugin'
import { ImageUrl } from "../Common/apiRoute";

class Userbrand extends Component {
	constructor(props) {
		super(props);
		this.state = {
			date: new Date(),
			brandUsers: [],
			filterbrandUsers: [],
			filterData: [],
			phone: "",
			code: "",
			fromDate: "",
			toDate: "",
			used: 0,
			use: 0,
			showhide: false,
			userBrandData: {},
			delay: 3000,
			scan: true,
			result: null,
			offers: "",
			options: [],
			optValue: "",
			searchData: [],
			modalData: "",
			view: false,
			decodedResults: [],
			scanObj: "",
			scanModal: false,
		};
		this.onNewScanResult = this.onNewScanResult.bind(this);
	}

	componentDidMount() {
		this.getuserBrandList();
	}

	getuserBrandList = async () => {
		GET("brands/UserBrandOffers")
			.then(async (res) => {
				this.setState({
					brandUsers: res.data.data,
					filterbrandUsers: res.data.data,
					used: res.data.data.filter((ele) => ele.offerStatus === true).length,
					use:
						res.data.data.length -
						res.data.data.filter((ele) => ele.offerStatus === true).length,
					phone: "",
					code: "",
				});
			})
			.catch((err) => console.log(err));
	};

	changeStatus = () => {
		const { scanObj } = this.state;
		// if (unique === "use") {
		//   this.setState({
		//     searchData,
		//   });
		// } else {
		// console.log("searchData = ", searchData)
		// let obj = ""

		// searchData.forEach(ele => {
		//   if (ele?.offercouponuid2 === this.state.optValue?.value) {
		//     obj = ele
		//   }
		// });

		this.handleUse(scanObj);
		// }
	};

	handleUse = (obj) => {
		console.log("obj = ", obj);
		POST("offer/create", obj, {
			headerStatus: true,
		})
			.then((res) => {
				if (res.data.status === 1) {
					this.setState(
						{
							phone: "",
							code: "",
							optValue: "",
							options: [],
							scanModal: false,
						},
						() => {
							this.getuserBrandList();
							setTimeout(() => alert(res?.data?.message), 1000);
						}
					);
				} else {
					if (res?.data?.message) {
						setTimeout(() => alert(res?.data?.message), 1000);
					}
				}
			})
			.catch((err) => console.log(err));
	};

	handleChange = (e) => {
		e.preventDefault();
		this.setState({ [e.target.name]: e.target.value }, () => {
			if (this.state?.phone?.length > 5 || this.state?.code?.length > 3)
				this.handleApi();
		});
	};

	handleApi = async () => {
		const { phone, code } = this.state;
		GET(`offer/findOfferByUser?phone=${phone}&coupon=${code}`)
			.then((res) => {
				if (res.data.status === 1) {
					let data = res.data?.data;
					const ofrId = res.data?.brand?.uid;
					const usrId = data?.length > 0 ? data?.[0]?.userUid : "";
					console.log("1 = ", data);
					this.setState(
						{
							searchData: data,
							// modalData: data[0],
							code: data?.[0]?.couponCode,
						},
						() => {
							this.handleApiOffer(ofrId, usrId);
						}
					);
				}
			})
			.catch((err) => console.log(err));
	};

	handleViewApi = (phone, code) => {
		GET(`offer/findOfferByUser?phone=${phone}&coupon=${code}`)
			.then((res) => {
				if (res.data.status === 1) {
					let data = res.data?.data;
					console.log("2 = ", data);
					this.setState({
						searchData: data,
						// modalData: data[0]
					});
				}
			})
			.catch((err) => console.log(err));
	};

	handleData = (brandUid, offerUid, userUid) => {
		let data = {
			brandUid,
			offerUid,
			userUid,
		};
		POST(`offer/getOffesrDetailsBy`, data, { headerStatus: true })
			.then((res) => {
				if (res.data.status === 1) {
					let data = res.data?.data;
					// console.log("==== ",data)
					this.setState({
						modalData: data,
					});
				}
			})
			.catch((err) => console.log(err));
	};

	viewModal = (phone, code) => {
		// console.log("view = ",this.state.view)
		this.setState({ view: true }, () => {
			this.handleViewApi(phone, code);
		});
	};

	handleApiOffer = (id, usrId) => {
		console.log("00");
		GET(`offer/findOfferByBrandUid?brandUid=${id}`)
			.then((res) => {
				if (res.data.status === 1) {
					let data = res.data?.data;
					// console.log("data 1 = ", data)
					let opt = [];
					data.forEach((ele) => {
						opt.push({
							label: ele.title?.en,
							value: ele.brandUid,
							usrId: usrId,
							uid: ele.uid,
						});
					});

					let values = opt?.length > 0 ? opt[0] : "";

					let obj = {
						title: values?.label,
						brandUid: values?.value,
						offerUid: values?.uid,
						userUid: values?.usrId,
					};

					this.handleData(values?.value, values?.uid, values?.usrId);

					this.setState({
						options: opt,
						optValue: values,
						scanObj: obj,
					});
				}
			})
			.catch((err) => console.log(err));
	};

	trimOffer = (offerName) => {
		if (offerName.length > 20) {
			let trimString = offerName.slice(0, 18);
			return `${trimString}...`;
		} else {
			return offerName;
		}
	};
	handleScandata = () => {
		this.setState({ showhide: true, scan: false });
	};

	handleChangeType = (selectValue) => {
		console.log("01");
		let obj = {
			title: selectValue?.label,
			brandUid: selectValue?.value,
			offerUid: selectValue?.uid,
			userUid: selectValue?.usrId,
		};
		this.handleData(selectValue?.value, selectValue?.uid, selectValue?.usrId);
		this.setState({
			optValue: selectValue,
			scanObj: obj,
		});
	};

	handleError(err) {
		console.error(err);
	}

	handleCloseScandata = () => {
		this.setState({ showhide: false, scan: true });
	};

	changeCancel = () => {
		if (this.state.view) {
			this.setState({
				phone: "",
				code: "",
				offers: "",
				options: [],
				optValue: "",
				searchData: [],
				modalData: "",
				scanObj: "",
				scanModal: false,
			});
		} else {
			this.setState({
				scanModal: false,
			});
		}
	};

	onNewScanResult(decodedText, decodedResult) {
		let result = JSON.parse(decodedResult?.decodedText);
		// console.log("result = ", result)
		if (result) {
			let obj = {
				title: result?.title,
				brandUid: result?.brandUid,
				offerUid: result?.offerUid,
				userUid: result?.userUid,
			};
			this.handleData(result?.brandUid, result?.offerUid, result?.userUid);
			this.setState(
				{
					result,
					showhide: false,
					scan: true,
					scanObj: obj,
					view: false,
					scanModal: true,
				},
				() => {
					this.handleViewApi(result?.phone, "");
				}
			);
		}
	}

	render() {
		// const previewStyle = {
		//   height: "100%",
		//   width: "100%",
		//   marginBottom: "20px",
		// };
		const { brandUsers, view, scanModal } = this.state;
		//    console.log('this.state.email',this.state.email);
		return (
			<>
				<div className="main-content">
					<div className="header">
						<div className="container-fluid">
							<div className="header-body">
								<div className="row align-items-end">
									<div className="col">
										<h6 className="header-pretitle"> Overview</h6>
										<h1 className="header-title">Brand Dashboard </h1>
									</div>
									<div class="col-auto">
										<Link
											onClick={this.getuserBrandList}
											class="btn btn-primary lift"
										>
											Refresh
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="container-fluid">
						<div class="card mt-5 px-4 pt-4">
							<form>
								<div className="row">
									<div className="col-12 col-lg-3 col-xl-3">
										<div className="form-group">
											<label for="exampleInputEmail1">Phone</label>
											<input
												type="tel"
												name="phone"
												value={this.state.phone}
												// onChange={(e) => this.filterBrandUser(e)}
												onChange={(e) => this.handleChange(e)}
												className="form-control"
												placeholder="9XXXXXX34"
											/>
										</div>
									</div>
									<div className="col-12 col-lg-3 col-xl-3">
										<div className="form-group">
											<label for>Membership Code</label>
											<input
												type="text"
												value={this.state.code}
												name="code"
												// onChange={(e) => this.filterBrandUser(e)}
												onChange={(e) => this.handleChange(e)}
												className="form-control"
												placeholder="BOH232"
											/>
										</div>
									</div>
									<div className="col-12 col-lg-4 col-xl-4">
										<div className="form-group">
											<label for="exampleInputEmail1">Offers</label>
											<Select
												className=""
												value={this.state.optValue}
												onChange={this.handleChangeType}
												options={this.state.options}
												placeholder="Select Offer"
											/>
										</div>
									</div>
									<div className="col-12 col-lg-2 col-xl-2">
										<div className="form-group">
											<label for="exampleInputEmail1">Use</label>
											<button
												className="btn btn-primary w-100"
												onClick={() => this.setState({ view: false })}
												type="button"
												data-toggle="modal"
												data-target="#modal-Use"
												data-backdrop="static"
												disabled={!this.state.options.length}
											>
												Use
											</button>
										</div>
									</div>
									<div className="col-12 col-lg-6 col-xl-6">
										{/* <ResultContainerPlugin results={this.state.result} /> */}
										<div class="mobile-show form-group">
											{this.state.showhide === true ? (
												<div>
													<div className="set_video">
														{/* <QrReader
                              delay={this.state.delay}
                              style={previewStyle}
                              facingMode={"rear"}
                              onError={this.handleError}
                              onScan={this.handleScan}
                            /> */}
														{/* <Html5QrcodePlugin
                              fps={10}
                              qrbox={250}
                              disableFlip={false}
                              qrCodeSuccessCallback={this.onNewScanResult} /> */}
													</div>
													{/* <p>{this.state.result}</p> */}
													<p>
														{" "}
														<button
															className="btn btn-primary w-100"
															onClick={() => this.handleCloseScandata()}
															type="button"
														>
															Close Scan
														</button>
													</p>{" "}
												</div>
											) : (
												""
											)}

											{this.state.scan === true ? (
												<button
													className="btn btn-primary w-100"
													onClick={() => this.handleScandata()}
													type="button"
												>
													QR Scan
												</button>
											) : (
												""
											)}
										</div>
									</div>

									{/* <div className="col-12 col-lg-6 col-xl-2">
                                        <div className="form-group">
                                            <label for>From</label>
                                            <Flatpickr
                                                className="form-control"
                                                placeholder="From"
                                                onChange={(e) => this.filterBrandUser(e, "fromDate")}
                                            />

                                        </div>
                                    </div> */}
									{/* <div className="col-12 col-lg-6 col-xl-2">
                                        <div className="form-group">
                                            <label for>To</label>
                                            <Flatpickr
                                                className="form-control"
                                                placeholder="To"
                                                onChange={(e) => this.filterBrandUser(e, "toDate")}
                                            />
                                        </div>
                                    </div> */}
									{/* <div className="col-12  col-xl-2">
                        <button className="btn btn-primary mob-mb-4 w-100" type="button">
                          <i className="fe fe-sliders mr-1"></i> Filter
                        </button>

                      </div> */}
								</div>
							</form>
						</div>
						{/* <div class="mobile-show my-5">
                    <button className="btn btn-primary w-100" type="button" data-toggle="modal" data-target="#filterdata">
                      <i className="fe fe-sliders mr-1"></i> Filter
                    </button>
                </div> */}
					</div>

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
												<h4>Last Used History</h4>
											</div>
										</div>
									</div>
									<div className="table-responsive mb-0">
										<table className="table table-sm table-wrap card-table brand-border-top">
											<thead>
												<tr>
													<th scope="col">Name</th>
													{/* <th scope="col">Email</th> */}
													<th scope="col">Phone</th>
													<th scope="col">OFFER NAME</th>
													<th scope="col">Membership Code</th>
													<th scope="col">Last claimed On</th>
													<th scope="col">Last Used On</th>
													<th colspan="3">Governorate</th>
												</tr>
											</thead>
											<tbody>
												{brandUsers?.map((ele, index) => {
													return (
														<tr
															key={index}
															// class={ele?.offerStatus ? "" : "bg-light"}
														>
															<td>{ele?.firstName}</td>
															{/* <td>{ele.email}</td> */}
															<td>{ele?.phone}</td>
															<td>
																<div class="d-tooltip">
																	{/* {this.trimOffer(ele.offertitle.en)}
                                  <span class="d-tooltiptext">
                                    {ele.offertitle.en}
                                  </span> */}
																	{this.trimOffer(ele?.offerName)}
																	<span class="d-tooltiptext">
																		{ele?.offerName}
																	</span>
																</div>
															</td>
															<td>{ele?.couponCode}</td>
															<td>
																{/* {moment(ele.claimedon).format(
                                  "DD/MM/YYYY HH:mm"
                                )} */}
																{moment(ele?.createdAt).format(
																	"DD/MM/YYYY HH:mm"
																)}
															</td>
															<td>
																{/* {ele?.offerStatus
                                  ? moment(ele.usedon).format(
                                    "DD/MM/YYYY HH:mm"
                                  )
                                  : "--"} */}
																{moment(ele?.updatedAt).format(
																	"DD/MM/YYYY HH:mm"
																)}
															</td>
															<td>{ele?.governorateId}</td>
															<td class="text-right">
																<i
																	data-toggle="modal"
																	data-backdrop="static"
																	data-target="#modal-Use"
																	onClick={() =>
																		this.viewModal(ele?.phone, ele?.couponCode)
																	}
																	className="fe fe-eye"
																></i>
															</td>

															{/* <td class="text-right">
                                <div className="dropdown">
                                  {ele.offerStatus ? null : (
                                    <a
                                      href="#"
                                      class="dropdown-ellipses dropdown-toggle"
                                      role="button"
                                      data-toggle="dropdown"
                                      aria-haspopup="true"
                                      aria-expanded="false"
                                    >
                                      <i className="fe fe-more-vertical"></i>
                                    </a>
                                  )}

                                  <div className="dropdown-menu dropdown-menu-right">
                                    <Link
                                      onClick={() =>
                                        this.changeStatus(ele, "use")
                                      }
                                      className="dropdown-item"
                                      data-toggle="modal"
                                      data-target="#modal-Use"
                                    >
                                      Use
                                    </Link>
                                  </div>
                                </div>
                              </td> */}
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
					{/* mobile footer */}
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
					{/* ===============modal=========== */}
				</div>
				<div
					className={`modal fade ${scanModal ? "show" : ""}`}
					style={{ display: scanModal ? "block" : "" }}
					id="modal-Use"
					tabIndex={-1}
					role="dialog"
					aria-labelledby="exampleModalCenterTitle"
					aria-hidden="true"
				>
					<div
						className="modal-dialog modal-dialog-centered"
						style={{ maxHeight: "700px" }}
						role="document"
					>
						<div className="modal-content">
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
								<div
									class="card-body"
									style={{ minHeight: "500px", maxHeight: "700px" }}
								>
									{!view && (
										<div className="row">
											<div className="col-6 font-weight-bold">Name :</div>
											<div className="col-6">
												{this.state.modalData?.firstName || ""}
											</div>
											<div className="col-6 font-weight-bold">Phone :</div>
											<div className="col-6">{this.state.modalData?.phone}</div>
											<div className="col-6 font-weight-bold">
												Membership Code :
											</div>
											<div className="col-6">
												{this.state.modalData?.couponCode}
											</div>
											<div className="col-6 font-weight-bold">Offer Name :</div>
											<div className="col-6">
												{this.state.modalData?.offerName}
											</div>
											{this.state.modalData?.image ? (
												<>
													<div className="col-6 font-weight-bold">
														Offer Image :
													</div>
													<div className="col-6">
														<img
															src={`${ImageUrl}${this.state.modalData?.image}`}
															style={{ maxWidth: "58px", maxHeight: "92px" }}
															alt="..."
														/>
													</div>
												</>
											) : (
												""
											)}
										</div>
									)}

									{!view && (
										<>
											<hr />
											<div
												style={{ display: "flex", justifyContent: "center" }}
											>
												<button
													type="button"
													className="btn btn-primary btn-sm mr-3 mb-3"
													data-dismiss="modal"
													onClick={this.changeStatus}
												>
													Confirm Use
												</button>
											</div>
										</>
									)}
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
																<h4>Last Used History</h4>
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
																	<th className="md_w" scope="col">
																		Offer Description
																	</th>
																	<th scope="col">Last Used On</th>
																</tr>
															</thead>
															<tbody>
																{this.state.searchData.length > 0 ? (
																	this.state.searchData?.map((ele, index) => {
																		return (
																			<tr key={index}>
																				<td>{ele?.offerName}</td>
																				<td className="md_w">{ele?.desc}</td>
																				<td>
																					{ele.updatedAt
																						? moment(ele?.updatedAt).format(
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
								</div>
							</div>
						</div>
					</div>
				</div>
				{scanModal && <div class="modal-backdrop fade show"></div>}
			</>
		);
	}
}
export default Userbrand;
