/* eslint-disable eqeqeq */
import React, { Component } from "react";
// import SideBar from '../Page/SideBar/Sidebar'
import { GET, POST, PUT } from "../Common/apiRoute";
import { Link, NavLink } from "react-router-dom";
import Select from "react-select";
import { ImageUrl } from "../Common/apiRoute";

class Addbrand extends Component {
	state = {
		categories: [],
		name: {
			en: "",
			ar: "",
		},
		tagline: {
			en: "",
			ar: "",
		},
		webUrl: "",
		icon: "",
		images: [],
		categId: "",
		imageValidation: "",
		imageName: "",
		imageSize: "",
		brandUid: "",
		loader: false,
		loader1: false,
		loader2: false,
		selectedOption: null,
	};

	componentDidMount() {
		let propValue = this.props.location?.state?.brandDetail;
		if (propValue) {
			const { icon, images, name, tagline, webUrl, uid, categId } =
				this.props.location.state.brandDetail;
			this.setState({
				name,
				tagline,
				icon,
				images,
				webUrl,
				brandUid: uid,
				categId,
				// selectedOption: { label: name.en, value: categId}
			});
		}

		GET("category/list?lang=en")
			.then((res) => {
				let data = res?.data?.data;
				let val = null;
				if (propValue) {
					data.forEach((item) => {
						if (item?.uid == propValue?.categId) {
							val = { value: item.uid, label: item.name };
						}
					});
				}
				this.setState({
					categories: data,
					selectedOption: val,
				});
			})
			.catch((err) => console.log(err));
	}

	uploadImage = (e) => {
		let { name, files } = e.target;
		let imageSize = files[0].size / 1024;
		let fileSize = files[0].size / (1024 * 1024);
		if (fileSize <= 2) {
			const fd = new FormData();
			fd.append("file", files[0]);
			if (name === "brandImage") {
				this.setState({
					loader1: true,
					imageValidation: "",
				});
			} else {
				this.setState({
					loader2: true,
					imageValidation: "",
				});
			}

			POST(`files/upload/${name}`, fd, { headerStatus: true })
				.then((res) => {
					if (name === "brandImage") {
						this.setState({
							images: [res.data.data[0].s3key],
							imageName: files[0].name,
							imageSize: imageSize,
							loader1: false,
						});
					} else if (name === "iconImage") {
						this.setState({
							icon: res.data.data[0].s3key,
							loader2: false,
						});
					}
				})
				.catch((err) => {
					this.setState({
						loader1: false,
						loader2: false,
					});
				});
		} else {
			this.setState({
				imageValidation: "image should be less than or equal to 2MB.",
				loader1: false,
				loader2: false,
			});
		}
	};

	handleChange = (e) => {
		if (e?.value) {
			this.setState({
				categId: e.value,
				selectedOption: e,
			});
		} else {
			let { name, value } = e.target;
			if (name === "name_en") {
				this.setState({
					name: {
						...this.state.name,
						en: value,
					},
				});
			} else if (name === "name_ar") {
				this.setState({
					name: {
						...this.state.name,
						ar: value,
					},
				});
			} else if (name === "desc_en") {
				this.setState({
					webUrl: value,
				});
			} else if (name === "tagline_en") {
				this.setState({
					tagline: {
						...this.state.tagline,
						en: value,
					},
				});
			} else if (name === "tagline_ar") {
				this.setState({
					tagline: {
						...this.state.tagline,
						ar: value,
					},
				});
			} else if (name === "categId") {
				this.setState({
					categId: value,
				});
			}
		}
	};

	handleSubmit = (e) => {
		e.preventDefault();
		let { name, tagline, webUrl, icon, images, categId } = this.state;
		let check = webUrl.includes("http://") || webUrl.includes("https://");
		let url = check ? webUrl : "http://" + webUrl;
		// console.log("url = ",url)
		let obj = {
			name: {
				en: name.en === "" ? name.ar : name.en,
				ar: name.ar === "" ? name.en : name.ar,
			},
			tagline: {
				en: tagline.en === "" ? tagline.ar : tagline.en,
				ar: tagline.ar === "" ? tagline.en : tagline.ar,
			},
			webUrl: url,
			icon: icon,
			images: images,
			categId: categId,
		};
		if (
			obj.name.en !== "" &&
			obj.name.en !== "" &&
			obj.tagline.en !== "" &&
			obj.tagline.ar !== "" &&
			obj.webUrl !== "" &&
			obj.icon !== "" &&
			obj.images !== "" &&
			obj.categId !== ""
		) {
			this.setState({
				loader: true,
			});
			if (this.props.location?.state?.brandDetail) {
				let { brandDetail } = this.props.location?.state;
				PUT(`brands/brand/${brandDetail.uid}`, obj)
					.then((res) => {
						if (res.data.status === 1) {
							this.setState(
								{
									serverError: res.data.message,
									loader: false,
								},
								() => {
									setTimeout(() => {
										this.props.history.push("/brand");
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
				POST("brands/brand", obj, { headerStatus: true })
					.then((res) => {
						if (res.data.status === 1) {
							this.setState(
								{
									serverError: res.data.message,
									loader: false,
								},
								() => {
									setTimeout(() => {
										this.props.history.push("/brand");
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

	render() {
		const {
			name,
			tagline,
			webUrl,
			icon,
			images,
			categId,
			imageName,
			imageSize,
		} = this.state;
		let options = this.state.categories.map((item) => {
			return { value: item.uid, label: item.name };
		});
		return (
			<div className="main-content">
				<div className="header">
					<div className="container-fluid">
						<div className="header-body">
							<div className="row align-items-end">
								<div className="col">
									<h6 className="header-pretitle">Overview</h6>
									<h1 className="header-title text-capitalize">Brands</h1>
								</div>
								<div className="col-auto display-none">
									<NavLink to="/addbrand" className="btn btn-primary lift">
										Add Brands
									</NavLink>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="container">
					<div className="row">
						<div className="col-sm-12 col-md-12">
							<form>
								<div className="row justify-content-between align-items-center">
									<div className="col">
										<div className="row align-items-center">
											<div className="col-auto">
												<div className="avatar avatar-lg">
													<span class="avatar-title rounded-circle">
														{icon ? (
															<img
																className="avatar-img rounded-circle"
																src={`${ImageUrl}${icon}`}
																alt="..."
															/>
														) : (
															<span> W</span>
														)}
													</span>
												</div>
											</div>
											<div className="col ml-n2">
												<h4 className="mb-1">Upload Logo</h4>
												<small className="text-muted">
													PNG or JPG should be less than or equal to 2MB.
												</small>
											</div>
										</div>
									</div>
									<div className="col-auto">
										<button className="btn btn-sm btn-primary">
											<input
												type="file"
												id="input-file-now"
												className="file-upload"
												name="iconImage"
												onChange={this.uploadImage}
											/>
											{this.state.loader2 ? (
												<span
													class="spinner-grow spinner-grow-sm position-relative"
													role="status"
													aria-hidden="true"
												></span>
											) : null}
											Upload Logo
										</button>
									</div>
								</div>
								{this.state.icon === "" ? (
									<span className="text-danger">
										{this.state.fieldValidation}
									</span>
								) : null}
								<hr className="my-5" />
								<div className="row">
									<div className="col-12">
										<div className="form-group">
											<label>Select Category</label>
											{/* <select className="custom-select" name="categId" value={categId} onChange={this.handleChange}>
                        <option> Select </option>
                        {
                          categories?.map((ele, index) => {
                            return (
                              <option key={index} value={ele.uid}> {ele.name} </option>
                            )
                          })
                        }
                      </select> */}
											<Select
												className=""
												value={this.state.selectedOption}
												onChange={this.handleChange}
												options={options}
											/>
											{categId === "" ? (
												<span className="text-danger">
													{this.state.fieldValidation}
												</span>
											) : null}
										</div>
										<hr class="my-5" />
									</div>
									<div className="col-12 col-md-12">
										<div className="form-group">
											<label> Name</label>
											<input
												type="text"
												placeholder="English"
												className="form-control mb-3"
												name="name_en"
												value={name.en}
												onChange={this.handleChange}
											/>
											<input
												type="text"
												dir="rtl"
												placeholder="Arabic"
												className="form-control"
												name="name_ar"
												value={name.ar}
												onChange={this.handleChange}
											/>
											{name?.en === "" ? (
												<span className="text-danger">
													{this.state.fieldValidation}
												</span>
											) : null}
										</div>
										<hr class="my-5" />
									</div>
									<div className="col-12 col-md-12">
										<div className="form-group">
											<label> Website url</label>
											<input
												type="text"
												placeholder="English"
												className="form-control"
												name="desc_en"
												value={webUrl}
												onChange={this.handleChange}
											/>
											{webUrl === "" ? (
												<span className="text-danger">
													{this.state.fieldValidation}
												</span>
											) : null}
										</div>
										<hr class="my-5" />
									</div>
									<div className="col-12">
										<div className="form-group">
											<label>Tagline</label>
											<input
												type="text"
												placeholder="English"
												className="form-control mb-3"
												name="tagline_en"
												value={tagline.en}
												onChange={this.handleChange}
											/>
											<input
												type="text"
												dir="rtl"
												placeholder="Arabic"
												className="form-control"
												name="tagline_ar"
												value={tagline.ar}
												onChange={this.handleChange}
											/>
											{tagline?.en === "" ? (
												<span className="text-danger">
													{this.state.fieldValidation}
												</span>
											) : null}
										</div>
										<hr class="my-5" />
									</div>
									<div className="col-12">
										<div className="form-group">
											<label>Upload Brand image</label>
											<span className="text-danger p-4">
												{this.state.imageValidation}
											</span>
										</div>
										<div className="dropzone dropzone-multiple">
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
													name="brandImage"
													accept="image/*"
													onChange={this.uploadImage}
												/>
											</div>

											<ul className="dz-preview dz-preview-multiple list-group list-group-lg list-group-flush">
												<span className="text-muted mt-2">
													PNG or JPG should be less than or equal to 2MB.
												</span>
												{images && images.length > 0 ? (
													<li className="list-group-item">
														<div className="row align-items-center">
															<div className="col-auto">
																<div className="avatar">
																	{images.length > 0 && (
																		<span class="avatar-title rounded-circle">
																			<img
																				src={
																					images.length > 0 &&
																					`${ImageUrl}${images[0]}`
																				}
																				className="avatar-img rounded"
																				alt="..."
																				data-dz-thumbnail
																			/>
																		</span>
																	)}
																</div>
															</div>
															<div className="col ml-n3">
																<h4 className="mb-1" data-dz-name>
																	{imageName}
																</h4>
																{imageSize ? (
																	<small className="text-muted" data-dz-size>
																		{Math.round(imageSize)} KB
																	</small>
																) : null}
															</div>
															<div className="col-auto">
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
																			data-dz-remove
																		>
																			Remove
																		</Link>
																	</div>
																</div>
															</div>
														</div>
														{/* <div class="spinner-border text-primary" role="status">
                              <span class="sr-only">Loading...</span>
                            </div> */}
													</li>
												) : (
													<span className="text-danger">
														{this.state.fieldValidation}
													</span>
												)}
											</ul>
										</div>

										<hr class="my-5" />
									</div>

									<div className="col-12 text-center">
										{this.state.serverError ? (
											<div
												className="text-center alert alert-success mb-5 position-relative"
												role="alert"
											>
												{this.state.serverError}
											</div>
										) : null}
										<div className="form-group">
											{this.state.brandUid === "" ? (
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
													Create Brand
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
													Update Brand
												</button>
											)}

											<button
												className="btn btn-outline-primary"
												onClick={() => this.props.history.push("/brand")}
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

export default Addbrand;
