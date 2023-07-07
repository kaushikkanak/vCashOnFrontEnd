/* eslint-disable eqeqeq */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { PUT, GET, POST } from "../Common/apiRoute";
import { ImageUrl } from "../Common/apiRoute";

class AddBanner extends Component {
	state = {
		title: {
			en: "",
			ar: "",
		},
		desc: {
			en: "",
			ar: "",
		},
		images: [],
		link: {
			type: null,
			id: "",
		},
		selectType: 1,
		selectValue: "",
		options: [],
		selectedOption: null,
		imageName: "",
		imageSize: 0,
		serverError: "",
		urlValidation: "",
		bannerId: "",
		selectValidation: "",
	};

	componentDidMount() {
		if (this.props.location?.state?.bannerDetail) {
			const { desc, images, title, link, uid } =
				this.props.location.state.bannerDetail;
			this.setState(
				{
					selectType: link.type,
					title,
					link,
					images,
					desc,
					bannerId: uid,
				},
				() => {
					this.callApi();
				}
			);
		} else {
			this.callApi();
		}
	}

	callApi = () => {
		if (this.state.selectType === 1) {
			this.getBrandsList();
		} else if (this.state.selectType === 2) {
			this.getOfferList();
		}
	};

	getBrandsList = () => {
		GET("brands/brands?lang=en")
			.then((res) => {
				this.setState({
					options: res.data.data,
				});
			})
			.catch((err) => console.log(err));
	};

	getOfferList = () => {
		GET(`offer/offers?lang=en&page=1&limit=500`)
			.then((res) => {
				if (res.data.status == 1) {
					this.setState({
						options: res.data.data,
					});
				}
			})
			.catch((err) => console.log(err));
	};

	selectField = (e) => {
		console.log("e= ", e.target.value);
		this.setState({
			link: {
				...this.state.link,
				type: parseInt(this.state.selectType),
				id: e.target.value,
			},
		});
	};

	radioCheck = async (e) => {
		let { name, value, id } = e.target;
		if (name === "radio") {
			await this.setState(
				{
					selectType: parseInt(id),
					selectValue: value,
				},
				() => {
					if (parseInt(this.state.selectType) === 1) {
						this.getBrandsList();
					} else if (parseInt(this.state.selectType) === 2) {
						this.getOfferList();
					}
				}
			);
		}
	};

	handleChange = (e) => {
		let { name, value } = e.target;
		if (name === "url") {
			this.setState({
				link: {
					...this.state.link,
					id: value,
					type: parseInt(this.state.selectType),
				},
			});
		} else if (name === "en" || name === "ar") {
			this.setState({
				title: {
					...this.state.title,
					[name]: value,
				},
			});
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
		}
		console.log(this.state);
	};

	uploadImage = (e) => {
		let { name, files } = e.target;
		let imageSize = files[0].size / 1024;
		let fileSize = files[0].size / (1024 * 1024);
		if (fileSize <= 3) {
			const fd = new FormData();
			fd.append("file", files[0]);
			this.setState({
				loader1: true,
			});
			POST(`files/upload/${name}`, fd, { headerStatus: true })
				.then((res) => {
					this.setState(
						{
							images: [res.data.data[0].s3key],
							imageName: files[0].name,
							imageSize: imageSize,
							loader1: false,
						},
						() => console.log(this.state)
					);
				})
				.catch((err) => {
					this.setState({
						loader1: false,
					});
				});
		} else {
			this.setState({
				imageValidation: "image should be less than or equal to 2MB.",
				loader1: false,
			});
		}
	};

	handleSubmit = (e) => {
		e.preventDefault();
		let { title, desc, link, images, selectType } = this.state;
		// console.log("link = ", link)

		let linkId = link.id;
		let check = false;
		if (selectType === 3) {
			check = linkId
				? linkId.includes("http://") || linkId.includes("https://")
				: true;
			console.log(
				"check = ",
				check,
				linkId,
				linkId.includes("http://"),
				linkId.includes("https://")
			);
			link.id = check ? linkId : "http://" + linkId;
		} else {
			link.id = "";
		}
		// let check = linkId.includes("http://") || linkId.includes("https://");
		// link.id = check ? linkId : "http://" + linkId
		link._id = selectType === 3 ? "" : linkId;

		let obj = {
			title: {
				en: title.en === "" ? title.ar : title.en,
				ar: title.ar === "" ? title.en : title.ar,
			},
			desc: {
				en: desc.en === "" ? desc.ar : desc.en,
				ar: desc.ar === "" ? desc.en : desc.ar,
			},
			link: link,
			images: images,
		};
		// console.log("obj = ",obj)
		if (
			obj.title.en !== "" &&
			obj.title.en !== "" &&
			obj.desc.en !== "" &&
			obj.desc.ar !== "" &&
			obj.images.length > 0
		) {
			if (selectType === 3 && obj.link.id == "") {
				return this.setState({ urlValidation: "Please Enter a URL !" });
			}
			if (selectType === 3 && !this.is_url(obj.link.id)) {
				return this.setState({ urlValidation: "Please Enter a valid URL !" });
			}
			if (selectType !== 3 && linkId == "") {
				return this.setState({
					selectValidation: `Please Select ${
						selectType === 1 ? "Brands" : "Offers"
					}`,
				});
			}
			this.setState({
				loader: true,
			});
			if (this.props.location?.state?.bannerDetail) {
				let { bannerDetail } = this.props.location?.state;
				PUT(`offer/homebanner/${bannerDetail.uid}`, obj)
					.then((res) => {
						if (res.data.status === 1) {
							this.setState(
								{
									serverError: res.data.message,
									loader: false,
								},
								() => {
									setTimeout(() => {
										this.props.history.push("/banner");
									}, 2000);
								}
							);
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
				POST("offer/homebanner", obj, { headerStatus: true })
					.then((res) => {
						if (res.data.status === 1) {
							this.setState(
								{
									serverError: res.data.message,
									loader: false,
								},
								() => {
									setTimeout(() => {
										this.props.history.push("/banner");
									}, 2000);
								}
							);
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
			}
		} else {
			this.setState({
				fieldValidation: "Field Required*",
				loader: false,
			});
		}
	};

	is_url = (str) => {
		let regexp =
			/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

		if (regexp.test(str)) {
			return true;
		} else {
			return false;
		}
	};

	render() {
		const {
			selectType,
			selectValue,
			options,
			imageName,
			imageSize,
			images,
			title,
			desc,
			link,
			urlValidation,
			selectValidation,
		} = this.state;
		return (
			<>
				<div class="main-content">
					<div className="header">
						<div className="container-fluid">
							<div className="header-body">
								<div className="row align-items-end">
									<div className="col">
										<h6 className="header-pretitle"> Overview</h6>
										<h1 className="header-title">Banner</h1>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class="container">
						<div class="row">
							<div class="col-sm-12 col-md-12">
								<form>
									<div class="row">
										<div class="col-12 col-sm-12 col-md-12 col-lg-12">
											<div class="form-group">
												<div id="group2" className="mb-4">
													Brands:
													<input
														type="radio"
														id="1"
														value="Brand"
														checked={selectType === 1}
														name="radio"
														style={{ margin: "0px 15px 0px 10px" }}
														onChange={this.radioCheck}
													/>
													Offers:
													<input
														type="radio"
														id="2"
														value="Offer"
														name="radio"
														checked={selectType === 2}
														style={{ margin: "0px 15px 0px 10px" }}
														onChange={this.radioCheck}
													/>
													Third Party:
													<input
														type="radio"
														id="3"
														value="Third Party"
														checked={selectType === 3}
														style={{ margin: "0px 15px 0px 10px" }}
														name="radio"
														onChange={this.radioCheck}
													/>
												</div>
												{selectType === 1 ? (
													<div class="col-12">
														<select
															className="custom-select"
															name="select"
															value={link.id}
															onChange={this.selectField}
														>
															<option> Select {selectValue} </option>
															{options?.map((ele, index) => {
																return (
																	<option key={index} value={ele.uid}>
																		{" "}
																		{ele.name}{" "}
																	</option>
																);
															})}
														</select>
														{selectValidation !== "" ? (
															<span className="text-danger">
																{selectValidation}
															</span>
														) : null}
													</div>
												) : selectType === 2 ? (
													<div class="col-12">
														<select
															className="custom-select"
															name="select"
															value={link.id}
															onChange={this.selectField}
														>
															<option> Select {selectValue} </option>
															{options?.map((ele, index) => {
																return (
																	<option key={index} value={ele.uid}>
																		{" "}
																		{ele?.title?.en}{" "}
																	</option>
																);
															})}
														</select>
														{selectValidation !== "" ? (
															<span className="text-danger">
																{selectValidation}
															</span>
														) : null}
													</div>
												) : selectType === 3 ? (
													<div class="col-12">
														<div class="form-group">
															<label>URL</label>
															<input
																type="text"
																class="form-control mb-3"
																name="url"
																value={link.id}
																onChange={this.handleChange}
																placeholder="URL"
															/>
															{urlValidation !== "" ? (
																<span className="text-danger">
																	{urlValidation}
																</span>
															) : null}
														</div>
													</div>
												) : null}
											</div>
										</div>
										<div class="col-12">
											<hr class="mb-5 mt-3" />
										</div>
										<div class="col-12">
											<div class="form-group">
												<label>Title</label>
												<input
													type="text"
													class="form-control mb-3"
													name="en"
													value={title.en}
													onChange={this.handleChange}
													placeholder="English"
												/>
											</div>
										</div>
										<div class="col-12">
											<div class="form-group">
												<label>Title</label>
												<input
													type="text"
													class="form-control mb-3"
													dir="rtl"
													name="ar"
													value={title.ar}
													onChange={this.handleChange}
													placeholder="Arabic"
												/>
												{title.en === "" ? (
													<span className="text-danger">
														{this.state.fieldValidation}
													</span>
												) : null}
											</div>
										</div>
										<div class="col-12">
											<hr class="mb-5 mt-3" />
										</div>
										<div class="col-12">
											<div class="form-group">
												<label>Description</label>
												<textarea
													class="form-control"
													id="comment"
													name="desc_en"
													value={desc.en}
													onChange={this.handleChange}
													placeholder="English"
												></textarea>
											</div>
										</div>
										<div class="col-12">
											<div class="form-group">
												<label>Description</label>
												<textarea
													class="form-control"
													id="comment"
													dir="rtl"
													name="desc_ar"
													value={desc.ar}
													onChange={this.handleChange}
													placeholder="Arabic"
												></textarea>
												{desc.en === "" ? (
													<span className="text-danger">
														{this.state.fieldValidation}
													</span>
												) : null}
											</div>
										</div>
										<div class="col-12">
											<hr class="mb-5 mt-3" />
										</div>
										<div class="col-12">
											<div class="form-group">
												<label>Upload Banner</label>
												<div class="dropzone dropzone-multiple">
													<div class="dz-default dz-message">
														<button class="dz-button" type="button">
															{this.state.loader1 ? (
																<span
																	class="spinner-grow spinner-grow-sm position-relative"
																	role="status"
																	aria-hidden="true"
																></span>
															) : null}
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
													{images.length > 0 ? (
														<ul class="dz-preview dz-preview-multiple list-group list-group-lg list-group-flush">
															<li class="list-group-item">
																<div class="row align-items-center">
																	<div class="col-auto">
																		<div class="avatar">
																			{images.length > 0 && (
																				<img
																					class="avatar-img rounded"
																					src={
																						images.length > 0 &&
																						`${ImageUrl}${images[0]}`
																					}
																					alt="..."
																					data-dz-thumbnail
																				/>
																			)}
																		</div>
																	</div>
																	<div class="col ml-n3">
																		<h4 class="mb-1" data-dz-name>
																			{imageName}
																		</h4>

																		{imageSize ? (
																			<small
																				class="text-muted"
																				data-dz-size
																			>{`${Math.round(imageSize)} KB`}</small>
																		) : null}
																	</div>
																	<div class="col-auto">
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
																					data-dz-remove
																				>
																					Remove
																				</Link>
																			</div>
																		</div>
																	</div>
																</div>
															</li>
														</ul>
													) : (
														<span className="text-danger">
															{this.state.fieldValidation}
														</span>
													)}
												</div>

												<hr class="my-5" />

												<div class="col-12 text-center">
													{this.state.serverError ? (
														<div
															className="text-center alert alert-success mb-5 position-relative"
															role="alert"
														>
															{this.state.serverError}
														</div>
													) : null}
													<div class="form-group">
														{this.state.bannerId === "" ? (
															<button
																class="btn btn-primary mr-3"
																onClick={this.handleSubmit}
															>
																{this.state.loader ? (
																	<span
																		class="spinner-grow spinner-grow-sm"
																		role="status"
																		aria-hidden="true"
																	></span>
																) : null}
																Create Banner
															</button>
														) : (
															<button
																class="btn btn-primary mr-3"
																onClick={this.handleSubmit}
															>
																{this.state.loader ? (
																	<span
																		class="spinner-grow spinner-grow-sm"
																		role="status"
																		aria-hidden="true"
																	></span>
																) : null}
																Update Banner
															</button>
														)}

														<button
															class="btn btn-outline-primary"
															onClick={() => this.props.history.push("/banner")}
														>
															Cancel
														</button>
													</div>
												</div>
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
										src={require("../assets/img/TEST-white-logo.svg")}
										alt="..."
									/>
								</span> */}
								<span class="position-relative top-4">
									Copyright © {new Date().getFullYear()} All Rights Reserved.
								</span>
							</p>
						</div>
					</footer>
				</div>
			</>
		);
	}
}
export default AddBanner;
