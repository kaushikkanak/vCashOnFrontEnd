import React, { Component } from 'react'
// import Dashboard from '../Page/Dashboard'
import User from '../Page/User'
import Brand from '../Page/Brand'
import Offer from '../Page/Offer'
import Feedback from '../Page/Feedback'
import Addbrand from '../Page/Addbrand'
import Addoffer from '../Page/Addoffer'
import Video from '../Page/Video'
import Manageadmin from './Manageadmin'
import Addadmin from '../Page/Addadmin'
import SignIn from '../Page/SignIn'
import Password from '../Page/Password'
import Details from '../Page/Details'
import Category from '../Page/Category'
import Createcategory from '../Page/Createcategory'
import Setting from '../Page/Setting'
import Branddetail from '../Page/Branddetail'
import Adminchange from '../Page/AdminChange'
import Banner from '../Page/Banner'
import AddBanner from '../Page/AddBanner'
import Bannerdetail from '../Page/Bannerdetail'
import BrandOffer from '../Page/BrandOffer';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import SideBar from '../Page/SideBar/Sidebar'
import { PrivateRoute } from "../Common/authRoute";
import Userbrand from './Userbrand'
import ActiveCoupon from './ActiveCoupon'
// import Qrcodescan from './Qrcodescan'
import AddBrandoffer from './AddBrandOffers';

class Main extends Component {

    render() {
        return (
            <React.Fragment>
                <Router>
                    <Switch>
                        <Route exact path="/" component={SignIn} />
                        <div className="section">
                            <SideBar/>
                            <PrivateRoute exact path="/password" component={Password} />
                            {/* <Route exact path="/dashboard" component={Dashboard} /> */}
                            <PrivateRoute exact path="/user" component={User} />
                            <PrivateRoute exact path="/brand" component={Brand} />
                            <PrivateRoute exact path="/offer" component={Offer} />
                            <PrivateRoute exact path="/feedback" component={Feedback} />
                            <PrivateRoute exact path="/addbrand" component={Addbrand} />
                            <PrivateRoute exact path="/addoffer" component={Addoffer} />
                            <PrivateRoute exact path="/video" component={Video} />
                            <PrivateRoute exact path="/manageadmin" component={Manageadmin} />
                            <PrivateRoute exact path="/addadmin" component={Addadmin} />
                            <PrivateRoute exact path="/details" component={Details} />
                            <PrivateRoute exact path="/category" component={Category} />
                            <PrivateRoute exact path="/setting" component={Setting} />
                            <PrivateRoute exact path="/createcategory" component={Createcategory} />
                            <PrivateRoute exact path="/branddetail" component={Branddetail} />
                            <PrivateRoute exact path="/adminchange" component={Adminchange} />
                            <PrivateRoute exact path="/banner" component={Banner} />
                            <PrivateRoute exact path="/addbanner" component={AddBanner} />
                            <PrivateRoute exact path="/Bannerdetail" component={Bannerdetail} />
                            <PrivateRoute exact path="/userbrand" component={Userbrand} />
                            <PrivateRoute exact path="/ActiveCoupons" component={ActiveCoupon} />
                            <PrivateRoute exact path="/brand-offer" component={BrandOffer} />
                            <PrivateRoute exact path="/addbrandoffer" component={AddBrandoffer} />
                            
                            
                        </div>
                    </Switch>
                </Router>
            </React.Fragment>
        )
    }
}

export default Main;