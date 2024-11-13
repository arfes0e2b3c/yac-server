import { defineConfig } from 'orval'

export default defineConfig({
	petstoreClient: {
		input: {
			target: 'http://localhost:8787/api/doc',
		},
		output: {
			mode: 'tags-split',
			client: 'react-query',
			target: 'src/gen/',
			schemas: 'src/gen/models',
			clean: true,
			// baseUrl: 'http://localhost:8787',
			mock: true,
			override: {
				mutator: {
					path: 'src/client/axios.ts',
					name: 'customInstance',
				},
			},
		},
	},
})
