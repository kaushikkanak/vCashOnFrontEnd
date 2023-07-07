/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { GET } from "../../Common/apiRoute";
// import { getBrandImage } from "../../Common/helperFunctions";
import { ImageUrl } from "../../Common/apiRoute";

class Sidebar extends Component {
	state = {
		bottomList: [],
		topList: [],
		activeClass: "User",
		openModal: false,
		route: "",
		brandIcon: "",
	};

	componentDidMount() {
		this.getuserBrandList();
		GET("users/config")
			.then((res) => {
				console.log(
					"res.data.data.role.adminMenu = ",
					res.data.data.role.adminMenu
				);
				this.setState({
					bottomList: res.data.data.role.adminMenu.bottom,
					topList: res.data.data.role.adminMenu.top,
				});
			})
			.catch((err) => console.log(err));
	}

	getuserBrandList = async () => {
		GET("brands/UserBrandOffers")
			.then(async (res) => {
				// console.log("------   ",res.data.brand);
				localStorage.setItem("brandUid", res.data.brand.uid);
				await this.setState({
					brandIcon: res.data.brand.icon,
				});
			})
			.catch((err) => console.log(err));
	};

	classChange = (title) => {
		this.setState({
			activeClass: title,
		});
	};

	logOut = () => {
		localStorage.clear();
		window.location.href = "/";
	};

	render() {
		return (
			<nav
				className="navbar navbar-vertical fixed-left navbar-expand-md navbar-dark navbar-vibrant z-index"
				id="sidebar"
			>
				<div className="container-fluid">
					<button
						className="navbar-toggler"
						type="button"
						data-toggle="collapse"
						data-target="#sidebarCollapse"
						aria-controls="sidebarCollapse"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<span className="navbar-toggler-icon" />
					</button>
					{/* <a className="navbar-brand" style={this.state.brandIcon === "" ? {} : { filter: "none" }} href="#">
            {
              this.state.brandIcon === ""
                ?
                <img className="navbar-brand-img mx-auto" src={require("../../assets/img/test-white-logo.svg")} alt="..." />
                :
                <div class=" brnad-logo">
                  <img className="" src={`${ImageUrl}${this.state.brandIcon}`} alt="..." />
                </div>

            }
          </a> */}
					{/* <div className="navbar-user d-md-none">
            <div className="dropdown">
              <a href="#" id="sidebarIcon" className="dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <div className="avatar avatar-sm avatar-online">
                  <img src={require('../../assets/img/avatars/profiles/avatar-1.jpg')} className="avatar-img rounded-circle" alt="..." />
                </div>
              </a>
              <div className="dropdown-menu dropdown-menu-right" aria-labelledby="sidebarIcon">
                <a href="#" className="dropdown-item">Profile</a>
                <a href="#" className="dropdown-item">Settings</a>
                <hr className="dropdown-divider" />
                <a href="#" className="dropdown-item">Logout</a>
              </div>
            </div>
          </div> */}
					<div className="collapse navbar-collapse" id="sidebarCollapse">
						{/* <form className="mt-4 mb-3 d-md-none">
              <div className="input-group input-group-rounded input-group-merge">
                <input type="search" className="form-control form-control-rounded form-control-prepended" placeholder="Search" aria-label="Search" />
                <div className="input-group-prepend">
                  <div className="input-group-text">
                    <span className="fe fe-search" />
                  </div>
                </div>
              </div>
            </form> */}
						<ul className="navbar-nav">
							{this.state.topList?.map((list, index) => {
								return !list.hasChild ? (
									<li key={index} className="nav-item">
										<Link
											to={list.route}
											className={
												this.state.activeClass === list.title
													? "nav-link active"
													: "nav-link"
											}
											onClick={() => this.classChange(list.title)}
										>
											{" "}
											<i className={list.icon} /> {list.title}{" "}
										</Link>
									</li>
								) : (
									<li key={index} className="nav-item">
										<Link
											className="nav-link"
											data-toggle="collapse"
											data-target="#sidebarmenu"
											aria-expanded="false"
											aria-controls="sidebarmenu"
										>
											{" "}
											<i className="fe fe-message-square" /> {list.title}{" "}
										</Link>
										<div class="collapse" id="sidebarmenu">
											<ul class="nav nav-sm flex-column">
												{list.children.map((sublist, index) => {
													return (
														<li key={index} class="nav-item">
															<Link to={sublist.route} className="nav-link">
																{" "}
																<i className={sublist.icon} /> {sublist.title}{" "}
															</Link>
														</li>
													);
												})}
											</ul>
										</div>
									</li>
								);
							})}
							<hr class="navbar-divider my-3"></hr>
							{this.state.bottomList?.map((list, index) => {
								if (list.route === "/") {
									return;
								} else {
									return (
										<li key={index} className="nav-item">
											<Link
												to={list.route}
												className={
													this.state.activeClass === list.title
														? "nav-link active"
														: "nav-link"
												}
												onClick={() => this.classChange(list.title)}
											>
												<i className={list.icon} /> {list.title}{" "}
											</Link>
										</li>
									);
								}
							})}
							<li className="nav-item">
								<Link
									className="nav-link"
									data-toggle="modal"
									data-target="#Logout"
								>
									<i className="fe fe-unlock" /> Logout{" "}
								</Link>
							</li>
						</ul>

						<div className="mt-auto" />
					</div>
					<div class="navbar-user d-md-block d-none">
						<a href="#" class="d-block text-center">
							<div class="avatar avatar-sm ">
								{/* <img className="navbar-brand-img mx-auto" src={require('../../assets/img/test-white-logo.svg')} alt="..." /> */}
							</div>
						</a>
						<p class="d-block text-white text-center mb-0 opacity-8 font-sm">
							Copyright © {new Date().getFullYear()} <br />
							All Rights Reserved.
						</p>
					</div>
				</div>
				<div
					className="modal fade"
					id="Logout"
					tabIndex={-1}
					role="dialog"
					aria-labelledby="exampleModalCenterTitle"
					aria-hidden="true"
				>
					<div className="modal-dialog modal-dialog-centered" role="document">
						<div className="modal-content">
							<div class="modal-card card">
								<div class="card-header py-5 my-3">
									<h4
										class="card-header-title text-center"
										id="exampleModalCenterTitle"
									>
										Do you really want to Logout?
									</h4>
									{/* <button type="button" class="close" data-dismiss="modal" aria-label="Close"data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                  </button> */}
								</div>
								<div class="card-body">
									{/* <p class="text-center"> </p> */}
									<div class="text-center">
										<button
											type="button"
											class="btn btn-light mr-3"
											data-dismiss="modal"
											aria-label="Close"
										>
											<span aria-hidden="true">Cancel</span>
										</button>
										<Link onClick={this.logOut}>
											<button
												type="button"
												className="btn  btn-danger mr-3"
												data-dismiss="modal"
											>
												Logout
											</button>
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</nav>
		);
	}
}
export default Sidebar;
