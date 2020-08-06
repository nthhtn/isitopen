import React, { Component } from 'react';

import { getRestaurants } from '../actions/restaurant';

class RestaurantItem extends Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { restaurantName, businessHoursText } = this.props;
		return (
			<tr>
				<td className="font-w600">{restaurantName}</td>
				<td>{businessHoursText}</td>
				<td></td>
			</tr>
		)
	}

};

export default class Restaurant extends Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	async componentDidMount() {
		this.props.dispatch(getRestaurants({}));
	}

	render() {
		const listRestaurant = this.props.restaurant.list;
		return (
			<main id="main-container">
				<div className="bg-body-light">
					<div className="content content-full">
						<div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
							<h1 className="flex-sm-fill h3 my-2">Restaurant</h1>
						</div>
					</div>
				</div>
				<div className="content">
					<div className="block">
						<div className="block-header block-header-default">
							<h3 className="block-title"></h3>
						</div>
						<div className="block-content">
							<div className="table-responsive">
								<table className="table table-bordered table-striped table-vcenter">
									<thead>
										<tr>
											<th style={{ width: '30%' }}>Restaurant Name</th>
											<th>Business Hours</th>
											<th style={{ width: '10%' }}>Action</th>
										</tr>
									</thead>
									<tbody>
										{listRestaurant.map((item) => (<RestaurantItem key={item._id} {...item} />))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</main>
		);
	};

};
