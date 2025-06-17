import { Box, BoxProps } from '@chakra-ui/react'
import { AnimatePresence, motion, MotionProps } from 'framer-motion'
import React from 'react'
import SelectGroups, { SelectGroupsProps } from './SelectGroups'
import { defaultSelectFieldVariants } from './animationConfig'

/**
 * Cast the Chakra UI Box as a MotionBox that accepts both BoxProps and MotionProps.
 */
const MotionBox = motion.create(Box)

/**
 * Props for AnimatedSelectGroups extends the underlying SelectGroupsProps,
 * adding optional animationWrapperProps for the MotionBox and an isVisible flag.
 */
export interface AnimatedSelectGroupsProps extends SelectGroupsProps {
	/** Additional props to configure the MotionBox wrapper for animation */
	animationWrapperProps?: BoxProps & MotionProps
	/** Controls the visibility of the animated container (default is true) */
	isVisible?: boolean
}

/**
 * AnimatedSelectGroups wraps the SelectGroups component with Framer Motion animations.
 * When isVisible is false, AnimatePresence triggers the exit animation.
 */
const AnimatedSelectGroups: React.FC<AnimatedSelectGroupsProps> = ({
	animationWrapperProps,
	isVisible = true,
	...props
}) => {
	return (
		<AnimatePresence mode='wait'>
			{isVisible && (
				<MotionBox
					variants={defaultSelectFieldVariants}
					initial='hidden'
					animate='visible'
					exit='exit'
					{...animationWrapperProps}
				>
					<SelectGroups {...props} />
				</MotionBox>
			)}
		</AnimatePresence>
	)
}

export default AnimatedSelectGroups
