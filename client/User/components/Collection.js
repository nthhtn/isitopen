import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { getCollections, createCollection } from '../actions/collection';

const titleStyle = {
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis'
};
const textStyle = {
	...titleStyle,
	height: '87px',
	whiteSpace: 'pre-wrap'
};

let self;

class CollectionItem extends Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { _id, collectionName, description } = this.props;
		return (
			<div className="col-sm-4 col-xl-3">
				<div className="block">
					<div className="block-header">
						<Link to={`/collections/${_id}`} style={titleStyle}>
							<h3 className="block-title">{collectionName}</h3>
						</Link>
					</div>
					<div className="block-content block-content-full text-center">
						<img className="img-avatar img-avatar96 img-avatar-thumb" src="/assets/oneui/media/avatars/avatar12.jpg" alt="" />
					</div>
					<div className="block-content" style={textStyle}>
						{description}
					</div>
				</div>
			</div>
		);
	}

}

export default class Collection extends Component {

	constructor(props) {
		super(props);
		this.state = {};
		self = this;
	}

	componentDidMount() {
		this.props.dispatch(getCollections());
	}

	async createCollection() {
		const collectionName = $('#create-name').val();
		const description = $('#create-description').val();
		if (!collectionName || !description) {
			$('#create-error').text('Missing required field(s)!');
			return;
		}
		await this.props.dispatch(createCollection({ collectionName, description }));
		$('#create-error').text('');
		$('#modal-create').modal('hide');
	}

	render() {
		return (
			<main id="main-container">
				<div className="bg-body-light">
					<div className="content content-full">
						<div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
							<h1 className="flex-sm-fill h3 my-2">My Collections</h1>
							<button type="button" className="btn btn-success mr-2" data-toggle="modal" data-target="#modal-create">
								<i className="fa fa-plus"></i> New
							</button>
							<div className="modal fade" id="modal-create" tabIndex="-1" role="dialog" aria-labelledby="modal-create" aria-modal="true" style={{ paddingRight: '15px' }}>
								<div className="modal-dialog" role="document">
									<div className="modal-content">
										<div className="block block-themed block-transparent mb-0">
											<div className="block-header bg-primary-dark">
												<h3 className="block-title">Create Collection</h3>
												<div className="block-options">
													<button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
														<i className="fa fa-fw fa-times"></i>
													</button>
												</div>
											</div>
											<div className="block-content font-size-sm">
												<div className="row">
													<div className="form-group col-sm-12">
														<label htmlFor="create-name">Collection Name*</label>
														<input type="text" className="form-control" id="create-name" />
													</div>
													<div className="form-group col-sm-12">
														<label htmlFor="create-description">Description*</label>
														<textarea rows="4" className="form-control" id="create-description" />
													</div>
													<div className="form-group col-sm-12">
														<label id="create-error" style={{ color: 'red' }}></label>
													</div>
												</div>
											</div>
											<div className="block-content block-content-full text-right border-top">
												<button type="button" className="btn btn-sm btn-light" data-dismiss="modal">Close</button>
												<button type="button" className="btn btn-sm btn-primary" onClick={this.createCollection.bind(this)}><i className="fa fa-check"></i> Ok</button>
											</div>
										</div>
									</div>
								</div>
							</div>

						</div>
					</div>
				</div>
				<div className="content content-boxed">
					<div className="row">
						{this.props.collection.list.map((item) =>
							<CollectionItem key={item._id} {...item} />
						)}
					</div>
				</div>
			</main>
		);
	}

}
