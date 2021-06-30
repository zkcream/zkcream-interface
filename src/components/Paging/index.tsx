import React from 'react'
import styled from 'styled-components'
import { ChevronLeft, ChevronRight } from 'react-feather'

import { ButtonIcon } from '../../components/Button'
import { useCurrentPage, useLoadPrevPage, useLoadNextPage } from '../../state/election/hooks'

export default function Paging({ total }: { total: number }) {
  const PagingWrapper = styled.div`
    display: flex;
    flex-direction: row;
  `

  const currentPage = useCurrentPage()
  const isDisableNext = total - currentPage * 5 < 5

  const loadPrevPage = useLoadPrevPage()
  const loadNextPage = useLoadNextPage()

  return (
    <PagingWrapper>
      <ButtonIcon disabled={!currentPage} onClick={loadPrevPage}>
        <ChevronLeft size={16} />
      </ButtonIcon>
      <ButtonIcon disabled={isDisableNext} onClick={loadNextPage}>
        <ChevronRight size={16} />
      </ButtonIcon>
    </PagingWrapper>
  )
}
