/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
// import SideBar from "./SideBar/Sidebar";
// import { Link } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import { GET, POST, PUT } from "../Common/apiRoute";
// import Select from "react-select";
import { ImageUrl } from "../Common/apiRoute";

class AddBrandoffer extends Component {
	state = {
		//     categories: [],
		brands: [],
		title: {
			en: "",
			ar: "",
		},
		shortDesc: {
			en: "",
			ar: "",
		},
		desc: {
			en: "",
			ar: "",
		},
		brandId: "",
		images: [],
		validFrom: "",
		validUpto: "",
		// file: null,
		offerDetail: {},
		imageName: "",
		imageSize: "",
		offerUid: "",
		availcount: 0,
		//     loader: false,
		availcountInput: 0,
	};

	componentDidMount() {
		if (this.props.location.state !== undefined) {
			console.log("---  ", this.props.location.state.OfferDetail);
			let {
				validFrom,
				validUpto,
				title,
				desc,
				brandUid,
				images,
				uid,
				availCount,
			} = this.props.location.state.OfferDetail;
			this.setState({
				offerDetail: this.props.location.state.OfferDetail,
				validFrom,
				validUpto,
				title,
				desc,
				brandId: brandUid,
				selectedOption: { label: title.en, value: brandUid },
				images,
				offerUid: uid,
				imageName: images && images.length > 0 && images[0].split("/")[1],
				availcountInput: availCount === -1 ? null : availCount,
				availcount: availCount,
			});
		}
		GET("brands/brands?lang=en")
			.then((res) => {
				this.setState({
					brands: res.data.data,
				});
			})
			.catch((err) => console.log(err));
	}

	handleChange = (e, id) => {
		if (e?.value) {
			this.setState({
				brandId: e.value,
				selectedOption: e,
			});
		} else {
			if (e?.length) {
				let date = new Date(e[0]);
				if (id === "fromDate") {
					this.setState({
						validFrom: new Date(),
					});
				} else {
					this.setState({
						validUpto: date,
						validFrom: new Date(),
					});
				}
			} else {
				let { name, value } = e.target;
				if (name === "title_en") {
					if (value.length < 50) {
						this.setState({
							title: {
								...this.state.title,
								en: value,
							},
						});
					}
				} else if (name === "title_ar") {
					if (value.length < 50) {
						this.setState({
							title: {
								...this.state.title,
								ar: value,
							},
						});
					}
				} else if (name === "desc_en") {
					this.setState({
						desc: {
							...this.state.desc,
							en: value,
						},
					});
				} else if (name === "desc_ar") {
					this.setState({
						desc: {
							...this.state.desc,
							ar: value,
						},
					});
				} else if (name === "availcountInput") {
					this.setState({
						availcountInput: value ? parseInt(value) : 0,
					});
				}
				// else if (name === "file") {
				//   if (e.target.files[0]?.type === "text/csv" || e.target.files[0]?.type === "application/vnd.ms-excel") {
				//     this.setState({
				//       file: e.target.files[0]
				//     })
				//   } else {
				//     alert("Please upload only csv file")
				//   }
				// }
				else if (name === "availcount") {
					this.setState({
						availcount: e.target.checked ? -1 : 0,
					});
				}
			}
		}
		console.log("--   ", this.state);
	};

	uploadImage = async (e) => {
		let { name, files } = e.target;
		let imageSize = files[0].size / 1024;
		let fileSize = files[0].size / (1024 * 1024);
		if (fileSize <= 2) {
			const fd = new FormData();
			fd.append("file", files[0]);
			await POST(`files/upload/${name}`, fd, { headerStatus: true })
				.then((res) => {
					console.log(res);
					if (res.data.status === 1) {
						this.setState({
							images: [res.data.data[0].s3key],
							imageName: files[0].name,
							imageSize: imageSize,
						});
					} else {
						alert(res.data.message);
					}
				})
				.catch((err) => console.log(err));
		} else {
			this.setState({
				imageValidation: "image should be less than or equal to 2MB.",
			});
		}
		console.log(this.state.images);
	};

	handleSubmit = (e) => {
		e.preventDefault();
		let {
			title,
			shortDesc,
			desc,
			// brandId,
			images,
			validFrom,
			validUpto,
			availcount,
			availcountInput,
		} = this.state;
		let obj = {
			title: {
				en: title.en === "" ? title.ar : title.en,
				ar: title.ar === "" ? title.en : title.ar,
			},
			shortDesc: {
				en: shortDesc.en === "" ? shortDesc.ar : shortDesc.en,
				ar: shortDesc.ar === "" ? shortDesc.en : shortDesc.ar,
			},
			desc: {
				en: desc.en === "" ? desc.ar : desc.en,
				ar: desc.ar === "" ? desc.en : desc.ar,
			},
			brandId:
				this.state.brandId !== ""
					? this.state.brandId
					: localStorage.getItem("brandUid"),
			images: images,
			validFrom: validFrom,
			validUpto: validUpto,
			availCount: availcount === -1 ? availcount : availcountInput,
		};
		this.setState({
			loader: true,
		});
		if (
			obj.title.en !== "" &&
			obj.title.ar !== "" &&
			obj.desc.en !== "" &&
			obj.desc.ar !== "" &&
			obj.brandId !== "" &&
			obj.validUpto !== "" &&
			obj.availcount !== 0
		) {
			// this.setState({
			//   loader: true
			// })
			if (this.state.offerUid !== "") {
				PUT(`offer/offer/${this.state.offerUid}`, obj)
					.then((res) => {
						if (res.data.status === 1) {
							// if (this.state.file) {
							// let fd = new FormData()
							// fd.append('file', this.state.file)
							// fd.append('offerId', this.state.offerUid)
							// POST('offer/coupon', fd, { headerStatus: true })
							//   .then(res => {
							this.setState(
								{
									serverError: res.data.message,
								},
								() => {
									setTimeout(() => {
										this.props.history.push("/brand-offer");
									}, 2000);
								}
							);
							//   })
							//   .catch(err => {
							//     this.setState({
							//       loader: false
							//     })
							//   })
							// }
							// else {
							//   this.setState({
							//     serverError: res.data.message
							//   }, () => {
							//     setTimeout(() => {
							//       this.props.history.push("/offer")
							//     }, 2000)
							//   })
							// }
						} else {
							this.setState({
								serverError: res.data.message,
								loader: false,
							});
						}
					})
					.catch((err) => {
						this.setState({
							loader: false,
						});
					});
			} else {
				if (
					obj.title.en !== "" &&
					obj.title.ar !== "" &&
					obj.desc.en !== "" &&
					obj.desc.ar !== "" &&
					obj.brandId !== "" &&
					obj.validUpto !== "" &&
					obj.availcount !== 0
				) {
					POST("offer/offer", obj, { headerStatus: true })
						.then((resp) => {
							if (resp.data.status === 1) {
								// if (this.state.file) {
								// let fd = new FormData()
								// fd.append('file', this.state.file)
								// fd.append('offerId', resp.data.data.uid)
								// POST('offer/coupon', fd, { headerStatus: true })
								//   .then(res => {
								//     this.setState({
								//       serverError: resp.data.message
								//     }, () => {
								//       setTimeout(() => {
								//         this.props.history.push("/offer")
								//       }, 2000)
								//     })
								//   })
								//   .catch(err => {
								//     this.setState({
								//       loader: false
								//     })
								//   })
								// } else {
								this.setState(
									{
										serverError: resp.data.message,
										loader: false,
									},
									() => {
										setTimeout(() => {
											this.props.history.push("/brand-offer");
										}, 2000);
									}
								);
								// }
							} else {
								this.setState({
									serverError: resp.data.message,
									loader: false,
								});
							}
						})
						.catch((err) => {
							this.setState({
								loader: false,
							});
						});
				} else {
					this.setState({
						fieldValidation: "Field Required*",
						// csvfileError: "Upload Offers CSV File !",
						loader: false,
					});
				}
			}
		} else {
			this.setState({
				fieldValidation: "Field Required*",
				// csvfileError: "Upload Offers CSV File !",
				loader: false,
			});
		}
	};

	render() {
		let { validUpto, title, desc, brandId, images } = this.state;
		// let options = this.state.brands.map((item) => {
		//   return { value: item.uid, label: item.name };
		// })
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
									{this.state.offerUid === "" ? (
										<h1 className="header-title text-capitalize">
											Add New Brand Offer
										</h1>
									) : (
										<h1 className="header-title text-capitalize">
											Edit Brand Offer
										</h1>
									)}
								</div>
								<div className="col-auto display-none">
									<a href="/addoffer" className="btn btn-primary lift">
										Add Brand Offer
									</a>
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
											<label>Select Brand</label>
											<select
												className="custom-select"
												name="brandId"
												disabled={true}
												value={brandId}
												// onChange={this.handleChange}
											>
												{/* <option> Select </option> */}
												{this.state.brands?.map((ele, index) => {
													return (
														<option key={index} value={ele.uid}>
															{" "}
															{ele.name}{" "}
														</option>
													);
												})}
											</select>
											{/* <Select
                        className=""
                        value={this.state.selectedOption}
                        onChange={this.handleChange}
                        options={options}
                      /> */}
											{/* {
                        this.state.brandId === ""
                          ?
                          <span className="text-danger">
                            {this.state.fieldValidation}
                          </span>
                          :
                          null
                      } */}
										</div>
									</div>
									<div class="col-12">
										<hr class="mb-5 mt-3" />
									</div>
									<div className="col-12 col-md-12">
										<div className="form-group">
											<label>Put Offer Name</label>
											<input
												type="text"
												className="form-control mb-3"
												name="title_en"
												placeholder="English"
												value={title.en}
												onChange={this.handleChange}
											/>
											<input
												type="text"
												dir="rtl"
												className="form-control"
												name="title_ar"
												placeholder="Arabic"
												value={title.ar}
												onChange={this.handleChange}
											/>
											{this.state.title.en === "" ? (
												<span className="text-danger">
													{this.state.fieldValidation}
												</span>
											) : null}
										</div>
										<hr class="my-5" />
									</div>
									<div className="col-12 col-md-12">
										<div className="form-group">
											<label>Put offer description</label>
											<textarea
												type="text"
												className="form-control  mb-3"
												name="desc_en"
												value={desc?.en}
												placeholder="English"
												onChange={this.handleChange}
											></textarea>
											<textarea
												type="text"
												dir="rtl"
												className="form-control"
												name="desc_ar"
												value={desc?.ar}
												placeholder="Arabic"
												onChange={this.handleChange}
											></textarea>
											{this.state.desc?.en === "" ? (
												<span className="text-danger">
													{this.state.fieldValidation}
												</span>
											) : null}
										</div>
										<hr class="my-5" />
									</div>
									{/* <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label>Start Date</label>
                      <Flatpickr
                        className="form-control"
                        placeholder="YYYY/MM/DD"
                        name="fromDate"
                        onChange={(e) => this.handleChange(e, "fromDate")}
                        value={validFrom}
                      />
                      {
                        this.state.validFrom === ""
                          ?
                          <span className="text-danger">
                            {this.state.fieldValidation}
                          </span>
                          :
                          null
                      }
                    </div>
                  </div> */}
									<div className="col-12 col-md-12">
										<div className="form-group">
											<label>Valid Upto</label>
											<Flatpickr
												data-date-format="d-m-Y"
												className="form-control"
												placeholder="DD-MM-YYYY"
												name="uptoDate"
												onChange={(e) => this.handleChange(e, "uptoDate")}
												value={validUpto}
											/>
											{this.state.validUpto === "" ? (
												<span className="text-danger">
													{this.state.fieldValidation}
												</span>
											) : null}
											{Date.parse(this.state.validFrom) >
											Date.parse(this.state.validUpto) ? (
												<span className="text-danger">
													Should be greater than start date.
												</span>
											) : null}
										</div>
									</div>
									<div class="col-12">
										<hr class="mb-5 mt-3" />
									</div>
									<div className="col-12">
										<div className="form-group">
											<label>Offer image</label>
											<div
												className="dropzone dropzone-multiple"
												data-toggle="dropzone"
												data-options='{"url": "https://"}'
											>
												<div class="dz-default dz-message">
													<button class="dz-button" type="button">
														Drop files here to upload
													</button>
													<input
														type="file"
														id="input-file-now"
														class="file-upload"
														accept="image/*"
														name="file"
														onChange={this.uploadImage}
													/>
												</div>
												<ul className="dz-preview dz-preview-multiple list-group list-group-lg list-group-flush">
													<span className="text-muted mt-2">
														PNG or JPG should be less than or equal to 2MB.
													</span>
													<li className="list-group-item">
														<div className="row align-items-center">
															<div className="col-auto">
																<div className="avatar">
																	{images && images.length > 0 && (
																		<img
																			src={
																				images &&
																				images.length > 0 &&
																				`${ImageUrl}${images[0]}`
																			}
																			className="avatar-img rounded"
																			alt="..."
																			data-dz-thumbnail
																		/>
																	)}
																</div>
															</div>
															{images && images.length > 0 && (
																<>
																	<div className="col ml-n3">
																		<h4 className="mb-1" data-dz-name>
																			{this.state.imageName}
																		</h4>
																		{this.state.imageSize !== "" ? (
																			<small
																				className="text-muted"
																				data-dz-size
																			>
																				{Math.round(this.state.imageSize)} KB
																			</small>
																		) : null}
																	</div>
																	<div className="col-auto">
																		<div className="dropdown">
																			<a
																				href="#"
																				className="dropdown-ellipses dropdown-toggle"
																				role="button"
																				data-toggle="dropdown"
																				aria-haspopup="true"
																				aria-expanded="false"
																			>
																				<i className="fe fe-more-vertical" />
																			</a>
																			<div className="dropdown-menu dropdown-menu-right">
																				<a
																					href="#"
																					className="dropdown-item"
																					data-dz-remove
																				>
																					Remove
																				</a>
																			</div>
																		</div>
																	</div>
																</>
															)}
														</div>
													</li>
												</ul>
											</div>
										</div>
										{/* <hr class="my-5" /> */}
									</div>
									{/* <div className="col-12"> */}
									{/* <div className="form-group"> */}
									{/* <label>Membership Code</label> */}
									{/* <div className="dropzone dropzone-multiple" data-toggle="dropzone" data-options="{&quot;url&quot;: &quot;https://&quot;}"> */}
									{/* <div class="dz-default dz-message"> */}
									{/* <button class="dz-button" type="button">Drop files here to upload</button> */}
									{/* <input type="file" id="input-file-now" class="file-upload" name="file" onChange={this.handleChange} /> */}
									{/* {this.state.file !== null ? <span className="text-center text-success">Uploaded SuccessFully</span> : null} */}
									{/* </div> */}
									{/* <span className="text-muted mt-2">Please upload only .csv files.  */}
									{/* <a className="text-primary" href={`${ImageUrl}web-assets/otp-mailer/sample_codes.csv`}>Download coupons_template.csv.</a> */}
									{/* </span> */}
									{/* { this.state.file ? null : <span className="text-danger">{this.state.csvfileError}</span> } */}
									{/* <ul className="dz-preview dz-preview-multiple list-group list-group-lg list-group-flush">
                          <li className="list-group-item">
                            <div className="row align-items-center">
                              <div className="col-auto">
                                <div className="avatar">
                                  <img src={require('../assets/img/covers/brand3.png')} className="avatar-img rounded" alt="..." data-dz-thumbnail />
                                </div>
                              </div>
                              <div className="col ml-n3">
                                <h4 className="mb-1" data-dz-name>offer-image-red@3x.png</h4>
                                <small className="text-muted" data-dz-size>30.5 KB</small>
                              </div>
                              <div className="col-auto">
                                <div className="dropdown">
                                  <a href="#" className="dropdown-ellipses dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i className="fe fe-more-vertical" />
                                  </a>
                                  <div className="dropdown-menu dropdown-menu-right">
                                    <a href="#" className="dropdown-item" data-dz-remove>
                                      Remove
                                      </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>

                        </ul>  */}
									{/* </div> */}
									{/* </div> */}
									{/* {
                      this.state.offerUid === ""
                        ? */}
									<div className="display-inline">
										Avail Count
										<input
											type="number"
											disabled={this.state.availcount === -1}
											className="form-control mb-3"
											style={{
												margin: "0px 15px 0px 0px",
												display: "inline-block",
											}}
											name="availcountInput"
											onChange={this.handleChange}
											value={this.state.availcountInput}
										/>
										<input
											type="checkbox"
											disabled={this.state.availcountInput > 0}
											style={{
												margin: "0px 15px 0px 0px",
												display: "inline-block",
											}}
											name="availcount"
											onChange={this.handleChange}
											checked={this.state.availcount === -1}
										/>{" "}
										infinity
									</div>
									{/* :
                        null
                    } */}
									{this.state.availcount === 0 &&
									this.state.availcountInput === 0 ? (
										<span className="text-danger">
											{this.state.fieldValidation}
										</span>
									) : null}

									<hr class="my-5" />
									{/* </div> */}
									<div className="col-12 text-center">
										{/* {
                      this.state.serverError
                        ?
                        <div className="text-center alert alert-success mb-5 position-relative" role="alert">

                          {this.state.serverError}

                        </div>
                        :
                        null
                    } */}
										<div className="form-group ">
											{this.state.offerUid === "" ? (
												<button
													className="btn btn-primary mr-3"
													onClick={this.handleSubmit}
												>
													{this.state.loader ? (
														<span
															class="spinner-grow spinner-grow-sm"
															role="status"
															aria-hidden="true"
														></span>
													) : null}
													Create Offer
												</button>
											) : (
												<button
													className="btn btn-primary mr-3"
													onClick={this.handleSubmit}
												>
													{this.state.loader ? (
														<span
															class="spinner-grow spinner-grow-sm"
															role="status"
															aria-hidden="true"
														></span>
													) : null}
													Update Offer
												</button>
											)}

											<button
												className="btn btn-outline-primary"
												onClick={() => this.props.history.push("/brand-offer")}
											>
												Cancel
											</button>
										</div>
									</div>
								</div>
							</form>
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

export default AddBrandoffer;
