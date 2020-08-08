import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './store';

import Login from './components/Login';

const rootComponent = (
	<Provider store={store}>
		<BrowserRouter>
			<Switch>
				<Route exact path="/login" component={Login} />
				<Redirect to="/login" />
			</Switch>
		</BrowserRouter>
	</Provider>
);

render(rootComponent, document.getElementById('root'));
