import React from 'react'
import { useCurrentPage, useLoadPrevPage, useLoadNextPage } from '../../state/election/hooks'

export default function Paging({ total }: { total: number }) {
  const currentPage = useCurrentPage()
  const isDisableNext = total - (currentPage * 5) < 5

  const loadPrevPage = useLoadPrevPage()
  const loadNextPage = useLoadNextPage()

  return (
    <>
      <button disabled={!currentPage} onClick={loadPrevPage}>Prev</button>
      <button disabled={isDisableNext} onClick={loadNextPage}>Next</button>
    </>
  )
}
