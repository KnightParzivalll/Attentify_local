// components/carousel/animationConfigs.ts
import { Variants } from 'framer-motion'

export const carouselVariants: Variants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, ease: 'easeInOut' }
	},
	exit: {
		opacity: 0,
		y: -20,
		transition: { duration: 0.5, ease: 'easeInOut' }
	}
}

/**
 * A creative, engaging variant configuration for the carousel.
 * - Starts with a slight downward offset, reduced scale, and a subtle rotation.
 * - Transitions into full opacity, original scale, and neutral rotation.
 */
export const creativeCarouselVariants: Variants = {
	hidden: {
		opacity: 0,
		y: 30,
		scale: 0.95,
		rotate: -2
	},
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		rotate: 0,
		transition: {
			duration: 0.8,
			ease: [0.175, 0.85, 0.42, 0.96]
		}
	},
	exit: {
		opacity: 0,
		y: -20,
		scale: 0.98,
		transition: {
			duration: 0.3,
			ease: 'easeInOut'
		}
	}
}

/**
 * A neutral variant configuration for the carousel.
 * - Starts with a simple fade and slide.
 * - Uses smooth ease-out and ease-in transitions.
 */
export const neutralCarouselVariants: Variants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			ease: 'easeOut'
		}
	},
	exit: {
		opacity: 0,
		y: -10,
		transition: {
			duration: 0.3,
			ease: 'easeIn'
		}
	}
}

/**
 * Bouncy variant: Adds a springy, bouncy motion.
 */
export const bouncyCarouselVariants: Variants = {
	hidden: {
		opacity: 0,
		y: -50,
		scale: 0.8
	},
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			type: 'spring',
			stiffness: 300,
			damping: 20
		}
	},
	exit: {
		opacity: 0,
		y: 50,
		scale: 0.9,
		transition: {
			type: 'spring',
			stiffness: 300,
			damping: 20
		}
	}
}

/**
 * Zoom variant: Fades and scales up, then slightly overshoots on exit.
 */
export const zoomCarouselVariants: Variants = {
	hidden: {
		opacity: 0,
		scale: 0.7
	},
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			duration: 0.6,
			ease: 'easeOut'
		}
	},
	exit: {
		opacity: 0,
		scale: 1.1,
		transition: {
			duration: 0.4,
			ease: 'easeIn'
		}
	}
}

/**
 * Flip variant: Uses a 3D flip effect.
 */
export const flipCarouselVariants: Variants = {
	hidden: {
		opacity: 0,
		rotateY: 90
	},
	visible: {
		opacity: 1,
		rotateY: 0,
		transition: {
			duration: 0.7,
			ease: 'easeInOut'
		}
	},
	exit: {
		opacity: 0,
		rotateY: -90,
		transition: {
			duration: 0.7,
			ease: 'easeInOut'
		}
	}
}

/**
 * Slide-from-right variant: Slides in from the right.
 */
export const slideFromRightCarouselVariants: Variants = {
	hidden: {
		opacity: 0,
		x: 100
	},
	visible: {
		opacity: 1,
		x: 0,
		transition: {
			duration: 0.5,
			ease: 'easeOut'
		}
	},
	exit: {
		opacity: 0,
		x: -100,
		transition: {
			duration: 0.5,
			ease: 'easeIn'
		}
	}
}

/**
 * Elastic variant: Uses a spring with an elastic feel.
 */
export const elasticCarouselVariants: Variants = {
	hidden: {
		opacity: 0,
		scale: 0.9
	},
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			type: 'spring',
			stiffness: 100,
			damping: 10
		}
	},
	exit: {
		opacity: 0,
		scale: 1.05,
		transition: {
			type: 'spring',
			stiffness: 100,
			damping: 10
		}
	}
}

export const defaultCarouselVariants: Variants = elasticCarouselVariants
