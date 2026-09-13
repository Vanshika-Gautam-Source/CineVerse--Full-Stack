import React from 'react'
import HeroSection from '../components/HeroSection'
import FeaturedSection from '../components/FeaturedSection'
import TrailersSection from '../components/TrailersSection'
import Favorite from './Favorite'

const Home = () => {
  return (
    <>
      <HeroSection />
      <FeaturedSection />
      <TrailersSection />
      <Favorite />
    </>
  )
}

export default Home