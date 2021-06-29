import React from 'react'
import { useLoadPrevPage, useLoadNextPage } from '../../state/application/hooks'

export default function Paging() {
  const loadPrevPage = useLoadPrevPage()
  const loadNextPage = useLoadNextPage()

  return (
    <>
      <button onClick={loadPrevPage}>Prev</button>
      <button onClick={loadNextPage}>Next</button>
    </>
  )
}
