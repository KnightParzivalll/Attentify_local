import { Variants } from 'framer-motion'

export const slideFromLeftToRightVariants: Variants = {
	hidden: { opacity: 0, x: 40 },
	visible: {
		opacity: 1,
		x: 0,
		transition: { duration: 0.5 }
	},
	exit: {
		opacity: 0,
		x: 40,
		transition: { duration: 0.5 }
	}
}

export const defaultSelectFieldVariants: Variants = slideFromLeftToRightVariants
