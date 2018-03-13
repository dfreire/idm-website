import React from 'react'

export default {
	getSiteData: () => ({
		title: 'React Static',
	}),
	getRoutes: async () => {
		return [{
			path: '/',
			component: 'src/pages/Home',
		},
		{
			path: '/extensions',
			component: 'src/pages/Extensions',
		},
		{
			path: '/about',
			component: 'src/pages/About',
		},
		{
			is404: true,
			component: 'src/pages/404',
		},
		]
	},
	devServer: {
		proxy: {
			"/api": {
				"target": "http://localhost:9000",
				"headers": {
					'Authorization': 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTk3MzU1MDh9.Rcxz68VD69qUiBT7LokSxghLq2JOF6QDQImkGhKhkyM'
				}
			},
		},
	},
	Document: ({ Html, Head, Body, children, siteData, renderMeta }) => (
		<Html lang="en-US">
			<Head>
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>Instant Domain Monitor</title>
				<link rel="icon" href="/favicon.ico" />
				<script src="https://cdn.paddle.com/paddle/paddle.js"></script>
			</Head>
			<Body>{children}</Body>
		</Html>
	),
}
