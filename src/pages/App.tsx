import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import Header from '../components/Header'
import Web3ReactManager from '../components/Web3ReactManager'
import Admin from './Admin'
import Vote from './Vote'
import VotePage from './Vote/VotePage'

function App() {
  return (
    <>
      <Header />
      <Web3ReactManager>
        <Switch>
          <Route exact strict path="/" component={Vote} />
          <Route exact strict path="/vote/:address" component={VotePage} />
          <Route exact strict path="/admin" component={Admin} />
          <Redirect to="/" />
        </Switch>
      </Web3ReactManager>
    </>
  )
}

export default App
