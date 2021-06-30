import React from 'react'
import styled from 'styled-components/macro'

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

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding:  1rem;
    grid-template-columns: auto 1fr;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 1rem;
  `}
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row-reverse;
    align-items: center;
  `};
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  font-weight: bold;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
`

export default function Header() {
  return (
    <HeaderFrame>
      <Title>zkCREAM</Title>
      <HeaderElement>
        <Web3Status />
      </HeaderElement>
    </HeaderFrame>
  )
}
