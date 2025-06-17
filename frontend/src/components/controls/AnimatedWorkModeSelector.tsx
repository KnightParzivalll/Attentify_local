import { Box, BoxProps } from '@chakra-ui/react'
import { AnimatePresence, motion, MotionProps } from 'framer-motion'
import React from 'react'
import WorkModeSelector, { WorkModeSelectorProps } from './WorkModeSelector'
import { defaultSegmentedSelectorVariants } from './animationConfig'

const MotionBox = motion.create(Box)

export interface AnimatedWorkModeSelectorProps extends WorkModeSelectorProps {
	/** Additional props for the animated MotionBox wrapper */
	animationWrapperProps?: BoxProps & MotionProps
	/** Control the visibility of the MotionBox (if false, the component will animate out) */
	isVisible?: boolean
}

const AnimatedWorkModeSelector: React.FC<AnimatedWorkModeSelectorProps> = ({
	animationWrapperProps,
	isVisible = true,
	...props
}) => {
	return (
		<AnimatePresence mode='wait'>
			{isVisible && (
				<MotionBox
					variants={defaultSegmentedSelectorVariants}
					initial='hidden'
					animate='visible'
					exit='exit'
					{...animationWrapperProps}
				>
					<WorkModeSelector {...props} />
				</MotionBox>
			)}
		</AnimatePresence>
	)
}

export default AnimatedWorkModeSelector
