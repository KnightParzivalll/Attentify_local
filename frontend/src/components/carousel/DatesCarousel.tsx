import React from 'react'
import Carousel from './Carousel'
import { CarouselItem, CarouselProps } from './Carousel.types'

export interface DatesCarouselProps
	extends Omit<CarouselProps<string>, 'collection'> {
	/** Data for dates, passed as an array of items (each with value and label) */
	dates: CarouselItem<string>[]
}

const DatesCarouselWrapper: React.FC<DatesCarouselProps> = ({
	dates,
	...carouselProps
}) => {
	return <Carousel collection={dates} {...carouselProps} />
}

export default DatesCarouselWrapper
