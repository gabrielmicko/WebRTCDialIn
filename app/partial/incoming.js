import React from 'react';
import { Router, Link } from 'react-router';
export default React.createClass({

	getInitialState() {
		return {
			'incoming': true
		}
	},

	acceptCall() {

	},

	refuseCall() {

	},

	render() {
		return (
			<div>
				{(() => {
					if(this.state.incoming !== false) {
						return (
							<div className="incomingPart">
			          <div className="grid-container grid-parent">
			            <div className="grid-100 box">
			              <span>{this.state.incoming} calling you</span>
										<button className="accept" onClick={this.acceptCall}><i className="fa fa-phone" aria-hidden="true"></i>&nbsp;Accept</button>
			            	<button className="refuse" onClick={this.refuseCall}><i className="fa fa-remove" aria-hidden="true"></i>&nbsp;Refuse</button>
										</div>
			          </div>
			  			</div>
						)
					}
				})()}
			</div>
		)
	}
});
