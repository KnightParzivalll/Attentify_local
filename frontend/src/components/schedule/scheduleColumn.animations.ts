import { Variants } from 'framer-motion'

export const scheduleColumnVariants: Variants = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: -20 }
}

export const scheduleDataVariants: Variants = {
	initial: { opacity: 0, scale: 0.95 },
	animate: { opacity: 1, scale: 1 }
}

export const scheduleItemVariants: Variants = {
	initial: { opacity: 0, x: -10 },
	animate: { opacity: 1, x: 0 },
	exit: { opacity: 0 }
}
