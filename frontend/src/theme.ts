import {
	createSystem,
	defaultConfig,
	defineConfig,
	defineRecipe
} from '@chakra-ui/react'

const checkboxRecipe = defineRecipe({
	variants: {
		solid: {
			control: {
				checked: {
					true: {
						bg: 'brand.500',
						borderColor: 'brand.500'
					}
				}
			}
		}
	}
})

const customConfig = defineConfig({
	theme: {
		tokens: {
			colors: {
				brand: {
					50: { value: '#ebf8ff' },
					100: { value: '#bee3f8' },
					200: { value: '#90cdf4' }, // used
					300: { value: '#63b3ed' },
					400: { value: '#4299e1' },
					500: { value: '#3182ce' }, // used
					600: { value: '#1A202C' }, // solid brand
					700: { value: '#2c5282' },
					800: { value: '#2a4365' },
					900: { value: '#1A365D' }
				}
			}
		},
		semanticTokens: {
			colors: {
				brand: {
					solid: {
						value: {
							_light: '{colors.gray.300}',
							_dark: '{colors.brand.600}'
						}
					},
					contrast: { value: '{colors.fg}' },
					fg: { value: '{colors.fg}' },
					muted: {
						value: {
							_light: '{colors.gray.emphasized}',
							_dark: '{colors.gray.muted}'
						}
					},
					subtle: { value: '{colors.gray.emphasized}' },
					emphasized: { value: '{colors.red.100}' },
					focusRing: { value: '{colors.red.100}' },
					outline: { value: '{colors.bg}' },
					hover: { value: '{colors.red.100}' }
				},
				bg: {
					DEFAULT: {
						value: { _light: '{colors.white}', _dark: '#171923' } // Custom dark background
					},
					emphasized: {
						value: { _light: '{colors.white}', _dark: '#1A202C' }
					},
					muted: {
						value: { _light: '#f4f4f5', _dark: '#171923' }
					}
				}
			}
		}
	}
})

export const system = createSystem(defaultConfig, customConfig)
