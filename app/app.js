import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import App from 'layout/app';
import { IndexAction, NoMatch } from 'controller/controller'

ReactDOM.render((
    <Router history={browserHistory}>
        <Route component={App}>
		  		  <Route path="/" component={IndexAction} />
				    <Route path="*" component={NoMatch}/>
        </Route>
    </Router>
), document.getElementById('contain'));
