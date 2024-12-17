import React from 'react'
import Image from 'next/image'

const Animation = () => {
  return (
    <div className='flex justify-center items-center'>
      <Image src='/skeletonLoading.gif' width={150} height={150} alt='loading animation' className='rounded-md'/>
    </div>
  )
}

export default Animation
