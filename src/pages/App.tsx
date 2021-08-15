import { lazy, Suspense } from 'react'
import styled from 'styled-components'
import { Redirect, Route, Switch } from 'react-router-dom'

import Error from '../components/Error'
import Header from '../components/Header'
import Web3ReactManager from '../components/Web3ReactManager'
import { useErrorState } from '../state/error/hooks'

const VoteComponent = lazy(() => import('./Vote'))
const VotePageComponent = lazy(() => import('./Vote/VotePage'))

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
  const error = useErrorState()

  return (
    <AppWrapper>
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>
      <BodyWrapper>
        <Web3ReactManager>
          <Suspense fallback={<></>}>
            <Error error={error} />
            <Switch>
              <Route exact strict path="/" component={VoteComponent} />
              <Route exact strict path="/vote/:address" component={VotePageComponent} />
              <Redirect to="/" />
            </Switch>
          </Suspense>
        </Web3ReactManager>
      </BodyWrapper>
    </AppWrapper>
  )
}

export default App
