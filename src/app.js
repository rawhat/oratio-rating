import React, { Component } from 'react';
import { render } from 'react-dom';

class App extends Component {
	render = () => {
		return(
			<h2>Hello, world!</h2>
		);
	}
}

render(<App />, document.getElementById('main-panel'));