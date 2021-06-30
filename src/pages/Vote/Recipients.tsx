import React from 'react'
import styled from 'styled-components'

import { ButtonPrimary } from '../../components/Button'
import { RowFixed } from '../../components/Row'
import { shortenAddress } from '../../utils'

const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
`

function PickOne() {
  return <>Unimplemented</>
}

function PickMany() {
  return <>Unimplemented</>
}

function ForOrAgainst({ recipients }: { recipients: string[] }) {
  /* TEMP flags */
  const isBeforeVotingDeadline = true

  return (
    <>
      {isBeforeVotingDeadline ? (
        <RowFixed style={{ width: '100%', gap: '12px' }}>
          {recipients.map((recipient, i) => (
            <ButtonPrimary
              onClick={() => {
                console.log({ recipient })
              }}
              key={i}
            >
              Vote {i === 0 ? 'For' : 'Against'}
            </ButtonPrimary>
          ))}
        </RowFixed>
      ) : null}
      <hr />
      or
      <ButtonPrimary
        onClick={() => {
          console.log('new key')
        }}
      >
        New Key
      </ButtonPrimary>
      <CardWrapper>
        {recipients.map((recipient, i) => (
          <p key={i}>{shortenAddress(recipient)}</p>
        ))}
      </CardWrapper>
    </>
  )
}

export default function Recipients({ recipients, electionType }: { recipients: string[]; electionType: string }) {
  return (
    <>
      {
        {
          0: <PickOne />,
          1: <PickMany />,
          2: <ForOrAgainst recipients={recipients} />,
        }[electionType]
      }
    </>
  )
}
