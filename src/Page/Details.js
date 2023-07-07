import React, { Component } from "react";
import { Link } from "react-router-dom";
import { DELETE, GET, POST } from "../Common/apiRoute";
// import SideBar from "../Page/SideBar/Sidebar";
import { ImageUrl } from "../Common/apiRoute";

class Details extends Component {
	state = {
		serverMessage: "",
		couponList: [],
		offerDetail: {},
		file: null,
		couponId: "",
	};

	async componentDidMount() {
		const { uid } = this.props.location.state.offerDetail;
		await this.setState(
			{
				offerDetail: this.props.location.state.offerDetail,
				couponUId: uid,
			},
			() => {
				this.getcoupons();
			}
		);
	}

	getcoupons = () => {
		GET(`offer/coupons/${this.state.couponUId}`)
			.then((res) => {
				if (res.data.status === 1) {
					this.setState({
						couponList: res.data.data,
						serverMessage: "",
					});
				} else {
					this.setState({
						serverMessage: res.data.message,
					});
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	csvfile = (e) => {
		const { files } = e.target;
		this.setState({
			file: files[0],
		});
	};

	uploadCsv = (e) => {
		let fd = new FormData();
		fd.append("file", this.state.file);
		fd.append("offerId", this.state.offerDetail.uid);
		POST("offer/coupon", fd, { headerStatus: true })
			.then((res) => {
				if (res.data.status === 1) {
					this.getcoupons();
				} else {
					alert(res.data.message);
				}
			})
			.catch((err) => console.log(err));
	};

	deleteCoupon = (couponUId, unique) => {
		if (unique === "close") {
			DELETE(`offer/coupon/${this.state.couponId}`)
				.then((res) => {
					this.setState(
						{
							deletedMessage: res.data.message,
						},
						() => {
							this.getcoupons();
						}
					);
				})
				.catch((err) => console.log(err));
		} else {
			this.setState({
				couponId: couponUId,
			});
		}
	};

	render() {
		const { brand, desc, title } = this.state.offerDetail;
		return (
			// <div className="section">
			//        <SideBar/>
			<div class="main-content">
				<div className="header">
					<div className="container-fluid">
						<div className="header-body">
							<div className="row align-items-end">
								<div className="col">
									<h1 className="header-title">Offer Details</h1>
								</div>
								<div className="col-auto display-none">
									<Link to="/addoffer" className="btn btn-primary lift">
										Add Offer
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="container">
					<div className="row">
						<div className="col-sm-12 col-md-12">
							<form>
								<div className="row">
									<div class="col-12">
										<div className="form-group">
											<div className="row align-items-center mt-5">
												<div className="col-auto">
													<div className="avatar avatar-xl">
														<span class="avatar-title rounded-circle">
															{brand?.icon ? (
																<img
																	src={`${ImageUrl}${brand?.icon}`}
																	className="avatar-img rounded-circle"
																	alt="..."
																/>
															) : (
																<span>{title?.en?.split("")[0]}</span>
															)}
														</span>
													</div>
												</div>
												<div className="col ml-n2">
													<h2 className="mb-0 text-capitalize">
														{brand?.name?.en}
													</h2>
													<p class=" small text-muted">{brand?.tagline?.en}</p>
												</div>
											</div>
											<hr class="my-5" />
										</div>
									</div>
									<div className="col-12 col-md-9 col-xl-7">
										<h2 className="mb-2">Put Offer Name</h2>
										<p className="text-muted mb-xl-0">
											{title?.en}
											<hr class="my-5" />
										</p>
									</div>
									<div className="col-12 col-md-12 col-xl-12">
										<h2 className="mb-2">Put offer description</h2>
										<p className="text-muted mb-xl-0">{desc?.en}</p>
										<hr class="my-5" />
									</div>

									{/* <div className="col-12 col-md-12 col-xl-12">
                    <h2 className="mb-2">Per User Avail Count</h2>
                    <p className="text-muted mb-xl-0">
                      {availCount === -1 ? "Infinite" : availCount}
                    </p>
                    <hr class="my-5" />
                  </div> */}
									{/* <div className="col-12 col-md-12 col-xl-12">
                    <h2 className="mb-2">Number of Times Claimed</h2>
                    <p className="text-muted mb-xl-0">{usage}</p>
                    <hr class="my-5" />
                  </div> */}

									{/* <div className="col-12 col-md-12 col-xl-12 mb-5" >
                    <div class="card">
                      <div className="card-header">
                        <div className="row align-items-center">
                          <div className="col">
                            <h4 className="card-header-title">
                              Coupon
                            </h4>
                          </div>
                          <div className="col-auto">
                            <Link className="btn btn-sm btn-white" data-toggle="modal" data-target="#upload-coupon">
                              Upload More
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="table-responsive">
                        <table className="table table-sm">
                          <thead>
                            <tr>
                              <th scope="col">
                                <Link className="text-muted list-sort" data-sort="tables-first">Coupon</Link>
                              </th>
                              <th colSpan="2">
                                <Link className="text-muted list-sort" data-sort="tables-last">Action</Link>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="list">
                            {
                              this.state.couponList?.map((ele, index) => {
                                return (
                                  <tr key={index}>
                                    <td className="tables-last">{ele.code}</td>
                                    { ele.isClaimed ? <td className="tables-handle">Claimed</td> : <td className="tables-handle">unClaimed</td>}
                                    <td className="text-right">
                                      <div className="dropdown">
                                        <Link className="dropdown-ellipses dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                          <i className="fe fe-more-vertical" />
                                        </Link>
                                        <div className="dropdown-menu dropdown-menu-right">
                                          <Link className="dropdown-item" onClick={() => this.deleteCoupon(ele.uid, "open")} data-toggle="modal" data-target="#modal-coupon">
                                            Delete
                                          </Link>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )
                              })
                            }
                            {
                              this.state.serverMessage !== ""
                                ?
                                <h3 className="text-center text-info m-4">{this.state.serverMessage}</h3>
                                :
                                null
                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div> */}
								</div>
							</form>
						</div>
					</div>
				</div>
				<div
					className="modal fade"
					id="upload-coupon"
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
										Upload
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
									<div class="dz-default dz-message">
										<button class="dz-button" type="button">
											Drop files here to upload
										</button>
										<input
											type="file"
											id="input-file-now"
											class="file-upload"
											onChange={this.csvfile}
										/>
										{this.state.file ? (
											<span className="text-center text-success">
												Uploaded Successfully
											</span>
										) : null}
									</div>
									<div class="text-center mt-4">
										<button
											type="button"
											className="btn btn-primary mr-3"
											data-dismiss="modal"
											onClick={this.uploadCsv}
										>
											Upload
										</button>
										<button type="button" className="btn btn-outline-primary">
											Cancel
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div
					className="modal fade"
					id="modal-coupon"
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
										Membership Code
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
										Do you really want to Delete Membership Code.
									</p>
									<div class="text-center mt-4">
										<button
											type="button"
											className="btn btn-primary mr-3"
											data-dismiss="modal"
											onClick={() =>
												this.deleteCoupon(this.state.couponId, "close")
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

export default Details;
