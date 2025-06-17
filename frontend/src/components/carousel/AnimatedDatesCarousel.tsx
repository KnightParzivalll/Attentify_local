import { Box, BoxProps } from '@chakra-ui/react'
import { AnimatePresence, motion, MotionProps } from 'framer-motion'
import React from 'react'
import { defaultCarouselVariants } from './animationConfigs'
import DatesCarousel, { DatesCarouselProps } from './DatesCarousel'

export interface AnimatedDatesCarouselProps extends DatesCarouselProps {
	/** Props for the animated MotionBox wrapper */
	animationWrapperProps?: BoxProps & MotionProps
}

const MotionBox = motion.create(Box)

const AnimatedDatesCarousel: React.FC<AnimatedDatesCarouselProps> = ({
	animationWrapperProps,
	...carouselProps
}) => {
	return (
		<AnimatePresence>
			<MotionBox
				variants={defaultCarouselVariants}
				initial='hidden'
				animate='visible'
				exit='exit'
				{...animationWrapperProps}
			>
				<DatesCarousel {...carouselProps} />
			</MotionBox>
		</AnimatePresence>
	)
}

export default AnimatedDatesCarousel
