import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Pagination from 'react-js-pagination';
import { Typeahead } from 'react-bootstrap-typeahead';

import { getRestaurants } from '../actions/restaurant';
import { getCollections } from '../actions/collection';

const weekdays = [
	{ value: 0, name: 'Mon' }, { value: 1, name: 'Tue' }, { value: 2, name: 'Wed' },
	{ value: 3, name: 'Thu' }, { value: 4, name: 'Fri' }, { value: 5, name: 'Sat' }, { value: 6, name: 'Sun' }
];
let sliderValues = ['00:00am', '00:30am'];
for (let i = 1; i <= 11; i++) {
	sliderValues = [...sliderValues, `${i}:00am`, `${i}:30am`]
}
sliderValues = [...sliderValues, `12:00pm`, `12:30pm`]
for (let i = 1; i <= 11; i++) {
	sliderValues = [...sliderValues, `${i}:00pm`, `${i}:30pm`]
}
sliderValues.push('12:00am');

let self;

export default class Restaurant extends Component {

	constructor(props) {
		super(props);
		this.state = {
			activePage: 1,
			weekdaySelected: [],
			time: 0,
			q: '',
			currentRestaurant: null,
			collectionSelected: []
		};
		self = this;
	}

	componentDidMount() {
		this.props.dispatch(getRestaurants({}));
		jQuery(() => {
			One.helpers(['rangeslider']);
			$('#filter-time').ionRangeSlider({
				type: 'single',
				min: 0,
				max: 1440,
				step: 30,
				skin: 'round',
				values: sliderValues,
				onFinish: (data) => {
					self.setState({ time: data.from * 30 });
				}
			});
		});
		this.props.dispatch(getCollections());
	}

	onPageChange(page) {
		const { time, q } = this.state;
		const days = this.state.weekdaySelected.map((item) => (item.value)).join(',');
		this.props.dispatch(getRestaurants({ q, time, days, page }));
		this.setState({ activePage: page });
	}

	onWeekdayChange(selected) {
		this.setState({ weekdaySelected: selected });
	}

	onKeywordChange(e) {
		this.setState({ q: e.target.value });
	}

	applyFilter() {
		const { time, q } = this.state;
		const days = this.state.weekdaySelected.map((item) => (item.value)).join(',');
		this.props.dispatch(getRestaurants({ q, time, days }));
	}

	async onRowClick(row) {
		const response = await fetch(`/api/restaurants/${row._id}/collections`, { credentials: 'same-origin' })
			.then((response) => (response.json()));
		this.setState({ currentRestaurant: row._id, collectionSelected: response.result });
		$('#modal-collection').modal('show');
	}

	handleAddChange(selected) {
		this.setState({ collectionSelected: selected });
	}

	async changeCollection() {
		const list = this.state.collectionSelected.map((item) => (item._id));
		await fetch(`/api/restaurants/${this.state.currentRestaurant}/collections`, {
			credentials: 'same-origin',
			method: 'put',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ list })
		});
		$('#modal-collection').modal('hide');
	}

	render() {
		const listRestaurant = this.props.restaurant.list;
		const start = (this.state.activePage - 1) * 20 + 1;
		const to = start + listRestaurant.length - 1;
		const filterWeekdayState = {
			options: weekdays,
			selected: this.state.weekdaySelected
		};
		const options = {
			onRowClick: this.onRowClick.bind(this)
		};
		const collectionState = {
			options: this.props.collection.list,
			selected: this.state.collectionSelected
		};
		return (
			<main id="main-container">
				<div className="bg-body-light">
					<div className="content content-full">
						<div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
							<h1 className="flex-sm-fill h3 my-2">Restaurants</h1>
						</div>
					</div>
				</div>
				<div className="content">
					<div className="block">
						<div className="block-header block-header-default">
							<h3 className="block-title"></h3>
						</div>
						<div className="block-content">
							<div className="row">
								<div className="form-group col-sm-4">
									<input type="text" className="js-range-slider" id="filter-time" />
								</div>
								<div className="form-group col-sm-4">
									<Typeahead
										{...filterWeekdayState}
										multiple
										id="filter-weekday"
										labelKey="name"
										placeholder="Choose day(s) of week"
										ref='filterWeekday'
										onChange={this.onWeekdayChange.bind(this)}
									/>
								</div>
								<div className="form-group col-sm-3">
									<input type="text" className="form-control" placeholder="Enter keywords to filter" id="filter-q"
										onChange={this.onKeywordChange.bind(this)} />
								</div>
								<div className="form-group col-sm-1">
									<button className="btn btn-primary form-control" onClick={this.applyFilter.bind(this)}>Apply</button>
								</div>
							</div>
							<p>Result(s) from {start} to {to} in total of {this.props.restaurant.count}</p>
							<BootstrapTable
								data={listRestaurant}
								hover
								options={options}
								bodyStyle={{ cursor: 'pointer' }}
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
							<div className="modal fade" id="modal-collection" tabIndex="-1" role="dialog" aria-labelledby="modal-collection" aria-modal="true" style={{ paddingRight: '15px' }}>
								<div className="modal-dialog" role="document">
									<div className="modal-content">
										<div className="block block-themed block-transparent mb-0">
											<div className="block-header bg-primary-dark">
												<h3 className="block-title">Change Collection</h3>
												<div className="block-options">
													<button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
														<i className="fa fa-fw fa-times"></i>
													</button>
												</div>
											</div>
											<div className="block-content font-size-sm">
												<div className="row">
													<div className="form-group col-sm-12">
														<label htmlFor="change-collection">Collection</label>
														<Typeahead
															{...collectionState}
															id="change-collection"
															labelKey="collectionName"
															multiple
															onChange={this.handleAddChange.bind(this)}
															ref='changeCollection'
														/>
													</div>
												</div>
											</div>
											<div className="block-content block-content-full text-right border-top">
												<button type="button" className="btn btn-sm btn-light" data-dismiss="modal">Close</button>
												<button type="button" className="btn btn-sm btn-primary" onClick={this.changeCollection.bind(this)}><i className="fa fa-check"></i> Ok</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		);
	};

};
