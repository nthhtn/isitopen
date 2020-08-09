import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Link } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './store';
import Main from './components/Main';
import { getMyProfile } from './actions/user';

store.dispatch(getMyProfile()).then(() => {
	const { email } = store.getState().user.me;
	const rootComponent = (
		<Provider store={store}>
			<BrowserRouter>
				<div id="page-container" className="sidebar-o sidebar-dark enable-page-overlay side-scroll page-header-fixed side-trans-enabled">
					<nav id="sidebar" style={{ overflowX: 'hidden' }}>
						<div className="simplebar-scroll-content">
							<div className="simplebar-content">
								<div className="content-header bg-white-5">
									<a className="font-w600 text-dual" href={undefined}>
										<span className="smini-hide">
											Hi, {email.split('@')[0]} !
										</span>
									</a>
									<a className="d-lg-none text-dual ml-3" data-toggle="layout" data-action="sidebar_close" href={undefined} onClick={(e) => e.preventDefault()}>
										<i className="fa fa-times"></i>
									</a>
								</div>
								<div className="content-side content-side-full">
									<ul className="nav-main">
										<li className="nav-main-item">
											<Link className="nav-main-link active" to="/restaurants">
												<i className="nav-main-link-icon fa fa-store"></i>
												<span className="nav-main-link-name">Restaurants</span>
											</Link>
										</li>
										<li className="nav-main-item">
											<Link className="nav-main-link active" to="/collections">
												<i className="nav-main-link-icon fa fa-list"></i>
												<span className="nav-main-link-name">My Collections</span>
											</Link>
										</li>
										<li className="nav-main-item">
											<a className="nav-main-link active" href="/logout">
												<i className="nav-main-link-icon fa fa-sign-out-alt"></i>
												<span className="nav-main-link-name">Logout</span>
											</a>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</nav>
					<Main />
				</div>
			</BrowserRouter>
		</Provider>
	);
	render(rootComponent, document.getElementById('root'));
});
