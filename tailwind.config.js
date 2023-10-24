/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				background: '#FDFAE7',
				border: '#BEADA5',
				playarea: '#D8C1B3',
				text: '#807F82',
				tile: {
					2: '#F6E8DD',
					4: '#F9E5CD',
					8: '#FEB275',
					16: '#FE975C',
					32: '#FF7D5C',
					64: '#FE5D31',
					128: '#EDCF73',
					256: '#EDCC62',
					512: '#EDC850',
					1024: '#EDC53F',
					2048: '#EDC22D',
				},
			},
		},
	},
	plugins: [],
}