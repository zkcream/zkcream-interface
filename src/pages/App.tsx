import React from 'react'
import styled from 'styled-components'
import { Redirect, Route, Switch } from 'react-router-dom'

import Header from '../components/Header'
import Web3ReactManager from '../components/Web3ReactManager'
import Admin from './Admin'
import Vote from './Vote'
import VotePage from './Vote/VotePage'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: colum;
  align-items: flex-start;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 120px 16px 0px 16px;
  align-items: center;
  flex: 1;
  z-index: 1;
  width: 100%;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 6rem 16px 16px 16px;
  `};
`

const HeaderWrapper = styled.div`
  width: 100%;
  justify-content: space-between;
  position: fixed;
  top: 0;
  z-index: 2;
  ${({ theme }) => theme.flexRowNoWrap}
`

function App() {
  return (
    <AppWrapper>
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>
      <BodyWrapper>
        <Web3ReactManager>
          <Switch>
            <Route exact strict path="/" component={Vote} />
            <Route exact strict path="/vote/:address" component={VotePage} />
            <Route exact strict path="/admin" component={Admin} />
            <Redirect to="/" />
          </Switch>
        </Web3ReactManager>
      </BodyWrapper>
    </AppWrapper>
  )
}

export default App
