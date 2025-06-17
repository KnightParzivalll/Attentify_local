import { Variants } from 'framer-motion'

export const segmentedSelectorVariants: Variants = {
	hidden: { opacity: 0, y: -10 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.3, ease: 'easeOut' }
	},
	exit: { opacity: 0, y: 10, transition: { duration: 0.2, ease: 'easeIn' } }
}

export const slideFromLeftFadeVariants: Variants = {
	hidden: { opacity: 0, x: -40 },
	visible: {
		opacity: 1,
		x: 0,
		transition: { duration: 0.5 }
	},
	exit: {
		opacity: 0,
		x: -40,
		transition: { duration: 0.5 }
	}
}

export const defaultSegmentedSelectorVariants: Variants =
	slideFromLeftFadeVariants
