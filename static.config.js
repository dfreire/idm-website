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
}
