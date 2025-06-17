import { Box, BoxProps } from '@chakra-ui/react'
import { AnimatePresence, motion, MotionProps } from 'framer-motion'
import React from 'react'
import { defaultCarouselVariants } from './animationConfigs'
import WeekDaysCarousel, { WeekDaysCarouselProps } from './WeekDaysCarousel'

export interface AnimatedWeekDaysCarouselProps extends WeekDaysCarouselProps {
	/** Props for the animated MotionBox wrapper */
	animationWrapperProps?: BoxProps & MotionProps
}

const MotionBox = motion.create(Box)

const AnimatedWeekDaysCarousel: React.FC<AnimatedWeekDaysCarouselProps> = ({
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
				<WeekDaysCarousel {...carouselProps} />
			</MotionBox>
		</AnimatePresence>
	)
}

export default AnimatedWeekDaysCarousel
