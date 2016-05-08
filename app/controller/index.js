import React from 'react';
import { Link } from 'react-router';

import Monitor from 'partial/monitor';
import Dial from 'partial/dial';
import Incoming from 'partial/incoming';

export default React.createClass({
	render: function(){
		return (
			<main className="grid-container grid-parent">
        <div className="grid-33 push-66">
          <Monitor />
          <Dial />
        </div>
        <div className="grid-66 pull-33 video-connection">
					<Incoming />
        </div>
			</main>
		)
	}
});
/*

<div className="grid-66 pull-33 video-connection">
	Video content comes here;
</div>
*/
