import { Box, createListCollection } from '@chakra-ui/react'
import {
	SelectContent,
	SelectItem as SelectItemComponent,
	SelectRoot,
	SelectTrigger,
	SelectValueText
} from 'components/ui/select'
import { JSX } from 'react'
import { SelectFieldProps } from './SelectField.types'

/**
 * SelectField is a customizable select input that wraps your underlying UI library’s select components.
 * It supports clearable, multiple selections, and placeholder text.
 */
const SelectField = <T extends string>({
	value,
	onValueChange,
	collection,
	clearable = false,
	multiple = false,
	placeholder,
	wrapperProps,
	...selectProps
}: SelectFieldProps<T>): JSX.Element => {
	// Map the collection to include both label and value.
	// This mapping is required if the underlying SelectRoot expects a ListCollection of objects
	// with the shape { label, value }.
	const mappedCollection = createListCollection({
		items: collection.items.map(item => ({
			label: item.label,
			value: item.value
		}))
	})

	return (
		<Box {...wrapperProps}>
			<SelectRoot
				multiple={multiple}
				value={value}
				onValueChange={details => onValueChange(details.value as T[])}
				collection={mappedCollection}
				{...selectProps}
			>
				<SelectTrigger clearable={clearable}>
					{placeholder && <SelectValueText placeholder={placeholder} />}
				</SelectTrigger>
				<SelectContent bg={'{colors.bg}'}>
					{collection.items.map(item => (
						<SelectItemComponent item={item} key={item.value}>
							{item.label}
						</SelectItemComponent>
					))}
				</SelectContent>
			</SelectRoot>
		</Box>
	)
}

export default SelectField
