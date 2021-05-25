import React from 'react'
import styled from 'styled-components/macro'

import Web3Status from '../Web3Status'

const HeaderFrame = styled.div`
  display: grid;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
`

const Title = styled.a`
  display: flex;
  align-items: center;
`

export default function Header() {
  return (
    <HeaderFrame>
      <Title>zkCREAM app</Title>
      <Web3Status />
    </HeaderFrame>
  )
}
