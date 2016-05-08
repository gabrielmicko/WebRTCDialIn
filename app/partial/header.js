import React from 'react';
import { Router, Link } from 'react-router';
export default React.createClass({

	render: function() {
		return (

				<header>
					<div className="grid-container grid-parent">
						<img src="/public/img/webrtc.png" className="webrtc-logo" />
						<span className="bold">Teach</span>
						<span className="normal">WebRTC</span>
					</div>
			</header>
		);
	}
});
