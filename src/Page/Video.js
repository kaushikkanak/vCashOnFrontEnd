/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
// import SideBar from "../Page/SideBar/Sidebar";
import { DELETE, GET, POST, ImageUrl } from "../Common/apiRoute";
import { Link } from "react-router-dom";
import moment from "moment";

class Video extends Component {
	state = {
		videoList: [],
		videoUrl: "",
		en: "",
		ar: "",
		videoLoad: false,
		imageLoad: false,
		name: "",
		thumbnail: "",
		imgName: "",
	};

	componentDidMount() {
		this.getvideos();
	}

	getvideos = () => {
		GET(`users/promovideo`)
			.then((res) => {
				this.setState({
					videoList: res.data.data,
				});
			})
			.catch((err) => console.log(err));
	};

	addToPlayer = (url) => {
		this.setState({
			videoUrl: url,
		});
	};

	handleChange = async (e) => {
		let { name, value } = e.target;
		// if (name === "videoUrl") {
		//   await this.setState({
		//     videoUrl: value,
		//   });
		// } else
		if (name === "en") {
			await this.setState({
				en: value,
			});
		} else if (name === "ar") {
			await this.setState({
				ar: value,
			});
		}
		// console.log(this.state);
	};

	postVideo = () => {
		if (this.state.videoUrl && this.state.thumbnail) {
			let obj = {
				title: { en: this.state.en, ar: this.state.ar },
				desc: { en: "Second Video", ar: "أول فيديو" },
				url: this.state.videoUrl,
				thumbnail: this.state.thumbnail,
			};
			POST("users/promovideo", obj, { headerStatus: true })
				.then((res) => {
					console.log(res);
					if (res.data.status === 1) {
						this.getvideos();
						this.setState({
							name: "",
							imgName: "",
							videoUrl: "",
							thumbnail: "",
							en: "",
							ar: "",
						});
					} else {
						this.setState({
							serverError: res.data.message,
						});
					}
				})
				.catch((err) => console.log(err));
		} else {
			alert("Video and thumbnail can not be empty .");
		}
	};

	deleteVideo = (uid) => {
		DELETE(`users/promovideo/${uid}`)
			.then((res) => {
				if (res.data.status === 1) {
					this.getvideos();
				} else {
					alert(res.data.message);
				}
			})
			.catch((err) => console.log(err));
	};

	onFileChange = async (e, type) => {
		let { files } = e.target;
		// console.log("files = ", files[0]);
		if (files) {
			this.setState({
				videoLoad: type === "1" ? true : false,
				imageLoad: type === "2" ? true : false,
			});
			const fd = new FormData();
			fd.append("file", files[0]);
			fd.append("type", type);
			await POST(`users/addVideo`, fd)
				.then((res) => {
					// console.log(res);
					if (res.data.status === 1) {
						let data = res?.data?.data?.[0]?.s3key;
						let name = files[0].name;
						if (type === "1") {
							this.setState({
								videoLoad: false,
								imageLoad: false,
								videoUrl: ImageUrl + data,
								name,
							});
						} else {
							this.setState({
								videoLoad: false,
								imageLoad: false,
								thumbnail: ImageUrl + data,
								imgName: name,
							});
						}
					} else {
						alert(res.data.message);
					}
				})
				.catch((err) => {
					this.setState({
						videoLoad: false,
						imageLoad: false,
					});
					console.log(err);
				});
		} else {
			this.setState({
				imageValidation: "image should be less than or equal to 2MB.",
			});
		}
	};

	render() {
		return (
			// <div className="section">
			//  <SideBar/>
			<div class="main-content">
				<div className="header">
					<div className="container-fluid">
						<div className="header-body">
							<div className="row align-items-end">
								<div className="col">
									<h6 className="header-pretitle">Overview</h6>
									<h1 className="header-title">Video</h1>
								</div>
								<div className="col-auto ">
									<a
										href="/addbrand"
										className="btn btn-primary lift"
										data-toggle="modal"
										data-target="#upload-video"
									>
										Add Promo video
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="container-fluid">
					<div class="row">
						{
							// <div key={index} class="col-12 col-sm-3 col-md-3 col-lg-3">
							//   <div class="card lift">
							//     <img src={require('../assets/img/covers/video.png')} className="video card-img-top" onClick={() => this.addToPlayer(ele.url)} data-toggle="modal" data-target="#video" alt="..." />
							//     {/* <button onClick={()=>this.deleteVideo(ele.uid)}>Delete</button> */}
							//     <div class="card-body">
							//     <div class="row align-items-center">
							//     <div class="col">
							//       <h4 class="mb-2"> <a href="project-overview.html">www.cliffec.com</a></h4>
							//       <p class="small text-muted mb-0">22/092020 </p>
							//     </div>
							//     <div class="col-auto">
							//       <div class="dropdown">
							//         <a href="#" class="dropdown-ellipses dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							//           <i class="fe fe-more-vertical"></i>
							//         </a>
							//         <div class="dropdown-menu dropdown-menu-right">
							//           <a href="#!" class="dropdown-item" onClick={()=>this.deleteVideo(ele.uid)}>
							//           Delete
							//           </a>
							//         </div>
							//       </div>
							//     </div>
							//   </div>
							//     </div>
							//   </div>
							// </div>
						}
						<div class="card w-100">
							<div class="card-header">
								<h4 class="card-header-title"> Video </h4>
							</div>
							<div class="card-body">
								<ul class="list-group list-group-lg list-group-flush list my-n4">
									{this.state.videoList?.map((ele, index) => {
										return (
											<li key={index} className="list-group-item">
												<div className="row align-items-center m-2">
													<div className="col-auto">
														<a
															href={ele.url}
															target="blank"
															className="avatar avatar-lg"
														>
															<img
																src={require("../assets/img/covers/video.png")}
																className="avatar-img rounded"
																alt="..."
															/>
														</a>
													</div>
													<div className="col ml-n2">
														<h4 className="mb-1 name">
															<a href={ele.url}>{ele.title.en}</a>
														</h4>
														<p className="card-text small text-muted mb-1">
															<time dateTime="2018-01-03">
																{moment(ele.createdAt).format("DD MMM YYYY")}
															</time>
														</p>
													</div>
													<div className="col-auto">
														<a
															href={ele.url}
															target="blank"
															className="btn btn-sm btn-white d-none d-md-inline-block"
														>
															View
														</a>
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
																<Link
																	className="dropdown-item"
																	onClick={() => this.deleteVideo(ele.uid)}
																>
																	Delete
																</Link>
															</div>
														</div>
													</div>
												</div>
											</li>
										);
									})}
								</ul>
							</div>
						</div>
					</div>
				</div>
				{/* <div className="modal fade" id="video" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content bg-transparent">
              <div class="embed-responsive embed-responsive-16by9">
                <iframe class="embed-responsive-item" src={this.state.videoUrl}></iframe>
              </div>
            </div>
          </div>
        </div> */}
				<div
					className="modal fade"
					id="upload-video"
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
										Add Promo video
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
									<div
										className="dropzone dropzone-multiple"
										data-toggle="dropzone"
										data-options='{"url": "https://"}'
									>
										{/* <input type="text" class="form-control mb-3" placeholder="Youtube Url" name="videoUrl" onChange={this.handleChange} /> */}
										<div
											className="dropzone dropzone-multiple"
											data-toggle="dropzone"
											data-options='{"url": "https://"}'
										>
											<div class="dz-default dz-message mb-3">
												<button class="dz-button" type="button">
													{this.state.videoLoad
														? "Loading ..."
														: " Drop Video here to upload"}
												</button>
												<input
													type="file"
													id="input-file-now"
													class="file-upload"
													accept="video/*"
													name="file"
													onChange={(e) => this.onFileChange(e, "1")}
												/>
											</div>
											{this.state.name && (
												<h4 style={{ color: "#95AAC9" }}>
													video : {this.state.name}
												</h4>
											)}
											<div class="dz-default dz-message mb-3">
												<button class="dz-button" type="button">
													{this.state.imageLoad
														? "Loading ..."
														: " Drop thumbnail image here to upload"}
												</button>
												<input
													type="file"
													id="input-file-now"
													class="file-upload"
													accept="image/*"
													name="file"
													onChange={(e) => this.onFileChange(e, "2")}
												/>
											</div>
											{this.state.imgName && (
												<h4 style={{ color: "#95AAC9" }}>
													thumbnail : {this.state.imgName}
												</h4>
											)}
											<input
												type="text"
												class="form-control mb-3"
												placeholder="Name in English"
												name="en"
												onChange={this.handleChange}
											/>
											<input
												type="text"
												class="form-control"
												dir="rtl"
												placeholder="Name in Arabic"
												name="ar"
												onChange={this.handleChange}
											/>
										</div>
										<div class="text-center mt-4">
											<button
												type="button"
												className="btn btn-primary mr-3"
												data-dismiss={
													this.state.videoUrl && this.state.thumbnail
														? "modal"
														: ""
												}
												onClick={this.postVideo}
											>
												Add Promo Video
											</button>
											{/* <button type="button" className="btn btn-outline-primary" aria-hidden="true">Cancel</button> */}
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
			</div>
		);
	}
}

export default Video;
