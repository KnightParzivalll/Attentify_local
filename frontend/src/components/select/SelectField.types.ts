import { BoxProps, Select } from '@chakra-ui/react'

/**
 * Represents a single option in the select field.
 */
export interface SelectFieldItem<T extends string> {
	/** Display text for the option */
	label: string
	/** The actual value for this option */
	value: T
}

/**
 * A collection of options to display in the select field.
 */
export interface SelectFieldCollection<T extends string> {
	items: SelectFieldItem<T>[]
}

/**
 * Props for the SelectField component.
 * Extends Chakra UI’s BoxProps for styling and omits conflicting properties from the underlying Select.Root.
 */
export interface SelectFieldProps<T extends string>
	extends Omit<Select.RootProps, 'onValueChange' | 'collection'> {
	/** The currently selected value(s) */
	value: T[]
	/**
	 * Callback fired when the value changes.
	 * The handler receives the new value as an array of type T.
	 */
	onValueChange: (value: T[]) => void
	/** The collection of options to display in the select field */
	collection: SelectFieldCollection<T>
	/** If true, the select field can be cleared */
	clearable?: boolean
	/** If true, multiple selections are allowed */
	multiple?: boolean
	/** Placeholder text when no value is selected */
	placeholder?: string
	/** Props for the outer wrapper (Chakra Box) */
	wrapperProps?: BoxProps
}
