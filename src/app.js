import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import Home from './components/Home.js';
import MusicApp from './components/MusicApp.js';

render((
	<Router history={browserHistory}>
		<Route path="/" component={Home} />
		<Route path="/home/" component={MusicApp} />
	</Router>
), document.getElementById('main-panel'));