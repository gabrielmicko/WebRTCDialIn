import React from 'react';
import { Router, Link } from 'react-router';
import Settings from 'partial/settings';
export default React.createClass({


	render: function() {
		return (
				<header>
					<div className="grid-container grid-parent">
						<div className="grid-50">
							<img src="/public/img/webrtc.png" className="webrtc-logo" />
							<span className="bold">Teach</span>
							<span className="normal">WebRTC</span>
						</div>
						<div className="grid-50 navSettings">
							<Settings />
						</div>
					</div>
			</header>
		);
	}
});
