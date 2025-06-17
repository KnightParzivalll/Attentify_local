import { Box, BoxProps } from '@chakra-ui/react'
import { AnimatePresence, motion, MotionProps } from 'framer-motion'
import React from 'react'
import WeekTypeSelector, { WeekTypeSelectorProps } from './WeekTypeSelector'
import { defaultSegmentedSelectorVariants } from './animationConfig'

const MotionBox = motion.create(Box)

export interface AnimatedWeekTypeSelectorProps extends WeekTypeSelectorProps {
	/** Additional props for the animated MotionBox wrapper */
	animationWrapperProps?: BoxProps & MotionProps
	/** Control the visibility of the MotionBox (if false, the component will animate out) */
	isVisible?: boolean
}

const AnimatedWeekTypeSelector: React.FC<AnimatedWeekTypeSelectorProps> = ({
	animationWrapperProps,
	isVisible = true,
	...props
}) => {
	return (
		<AnimatePresence>
			{isVisible && (
				<MotionBox
					variants={defaultSegmentedSelectorVariants}
					initial='hidden'
					animate='visible'
					exit='exit'
					{...animationWrapperProps}
				>
					<WeekTypeSelector {...props} />
				</MotionBox>
			)}
		</AnimatePresence>
	)
}

export default AnimatedWeekTypeSelector
