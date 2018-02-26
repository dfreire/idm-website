import React from 'react'
import { Router, Link } from 'react-static'
import { hot } from 'react-hot-loader'
import 'antd/dist/antd.css'

//
import Routes from 'react-static-routes'

import './app.css'

const App = () => (
	<Router>
		<div>
			<nav>
				<Link to="/">Home</Link>
				<Link to="/about">About</Link>
			</nav>
			<div className="content">
				<Routes />
			</div>
		</div>
	</Router>
)

export default hot(module)(App)
