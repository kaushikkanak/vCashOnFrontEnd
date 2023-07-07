/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react'
// import SideBar from '../Page/SideBar/Sidebar'

class Dashboard extends Component{
    render(){
        return(
            <React.Fragment>
        {/* <div className="section">
        <SideBar/> */}
             <div class="main-content">
            <div className="header">
              <div className="container-fluid">
                {/* Body */}
                <div className="header-body">
                  <div className="row align-items-end">
                    <div className="col">
                      {/* Pretitle */}
                      <h6 className="header-pretitle">
                        Overview
                      </h6>
                      {/* Title */}
                      <h1 className="header-title">
                        User
                      </h1>
                    </div>
                    <div className="col-auto display-none">
                      {/* Button */}
                      <a href="/addbrand" className="btn btn-primary lift">
                        Add Brands
                      </a>
                    </div>
                  </div> {/* / .row */}
                </div> {/* / .header-body */}
              </div>
            </div>
            <div className="container-fluid">
              <div className="row">
                <div className="col-12">
                  {/* Goals */}
                  <div className="card">
                    <div className="card-header">
                      <div className="row align-items-center">
                        <div className="col">
                          {/* Title */}
                          <h4 className="card-header-title">
                            All User
                          </h4>
                        </div>
                        <div className="col-auto display-none">
                          {/* Button */}
                          <a href="#!" className="btn btn-sm btn-white">
                            Export
                          </a>
                        </div>
                      </div> {/* / .row */}
                    </div>
                    <div className="table-responsive mb-0" data-list="{&quot;valueNames&quot;: [&quot;goal-project&quot;, &quot;goal-status&quot;, &quot;goal-progress&quot;, &quot;goal-date&quot;]}">
                      <table className="table table-sm table-nowrap card-table">
                        <thead>
                          <tr>
                            <th>
                              <a href="#" className="text-muted list-sort" data-sort="goal-project">
                                First Name
                              </a>
                            </th>
                            <th>
                              <a href="#" className="text-muted list-sort" data-sort="goal-status">
                                last Name
                              </a>
                            </th>
                            <th>
                              <a href="#" className="text-muted list-sort" data-sort="goal-progress">
                                Email
                              </a>
                            </th>
                            <th>
                              <a href="#" className="text-muted list-sort" data-sort="goal-date">
                                Phone
                              </a>
                            </th>
                          
                            <th />
                          </tr>
                        </thead>
                        <tbody className="list">
                          <tr class="soft-dange">
                            <td className="goal-project">
                              Usman khan
                            </td>
                            <td className="goal-status ">
                              khan
                            </td>
                            <td className="goal-progress">
                              Usmankhan@gmail.com
                            </td>
                            <td className="goal-date">
                              9991262870
                            </td>
                          
                            <td className="text-right">
                              <div className="dropdown">
                                <a href="#" className="dropdown-ellipses dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                  <i className="fe fe-more-vertical" />
                                </a>
                                <div className="dropdown-menu dropdown-menu-right">
                                  <a href="#!" className="dropdown-item">
                                   Active
                                  </a>
                                
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="goal-project">
                              Usman khan
                            </td>
                            <td className="goal-status">
                              khan
                            </td>
                            <td className="goal-progress">
                              Usmankhan@gmail.com
                            </td>
                            <td className="goal-date">
                              9991262870
                            </td>
                          
                            <td className="text-right">
                              <div className="dropdown">
                                <a href="#" className="dropdown-ellipses dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                  <i className="fe fe-more-vertical" />
                                </a>
                                <div className="dropdown-menu dropdown-menu-right">
                                  <a href="#!" className="dropdown-item">
                                  Supsend Account
                                  </a>
                              
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="goal-project">
                              Usman khan
                            </td>
                            <td className="goal-status">
                              khan
                            </td>
                            <td className="goal-progress">
                              Usmankhan@gmail.com
                            </td>
                            <td className="goal-date">
                              9991262870
                            </td>
                          
                            <td className="text-right">
                              <div className="dropdown">
                                <a href="#" className="dropdown-ellipses dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                  <i className="fe fe-more-vertical" />
                                </a>
                                <div className="dropdown-menu dropdown-menu-right">
                                  <a href="#!" className="dropdown-item">
                                  Supsend Account
                                  </a>
                                
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="goal-project">
                              Usman khan
                            </td>
                            <td className="goal-status ">
                              khan
                            </td>
                            <td className="goal-progress">
                              Usmankhan@gmail.com
                            </td>
                            <td className="goal-date">
                              9991262870
                            </td>
                          
                            <td className="text-right">
                              <div className="dropdown">
                                <a href="#" className="dropdown-ellipses dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                  <i className="fe fe-more-vertical" />
                                </a>
                                <div className="dropdown-menu dropdown-menu-right">
                                  <a href="#!" className="dropdown-item">
                                  Supsend Account
                                  </a>
                                
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="goal-project">
                              Usman khan
                            </td>
                            <td className="goal-status">
                              khan
                            </td>
                            <td className="goal-progress">
                              Usmankhan@gmail.com
                            </td>
                            <td className="goal-date">
                              9991262870
                            </td>
                          
                            <td className="text-right">
                              <div className="dropdown">
                                <a href="#" className="dropdown-ellipses dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                  <i className="fe fe-more-vertical" />
                                </a>
                                <div className="dropdown-menu dropdown-menu-right">
                                  <a href="#!" className="dropdown-item">
                                  Supsend Account
                                  </a>
                                
                                </div>
                              </div>
                            </td>
                          </tr>
                          </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div> {/* / .row */}
            </div>
              </div>
{/* </div> */}
            </React.Fragment>
        )
    }
}

export default Dashboard