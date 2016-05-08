import React from 'react';
import { Router } from 'react-router';
import Header from 'partial/header';


export default React.createClass({
	
	componentDidMount:  function() {
		// console.log(this.props.routes[this.props.routes.length-1]);

	},
	render: function() {
		return(
			<div className="contain">
					<Header/>
					{ this.props.children }
			</div>
		);
	}
});
