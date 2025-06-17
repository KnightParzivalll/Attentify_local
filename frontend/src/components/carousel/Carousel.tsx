import { Box, Button, ButtonProps, Flex, HStack, Icon } from '@chakra-ui/react'
import { useWindowSize } from '@uidotdev/usehooks'
import React, { JSX, useCallback, useEffect, useRef } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { CarouselButtonProps, CarouselProps } from './Carousel.types'

/** Default style constants with types from Chakra UI */
const DEFAULT_NAV_COLOR_PALETTE: ButtonProps['colorPalette'] = 'brand'
const DEFAULT_ITEM_COLOR_PALETTE: ButtonProps['colorPalette'] = 'brand'
const DEFAULT_NAV_BUTTON_VARIANT: ButtonProps['variant'] = 'ghost'
const DEFAULT_ITEM_BUTTON_SELECTED_VARIANT: ButtonProps['variant'] = 'solid'
const DEFAULT_ITEM_BUTTON_UNSELECTED_VARIANT: ButtonProps['variant'] = 'outline'
const DEFAULT_LEFT_ICON = FaChevronLeft
const DEFAULT_RIGHT_ICON = FaChevronRight

// Use forwardRef so that ref can be passed to the underlying Button
const CarouselButton = React.forwardRef<HTMLButtonElement, CarouselButtonProps>(
	({ ariaLabel, children, ...props }, ref) => (
		<Button ref={ref} aria-label={ariaLabel} {...props}>
			{children}
		</Button>
	)
)
CarouselButton.displayName = 'CarouselButton'

const Carousel = <T,>({
	value,
	onChange,
	collection,
	compare = (collectionValue: T, value: T) => collectionValue === value,
	defaultIndex,
	wrapperProps,
	leftIcon = DEFAULT_LEFT_ICON,
	rightIcon = DEFAULT_RIGHT_ICON,
	navColorPalette = DEFAULT_NAV_COLOR_PALETTE,
	itemColorPalette = DEFAULT_ITEM_COLOR_PALETTE,
	navButtonVariant = DEFAULT_NAV_BUTTON_VARIANT,
	itemButtonSelectedVariant = DEFAULT_ITEM_BUTTON_SELECTED_VARIANT,
	itemButtonUnselectedVariant = DEFAULT_ITEM_BUTTON_UNSELECTED_VARIANT,
	emptyMessage = 'No items available'
}: CarouselProps<T>): JSX.Element => {
	// If collection is empty, display an error message
	if (!collection.length) {
		return (
			<Box {...wrapperProps} textAlign='center' p={4}>
				{emptyMessage}
			</Box>
		)
	}

	const _defaultIndex = defaultIndex ?? 0
	const foundIndex = collection.findIndex(item => compare(item.value, value))
	const selectedIndex = foundIndex !== -1 ? foundIndex : _defaultIndex

	const containerRef = useRef<HTMLDivElement>(null)
	const itemRefs = useRef<Array<HTMLButtonElement | null>>([])

	const { width } = useWindowSize()

	const scrollToSection = useCallback((index: number) => {
		if (containerRef.current && itemRefs.current[index]) {
			const container = containerRef.current
			const item = itemRefs.current[index]
			const containerRect = container.getBoundingClientRect()
			const itemRect = item.getBoundingClientRect()

			const offset =
				itemRect.left -
				containerRect.left -
				container.clientWidth / 2 +
				itemRect.width / 2
			container.scrollBy({ left: offset, behavior: 'smooth' })
		}
	}, [])

	useEffect(() => {
		scrollToSection(selectedIndex)
	}, [selectedIndex, width, scrollToSection])

	const handlePrev = useCallback(() => {
		if (selectedIndex > 0) {
			const newIndex = selectedIndex - 1
			scrollToSection(newIndex)
			onChange(collection[newIndex].value)
		} else {
			scrollToSection(selectedIndex)
		}
	}, [selectedIndex, collection, onChange, scrollToSection])

	const handleNext = useCallback(() => {
		if (selectedIndex < collection.length - 1) {
			const newIndex = selectedIndex + 1
			scrollToSection(newIndex)
			onChange(collection[newIndex].value)
		} else {
			scrollToSection(selectedIndex)
		}
	}, [selectedIndex, collection, onChange, scrollToSection])

	const handleClick = useCallback(
		(itemValue: T) => {
			const index = collection.findIndex(item => compare(item.value, itemValue))
			scrollToSection(index)
			onChange(itemValue)
		},
		[collection, onChange, scrollToSection, compare]
	)

	return (
		<Box {...wrapperProps}>
			<Flex justifyContent='center' gap='10px' alignItems='center'>
				<CarouselButton
					onClick={handlePrev}
					variant={navButtonVariant}
					colorPalette={navColorPalette}
					ariaLabel='Previous'
				>
					<Icon as={leftIcon} boxSize={6} />
				</CarouselButton>

				<HStack
					ref={containerRef}
					overflowX='auto'
					maxW='clamp(200px, 50vw, 700px)'
					gap='12px'
					scrollbarWidth='none'
				>
					{collection.map((item, idx) => (
						<CarouselButton
							key={item.id ?? idx}
							ref={el => {
								itemRefs.current[idx] = el
							}}
							onClick={() => handleClick(item.value)}
							variant={
								selectedIndex === idx
									? itemButtonSelectedVariant
									: itemButtonUnselectedVariant
							}
							colorPalette={itemColorPalette}
							ariaLabel={`Select ${item.label}`}
						>
							{item.label}
						</CarouselButton>
					))}
				</HStack>

				<CarouselButton
					onClick={handleNext}
					variant={navButtonVariant}
					colorPalette={navColorPalette}
					ariaLabel='Next'
				>
					<Icon as={rightIcon} boxSize={6} />
				</CarouselButton>
			</Flex>
		</Box>
	)
}

export default Carousel
