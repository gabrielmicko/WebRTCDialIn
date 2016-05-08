import React from 'react';
import { Link } from 'react-router';

export default React.createClass({
	render: function() {
		return (
			<main>
				<div className="wrap-container">
					<div className="shout-out">
						<h2>Not Found</h2>
						<p>
							The page was not found!<br/><br/>
							<Link to="/" className="button">Home</Link>
						</p>
					</div>
				</div>
			</main>
		);
	}
})
