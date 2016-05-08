import React from 'react';
import { Router, Link } from 'react-router';
export default React.createClass({

	render: function() {
		return (
  			<header>
          <div className="grid-container grid-parent">
            <img src="/public/img/webrtc.png" title="WebRTC Dial In" alt="WebRTC logo"/>
            <span>WebRTC Dial In</span>
          </div>
  			</header>
		);
	}
});
