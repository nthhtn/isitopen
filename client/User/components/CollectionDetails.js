import React, { Component } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import swal from 'sweetalert2';

import { getCollectionDetails, removeFromCollection, addToCollection } from '../actions/collection';

let self;

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


class CollaboratorItem extends Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { email } = this.props;
		return (
			<li>
				<a className="media py-2" href={undefined}>
					<div className="mr-3 ml-2 overlay-container overlay-bottom">
						<img className="img-avatar img-avatar48" src="/assets/oneui/media/avatars/avatar3.jpg" alt="" />
					</div>
					<div className="media-body">
						<div className="font-w600">{email}</div>
						<div className="font-w400 text-muted" style={{ wordBreak: 'break-all' }}>{email}</div>
					</div>
				</a>
			</li>
		);
	}

}

export default class CollectionDetails extends Component {

	constructor(props) {
		super(props);
		this.state = {
			collectionId: this.props.match.params.id,
			listRestaurant: [],
			listInModal: [],
			weekdaySelected: [],
			time: 0,
			q: ''
		};
		self = this;
	}

	async componentDidMount() {
		await this.props.dispatch(getCollectionDetails(this.state.collectionId));
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
		let url = `/api/restaurants?page=1&limit=20`;
		if (this.props.collection.current.restaurants.length > 0) {
			url += `&not=${this.props.collection.current.restaurants.map((item) => (item._id)).join(',')}`;
		}
		const response = await fetch(url, { credentials: 'same-origin' })
			.then((response) => (response.json()));
		this.setState({ listInModal: response.result });
	}

	async removeFromCollection(next, rowKeys) {
		swal.fire({
			title: 'Are you sure?',
			html: `These restaurants will be removed from this collection`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, remove!'
		}).then(async (result) => {
			if (result.value) {
				await self.props.dispatch(removeFromCollection(self.state.collectionId, rowKeys));
				next();
				self.refs.collectionTable.cleanSelected();
			}
		});
	}

	onWeekdayChange(selected) {
		this.setState({ weekdaySelected: selected });
	}

	onKeywordChange(e) {
		this.setState({ q: e.target.value });
	}

	async applyFilter() {
		const { time, q } = this.state;
		const days = this.state.weekdaySelected.map((item) => (item.value)).join(',');
		let url = `/api/restaurants?page=1&limit=20`;
		if (time) { url += `&time=${time}`; }
		if (q) { url += `&q=${q}`; }
		if (days) { url += `&days=${days}` };
		if (this.props.collection.current.restaurants.length > 0) {
			url += `&not=${this.props.collection.current.restaurants.map((item) => (item._id)).join(',')}`;
		}
		const response = await fetch(url, { credentials: 'same-origin' })
			.then((response) => (response.json()));
		this.setState({ listInModal: response.result });
	}

	async addToCollection() {
		const rowKeys = this.refs.addingTable.state.selectedRowKeys;
		const listRestaurant = this.state.listInModal.filter((item) => rowKeys.indexOf(item._id) > -1);
		await this.props.dispatch(addToCollection(this.state.collectionId, listRestaurant));
		self.refs.addingTable.cleanSelected();
		$('#modal-restaurant').modal('hide');
	}

	render() {
		const listRestaurant = this.props.collection.current?.restaurants || [];
		const options = {
			insertBtn: (onClick) => (
				<button type="button" className="btn btn-success" data-toggle="modal" data-target="#modal-restaurant" onClick={this.applyFilter.bind(self)}>
					<i className="fa fa-fw fa-plus"></i>
				</button>
			),
			deleteBtn: (onClick) => (
				<button type="button" className="btn btn-danger" onClick={onClick}>
					<i className="fa fa-fw fa-minus"></i>
				</button>
			),
			handleConfirmDeleteRow: this.removeFromCollection
		};
		const filterWeekdayState = {
			options: weekdays,
			selected: this.state.weekdaySelected
		};
		return (
			<main id="main-container">
				<div className="bg-body-light">
					<div className="content content-full">
						<div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
							<h1 className="flex-sm-fill h3 my-2">{'Name'}</h1>
						</div>
					</div>
				</div>
				<div className="content">
					<div className="row">
						<div className="col-md-5 col-xl-3">
							<div id="one-inbox-side-nav" className="d-none d-md-block push">
								<div className="block">
									<div className="block-header block-header-default">
										<h3 className="block-title">Collaborators</h3>
										<div className="block-options">
											<button type="button" className="btn btn-sm btn-success mr-2" data-toggle="modal" data-target="#modal-collaborator">
												<i className="fa fa-plus"></i>
											</button>
										</div>
									</div>
									<div className="block-content">
										<div className="modal fade" id="modal-collaborator" tabIndex="-1" role="dialog" aria-labelledby="modal-collaborator" aria-modal="true" style={{ paddingRight: '15px' }}>
											<div className="modal-dialog" role="document">
												<div className="modal-content">
													<div className="block block-themed block-transparent mb-0">
														<div className="block-header bg-primary-dark">
															<h3 className="block-title">Add collaborators</h3>
															<div className="block-options">
																<button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
																	<i className="fa fa-fw fa-times"></i>
																</button>
															</div>
														</div>
														<div className="block-content font-size-sm">
															<div className="row">
																<div className="form-group col-sm-12">
																	<label htmlFor="add-collaborator">Collaborator email*</label>
																</div>
															</div>
														</div>
														<div className="block-content block-content-full text-right border-top">
															<button type="button" className="btn btn-sm btn-light" data-dismiss="modal">Close</button>
															<button type="button" className="btn btn-sm btn-primary"><i className="fa fa-check"></i> Ok</button>
														</div>
													</div>
												</div>
											</div>
										</div>
										<ul className="nav-items font-size-sm">
										</ul>
									</div>
								</div>
							</div>
						</div>
						<div className="col-md-7 col-xl-9">
							<div className="block">
								<div className="block-content">
									<div className="pull-x">
										<div className="modal fade" id="modal-restaurant" tabIndex="-1" role="dialog" aria-labelledby="modal-restaurant" aria-modal="true" style={{ paddingRight: '15px' }}>
											<div className="modal-dialog modal-xl" role="document">
												<div className="modal-content">
													<div className="block block-themed block-transparent mb-0">
														<div className="block-header bg-primary-dark">
															<h3 className="block-title">Add restaurant to collection</h3>
															<div className="block-options">
																<button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
																	<i className="fa fa-fw fa-times"></i>
																</button>
															</div>
														</div>
														<div className="block-content font-size-sm">
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
															<p>Showing top 20 results only</p>
															<BootstrapTable
																data={this.state.listInModal}
																hover
																bodyStyle={{ cursor: 'pointer' }}
																ref='addingTable'
																headerStyle={{ display: 'none' }}
																selectRow={{ mode: 'checkbox' }}
															>
																<TableHeaderColumn dataField='_id' isKey={true} hidden></TableHeaderColumn>
																<TableHeaderColumn dataField='restaurantName' width="30%" columnClassName="font-w600" tdStyle={{ color: '#5c80d1' }}>
																	Restaurant Name
																</TableHeaderColumn>
																<TableHeaderColumn dataField='businessHoursText'>Business Hours</TableHeaderColumn>
															</BootstrapTable>
														</div>
														<div className="block-content block-content-full text-right border-top">
															<button type="button" className="btn btn-sm btn-light" data-dismiss="modal">Close</button>
															<button type="button" className="btn btn-sm btn-primary" onClick={this.addToCollection.bind(this)}><i className="fa fa-check mr-1"></i>Ok</button>
														</div>
													</div>
												</div>
											</div>
										</div>
										<BootstrapTable
											data={listRestaurant}
											hover
											bodyStyle={{ cursor: 'pointer' }}
											deleteRow
											selectRow={{ mode: 'checkbox' }}
											insertRow
											options={options}
											ref='collectionTable'
										>
											<TableHeaderColumn dataField='_id' isKey={true} hidden></TableHeaderColumn>
											<TableHeaderColumn dataField='restaurantName' width="30%" columnClassName="font-w600" tdStyle={{ color: '#5c80d1' }}>
												Restaurant Name
											</TableHeaderColumn>
											<TableHeaderColumn dataField='businessHoursText'>Business Hours</TableHeaderColumn>
										</BootstrapTable>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		);
	}

}