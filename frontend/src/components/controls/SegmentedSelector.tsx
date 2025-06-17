import { Box } from '@chakra-ui/react'
import { SegmentedControl } from 'components/ui/segmented-control'
import { JSX } from 'react'
import {
	SegmentedControlEvent,
	SegmentedSelectorProps
} from './SegmentedSelector.types'

const SegmentedSelector = <T extends string>({
	value,
	onValueChange,
	items,
	segmentedControlProps,
	...wrapperProps
}: SegmentedSelectorProps<T>): JSX.Element => {
	const handleValueChange = (event: SegmentedControlEvent<T>) => {
		onValueChange(event.value)
	}

	return (
		<Box {...wrapperProps}>
			<SegmentedControl
				value={value}
				onValueChange={handleValueChange}
				items={items}
				{...segmentedControlProps}
			/>
		</Box>
	)
}

export default SegmentedSelector
