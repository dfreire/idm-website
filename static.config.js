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
}
