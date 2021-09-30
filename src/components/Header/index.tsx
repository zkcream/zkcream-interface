import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'
import { useResetToTopPage } from '../../state/election/hooks'

import Web3Status from '../Web3Status'

const HeaderFrame = styled.div`
  display: grid;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  padding: 1rem;
  z-index: 21;
  position: relative;

  grid-template-columns: auto 1fr;

  /* ${({ theme }) => theme.mediaWidth.upToMedium`
    padding:  1rem;
    grid-template-columns: auto 1fr;
  `}; */

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 1rem;
  `}
`

const HeaderElement = styled.div`
  display: flex;
  flex-direction: row-reverse;
`

const Title = styled.a`
  color: ${({ theme }) => theme.primary};
  align-items: center;
  display: flex;
  font-weight: bold;
  justify-self: flex-start;
  margin-right: 12px;
  pointer-events: auto;
  text-decoration: none;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
`

export default function Header() {
  const resetToTopPage = useResetToTopPage()

  return (
    <HeaderFrame>
      <Title as={Link} to={'/'} onClick={resetToTopPage}>
        zkCREAM
      </Title>
      <HeaderElement>
        <Web3Status />
      </HeaderElement>
    </HeaderFrame>
  )
}
