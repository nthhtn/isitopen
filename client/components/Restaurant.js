import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Pagination from 'react-js-pagination';

import { getRestaurants } from '../actions/restaurant';

export default class Restaurant extends Component {

	constructor(props) {
		super(props);
		this.state = {
			activePage: 1
		};
	}

	componentDidMount() {
		this.props.dispatch(getRestaurants({}));
	}

	onPageChange(page) {
		this.props.dispatch(getRestaurants({ page }));
		this.setState({ activePage: page });
	}

	render() {
		const listRestaurant = this.props.restaurant.list;
		const start = (this.state.activePage - 1) * 20 + 1;
		const to = start + listRestaurant.length - 1;
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
							<p>Result(s) from {start} to {to} in total of {this.props.restaurant.count}</p>
							<BootstrapTable
								data={listRestaurant}
								hover
							>
								<TableHeaderColumn dataField='_id' isKey={true} hidden></TableHeaderColumn>
								<TableHeaderColumn dataField='restaurantName' width="30%" columnClassName="font-w600" tdStyle={{ color: '#5c80d1' }}>
									Restaurant Name
								</TableHeaderColumn>
								<TableHeaderColumn dataField='businessHoursText'>Business Hours</TableHeaderColumn>
							</BootstrapTable>
							<Pagination
								itemClass="page-item"
								linkClass="page-link"
								activePage={this.state.activePage}
								itemsCountPerPage={20}
								totalItemsCount={this.props.restaurant.count}
								pageRangeDisplayed={3}
								onChange={this.onPageChange.bind(this)}
							/>
						</div>
					</div>
				</div>
			</main>
		);
	};

};
