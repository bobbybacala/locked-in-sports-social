import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			boxShadow: {
				'all-sides': '0 0 8px rgba(0, 0, 0, 0.5)', // Equal shadow on all sides
			},
		},
	},
	plugins: [daisyui],
	daisyui: {
		themes: [
			{
				linkedin: {
					primary: "#000000", // Locked In black
					secondary: "#FF0000", // red
					accent: "#7FC15E", // LinkedIn Green (for accents)
					neutral: "#FFFFFF", // White (for text)
					"base-100": "#0f0f0f", // dark Gray (background)
					info: "#5E5E5E", // Dark Gray (for secondary text)
					success: "#39e75f", // light Green (for success messages)
					warning: "#e8e337", // Yellow (for warnings)
					error: "#ff9800", // orange (for errors)
				},
			},
		],
	},
}