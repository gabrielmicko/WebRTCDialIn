import React from 'react';
import { Router, Link } from 'react-router';
export default React.createClass({

	getInitialState() {
		return {
			'mynumber': false
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
				if(this.state.mynumber === false) {
					return (
					<div className="setNumberPart">
						<div className="grid-container grid-parent">
							<div className="grid-100">
								Please set your number by clicking here.
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
