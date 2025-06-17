import { BoxProps } from '@chakra-ui/react'
import { SegmentedControlProps as LibrarySegmentedControlProps } from 'components/ui/segmented-control'

/**
 * Event type that is passed when the segmented control value changes.
 */
export interface SegmentedControlEvent<T extends string> {
	value: T
}

/**
 * Props for the BaseSegmentedControl component.
 * Extends Chakra UI BoxProps to allow additional styling props.
 */
export interface SegmentedSelectorProps<T extends string> {
	/** Current selected value */
	value: T
	/** Callback fired when the value changes */
	onValueChange: (value: T) => void
	/** Array of items to display in the control */
	items: Array<{
		label: string
		value: T
	}>

	wrapperProps?: BoxProps

	segmentedControlProps?: Omit<
		LibrarySegmentedControlProps,
		'onValueChange' | 'value' | 'items'
	>
}
