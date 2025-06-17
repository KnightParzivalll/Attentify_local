import { BoxProps, ButtonProps } from '@chakra-ui/react'
import React from 'react'

export interface CarouselButtonProps extends ButtonProps {
	ariaLabel: string
}

export interface CarouselItem<T> {
	value: T
	label: string
	/** Optional unique identifier; if not provided, the value is assumed to be unique */
	id?: string | number
}

export interface CarouselProps<T> {
	/** Currently selected value */
	value: T
	/** Callback to change the selected value */
	onChange: (value: T) => void
	/** Collection of items to display in the carousel */
	collection: CarouselItem<T>[]
	/** Optional comparator function, defaults to strict equality */
	compare?: (collectionValue: T, value: T) => boolean
	/** Optional default index if value is not found in collection (default is 0) */
	defaultIndex?: number
	/** Props for the outer wrapper Box */
	wrapperProps?: BoxProps
	/** Custom left icon for navigation */
	leftIcon?: React.ElementType
	/** Custom right icon for navigation */
	rightIcon?: React.ElementType
	/** Color palette for navigation buttons (default: 'brand') */
	navColorPalette?: ButtonProps['colorPalette']
	/** Color palette for item buttons (default: 'brand') */
	itemColorPalette?: ButtonProps['colorPalette']
	/** Variant for navigation buttons (default: 'ghost') */
	navButtonVariant?: ButtonProps['variant']
	/** Variant for selected item button (default: 'solid') */
	itemButtonSelectedVariant?: ButtonProps['variant']
	/** Variant for unselected item button (default: 'outline') */
	itemButtonUnselectedVariant?: ButtonProps['variant']
	/** Message to display when collection is empty */
	emptyMessage?: string
}
