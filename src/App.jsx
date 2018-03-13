import React from 'react'
import { Router, Link } from 'react-static'
import { hot } from 'react-hot-loader'
import 'antd/dist/antd.css'
import './app.css'

import Routes from 'react-static-routes'

const App = () => (
	<Router>
		<div>
			<div>
				<Routes />
			</div>
			<div style={{ width: 600, margin: 'auto', marginTop: 20, marginBottom: 75, textAlign: 'center', fontSize: '0.9em' }}>
				<Link to="/">Home</Link>&nbsp;|&nbsp;
				<Link to="/about">Privacy</Link>&nbsp;|&nbsp;
				<Link to="/about">Cookies</Link>
			</div>
		</div>
	</Router>
)

export default hot(module)(App)
