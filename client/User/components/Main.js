import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import Restaurant from './Restaurant';
import Collection from './Collection';
import CollectionDetails from './CollectionDetails';

class Main extends Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<Switch>
				<Route exact path='/restaurants'
					render={(props) => <Restaurant {...this.props} {...props} />} />
				<Route exact path='/collections'
					render={(props) => <Collection {...this.props} {...props} />} />
				<Route path='/collections/:id'
					render={(props) => <CollectionDetails {...this.props} {...props} />} />
				<Route path='*'
					render={(props) => <Restaurant {...this.props} {...props} />} />
			</Switch>
		);
	}

}

const mapStateToProps = (state) => ({ ...state });

export default connect(mapStateToProps)(Main);
