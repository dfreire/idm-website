import React from 'react'
import { Router, Link } from 'react-static'
import { hot } from 'react-hot-loader'
import 'antd/dist/antd.css'
import './app.css'

//
import Routes from 'react-static-routes'

import './app.css'

const App = () => (
	<Router>
		<div style={{ width: 600, margin: 'auto', marginTop: 75, marginBottom: 200 }}>
			<div>
				<Routes />
			</div>
			<div style={{ textAlign: 'center', marginTop: 20, fontSize: '0.9em' }}>
				<Link to="/about">Privacy Policy</Link>&nbsp;|&nbsp;
				<Link to="/about">Cookies Policy</Link>
			</div>
		</div>
	</Router>
)

export default hot(module)(App)
