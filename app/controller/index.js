import React from 'react';
import { Link } from 'react-router';

import Monitor from 'partial/monitor';
import Dial from 'partial/dial';
import Incoming from 'partial/incoming';
import Number from 'partial/number';

export default React.createClass({
	render: function(){
		return (
			<main className="grid-container grid-parent">
        <div className="grid-33 push-33">
				<Number />
				<Incoming />
          <Monitor />
          <Dial />
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
