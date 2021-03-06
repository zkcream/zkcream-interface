import { useState } from 'react'
import { Trans } from '@lingui/macro'
import { Text } from 'rebass'

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
import { VotingState } from '../../state/election/actions'
import { useElectionState } from '../../state/election/hooks'
import { ElectionData } from '../../state/election/reducer'

export interface VoteActionsProps {
  votingState?: VotingState
}

export default function VoteActions({ votingState }: VoteActionsProps) {
  const electionData: ElectionData | undefined = useElectionState()
  const { recipients, electionType } = electionData!
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
      {votingState === 0 ? (
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
      ) : (
        <>
          {votingState! < 3 ? (
            <Text>
              <Trans>The voting period has ended</Trans>
            </Text>
          ) : null}
        </>
      )}
    </>
  )
}
