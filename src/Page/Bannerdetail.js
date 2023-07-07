import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { GET } from "../Common/apiRoute";
// import SideBar from "../Page/SideBar/Sidebar";
import { ImageUrl } from "../Common/apiRoute";

class Bannerdetail extends Component {
	state = {
		bannerDetail: {},
		brandDetail: {},
		offerDetail: {},
		bannerType: "",
		bannerName: "",
	};

	componentDidMount() {
		this.setState(
			{
				bannerDetail: this.props.location.state.bannerDetail,
			},
			async () => {
				if (this.state.bannerDetail.link.type === 1) {
					await this.getbrand(this.state.bannerDetail.link.id);
					this.setState({
						bannerType: "Brand",
					});
				} else if (this.state.bannerDetail.link.type === 2) {
					await this.getOffer(this.state.bannerDetail.link.id);
					this.setState({
						bannerType: "Offer",
					});
				} else if (this.state.bannerDetail.link.type === 3) {
					this.setState({
						bannerType: "Third Party",
					});
					this.setState({ bannerName: this.state.bannerDetail.link.id });
				}
			}
		);
	}

	getbrand = (uid) => {
		GET(`brands/brand/${uid}`)
			.then((res) => {
				this.setState({
					bannerName: res.data.data.name?.en,
				});
			})
			.catch((err) => console.log(err));
	};

	getOffer = (uid) => {
		GET(`offer/offer/${uid}?lang=ar`)
			.then((res) => {
				this.setState({
					bannerName: res.data.data[0].title,
				});
			})
			.catch((err) => console.log(err));
	};

	render() {
		const { images, desc, title } = this.state.bannerDetail;
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
						<form>
							<div class="row">
								<div class="col-12 col-sm-3 col-md-3 col-lg-3">
									<div class="card lift mb-0 mob-mb-30">
										<span class="avatar-title rounded-circle">
											<img
												class="avatar-img rounded-circle"
												src={`${ImageUrl}${images && images[0]}`}
												alt="..."
											/>
										</span>
									</div>
								</div>
								<div class="col-12 col-sm-3 col-md-3 col-lg-3">
									<div class="row justify-content-between align-items-center">
										<div class="col">
											<div class="row align-items-center">
												{/* <div class="col-auto">
                                                    <div class="avatar avatar-xl">
                                                        <img class="avatar-img rounded-circle" src={require('../assets/img/avatars/products/product-1.jpg')} alt="..." />
                                                    </div>
                                                </div> */}
												<div class="col ml-n2">
													<h4 class="mb-1"> {this.state.bannerType}</h4>
													<small class="text-muted">
														{this.state.bannerName}
													</small>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-12">
									<hr class="mb-5 mt-3" />
								</div>
								<div class="col-12">
									<div class="form-group">
										<h2 class="mb-2">Tittle English</h2>
										<p class="text-muted mb-xl-0">{title?.en}</p>
									</div>
								</div>
								<div class="col-12">
									<div class="form-group">
										<h2 class="mb-2">Tittle Arbic</h2>
										<p class="text-muted mb-xl-0">{title?.ar}</p>
									</div>
								</div>
								<div class="col-12">
									<hr class="mb-5 mt-3" />
								</div>
								<div class="col-12">
									<div class="form-group">
										<h2 class="mb-2">Description English</h2>
										<p class="text-muted mb-xl-0">{desc?.en}</p>
									</div>
								</div>
								<div class="col-12">
									<div class="form-group">
										<h2 class="mb-2">Description Arbic</h2>
										<p class="text-muted mb-xl-0">{desc?.ar}</p>
									</div>
								</div>
								<div class="col-12">
									<hr class="mb-5 mt-3" />
								</div>
							</div>
						</form>
					</div>
					<footer class="d-md-none d-block navbar-dark navbar-vibrant py-4">
						<div class="container-fluid">
							<p class="d-block text-white text-center mb-0 opacity-8 font-sm">
								{/* <span class="mr-2">
									<img
										className="navbar-brand-img mx-auto"
										src={require("../assets/img/-white-logo.svg")}
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
			</>
		);
	}
}
export default Bannerdetail;
