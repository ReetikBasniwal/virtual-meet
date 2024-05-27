import React from 'react'
import { useParams } from 'react-router-dom';

export default function FourOFour() {
  const { id } = useParams();

  return (
    <div className='flex items-center justify-center h-full w-100'>
      No room exist with this id {id}.
    </div>
  )
}
