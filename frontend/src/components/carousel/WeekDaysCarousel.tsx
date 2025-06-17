import React from 'react'
import Carousel from './Carousel'
import { CarouselItem, CarouselProps } from './Carousel.types'

export interface WeekDaysCarouselProps
	extends Omit<CarouselProps<string>, 'collection'> {
	/** Data for week days, passed as an array of items (each with value and label) */
	weekdays: CarouselItem<string>[]
}

const WeekDaysCarouselWrapper: React.FC<WeekDaysCarouselProps> = ({
	weekdays,
	...carouselProps
}) => {
	return <Carousel collection={weekdays} {...carouselProps} />
}

export default WeekDaysCarouselWrapper
