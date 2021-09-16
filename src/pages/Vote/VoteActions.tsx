import React, { useState } from 'react'
import { Trans } from '@lingui/macro'

import { ButtonPrimary } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import { ActionNames, MessageAction, VoteNav } from '../../components/VoteNav'
import { VotePatterns } from '../../components/VotePatterns'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { usePublishMessageCallback } from '../../hooks/usePublishMessageCallback'
import { ApplicationModal } from '../../state/application/actions'
import { useVoterStateModalToggle, useModalOpen } from '../../state/application/hooks'
import MultiLevelModal, { MultiLevelModalContent } from '../../components/MultiLevelModal'
import Spinner from '../../components/Spinner'
import { black } from '../../theme'

export interface VoteActionsProps {
  recipients: string[]
  electionType: string
  isPublished?: boolean | undefined
  isApproved?: boolean | undefined
}

export default function VoteActions({ recipients, electionType, isApproved }: VoteActionsProps) {
  const [radioState, setRadioState] = useState<MessageAction>(MessageAction.SELECT)
  const [stateIndex, setStateIndex] = useLocalStorage('stateIndex', '0')
  const [nonce, setNonce] = useLocalStorage('nonce', '1')
  const [maciSk, setMaciSk] = useLocalStorage('macisk', '')
  const [publishTxState, publishMessage] = usePublishMessageCallback()

  // toggle voter state modal
  const voterStateModalOpen = useModalOpen(ApplicationModal.VOTERSTATE)
  const toggleModal = useVoterStateModalToggle()

  function toggleRadio(e: any) {
    setRadioState(ActionNames[e.target.value][0] as MessageAction)
  }

  return (
    <>
      {!isApproved ? (
        <>
          <MultiLevelModal
            isOpen={!parseInt(stateIndex) || voterStateModalOpen}
            onDismiss={toggleModal}
            content={MultiLevelModalContent.VoterState}
            setStateIndex={setStateIndex}
            setNonce={setNonce}
            setMaciSk={setMaciSk}
          />
          <VoteNav radioState={radioState} handleChange={toggleRadio} />
          {radioState === 0 ? (
            <VotePatterns
              recipients={recipients}
              electionType={electionType}
              stateIndex={stateIndex}
              nonce={nonce}
              setNonce={setNonce}
              maciSk={maciSk}
            />
          ) : (
            <AutoColumn justify="center">
              <ButtonPrimary
                width="50%"
                disabled={publishTxState}
                onClick={() =>
                  publishMessage(null, parseInt(stateIndex!), parseInt(nonce!), maciSk, setMaciSk).then(() =>
                    setNonce(parseInt(nonce) + 1) 
                  )
                }
              >
                {publishTxState ? <Spinner color={black} height={16} width={16} /> : <Trans>Create New Key</Trans>}
              </ButtonPrimary>
            </AutoColumn>
          )}
        </>
      ) : null}
    </>
  )
}
