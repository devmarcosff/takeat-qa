/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",

		// Or if using `src` directory:
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				takeat: {
					primary: {
						lightest: '#e5a1a4',
						lighter: '#db6e72',
						light: '#d13f45',
						default: '#c8131b',
						dark: '#94090f',
						darker: '#610206'
					},
					red: {
						lightest: '#e5a1a4',
						lighter: '#db6e72',
						light: '#d13f45',
						default: '#c8131b',
						dark: '#94090f',
						darker: '#610206'
					},
					yellow: {
						lightest: '#ffebc8',
						lighter: '#ffd894',
						light: '#ffc561',
						default: '#ffb32f',
						dark: '#cc8c1d',
						darker: '#99670f'
					},
					green: {
						lightest: '#bce3de',
						lighter: '#89d9cf',
						light: '#59cfc1',
						default: '#2ec9b7',
						dark: '#1d9688',
						darker: '#0f635a'
					},
					blue: {
						lightest: '#99dfff',
						lighter: '#66cfff',
						light: '#33bfff',
						default: '#01afff',
						dark: '#018ccc',
						darker: '#016999'
					},
					orange: {
						lightest: '#FFD8BD',
						lighter: '#FFB98A',
						light: '#FF9B57',
						default: '#FF7D24',
						dark: '#CC5F14',
						darker: '#994409'
					},
					second_green: {
						lightest: '#A5C7AF',
						lighter: '#77BD8B',
						light: '#4DB26A',
						default: '#27A84C',
						dark: '#167532',
						darker: '#0A421A'
					},
					neutral: {
						white: '#ffffff',
						lightest: '#f6f6f6',
						lighter: '#ededed',
						light: '#c6c6c6',
						default: '#7a7a7a',
						dark: '#545454',
						darker: '#222222',
						black: '#000000'
					},
					shadows: {
						lighter: '0px 0px 2px 0px #0000001F, 0px 1px 2px 0px #00000024;',
						light: '0px 0px 2px 0px #0000001F, 0px 2px 4px 0px #00000024;',
						default: '0px 0px 2px 0px #0000001F, 0px 4px 8px 0px #00000024;',
						dark: '0px 0px 2px 0px #0000001F, 0px 8px 16px 0px #00000024;',
						darker: '0px 0px 8px 0px #00000033, 0px 10px 25px 0px #00000024;'
					},
					typography: {
						family: {
							default: 'Poppins", sans-serif'
						},
						weights: {
							regular: 400,
							medium: 500,
							semibold: 600,
							bold: 700
						}
					},
					spacing: {
						xxs: '4px',
						xs: '8px',
						s: '16px',
						m: '24px',
						l: '32px',
						xl: '40px',
						xxl: '48px'
					},
					radius: {
						s: '4px',
						m: '8px',
						l: '12px',
						xl: '16px',
						xxl: '24px'
					},
					components: {
						fieldInfo: {
							fontSize: {
								desktop: '12px',
								tablet: '14px',
								totem: '16px'
							}
						},
						input: {
							label: {
								fontSize: {
									desktop: '16px',
									tablet: '18px',
									totem: '20px'
								}
							},
							input: {
								fontSize: {
									desktop: '14px',
									tablet: '16px',
									totem: '18px'
								},
								height: {
									desktop: '40px',
									tablet: '48px',
									totem: '56px'
								},
								borderRadius: {
									desktop: '8px',
									tablet: '12px',
									totem: '16px'
								}
							}
						},
						button: {
							fontSize: {
								desktop: '14px',
								tablet: '16px',
								totem: '18px'
							},
							height: {
								desktop: '40px',
								tablet: '48px',
								totem: '56px'
							},
							padding: {
								desktop: '0 16px',
								tablet: '0 24px',
								totem: '0 32px'
							}
						}
					}
				},
				keyframes: {
					fadeIn: {
						'0%': {
							opacity: '0'
						},
						'100%': {
							opacity: '1'
						}
					},
					scaleIn: {
						'0%': {
							opacity: '0',
							transform: 'scale(0.95)'
						},
						'100%': {
							opacity: '1',
							transform: 'scale(1)'
						}
					},
					fadeOut: {
						'0%': {
							opacity: '1'
						},
						'100%': {
							opacity: '0'
						}
					},
					scaleOut: {
						'0%': {
							opacity: '1',
							transform: 'scale(1)'
						},
						'100%': {
							opacity: '0',
							transform: 'scale(0.95)'
						}
					},
					transformLeft: {
						'0%': {
							opacity: '0',
							transform: 'translateX(100%)'
						},
						'100%': {
							opacity: '1',
							transform: 'translateX(0%)'
						}
					},
					transformRight: {
						'0%': {
							opacity: '0',
							transform: 'translateX(0)'
						},
						'100%': {
							opacity: '1',
							transform: 'translateX(100%)'
						}
					},
					'slide-up-fade': {
						'0%': {
							opacity: 0,
							transform: 'translateY(2px)'
						},
						'100%': {
							opacity: 1,
							transform: 'translateY(0)'
						}
					},
					'slide-right-fade': {
						'0%': {
							opacity: 0,
							transform: 'translateX(-2px)'
						},
						'100%': {
							opacity: 1,
							transform: 'translateX(0)'
						}
					},
					'slide-down-fade': {
						'0%': {
							opacity: 0,
							transform: 'translateY(-2px)'
						},
						'100%': {
							opacity: 1,
							transform: 'translateY(0)'
						}
					},
					'slide-left-fade': {
						'0%': {
							opacity: 0,
							transform: 'translateX(2px)'
						},
						'100%': {
							opacity: 1,
							transform: 'translateX(0)'
						}
					}
				},
				animation: {
					fadeIn: 'fadeIn 0.3s ease-out forwards',
					scaleIn: 'scaleIn 0.3s ease-out forwards',
					fadeOut: 'fadeOut 0.3s ease-in forwards',
					scaleOut: 'scaleOut 0.3s ease-in forwards',
					transformLeft: 'transformLeft 0.3s ease-in forwards',
					transformRight: 'transformRight 0.3s ease-in forwards',
					'slide-up-fade': 'slide-up-fade 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
					'slide-right-fade': 'slide-right-fade 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
					'slide-down-fade': 'slide-down-fade 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
					'slide-left-fade': 'slide-left-fade 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
				},
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		},
		plugins: []
	},
	plugins: [require("tailwindcss-animate")]
}