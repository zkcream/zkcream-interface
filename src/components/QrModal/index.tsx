import { Trans } from '@lingui/macro'
import { Checkbox, Label } from '@rebass/forms'
import { useState } from 'react'
import { Box, Text } from 'rebass'
import { ButtonPrimary } from '../Button'
import CoordinatorKey from './CoordinatorKey'
import Nav from './Nav'
import Note from './Note'
import PostSignUp from './PostSignUp'
import ReadRandomStateLeaf from './ReadRandomStateLeaf'
import ReadCoordinatorKey from './ReadCoordiantorKey'
import SignUp from './SignUp'
import VoterState from './VoterState'
import PostProcessMessage from './PostProcessMessage'
import SetCoordinatorKey from './SetCoordiantorKey'
import { useToggleable, useToggleToggleable } from '../../state/application/hooks'

export enum QrModalContent {
  CoordinatorKey,
  Note,
  SignUp,
  PostSignUp,
  VoterState,
  ReadCoordinatorKey,
  PostProcessMessage,
  ReadRandomStateLeaf,
  SetCoodrinatorKey,
}

interface ContentDataBasics {
  maciSk?: string
  note?: string
  signUpIndex?: number
  nonce?: number
  randomStateLeaf?: string
}

export interface MaciSk extends ContentDataBasics {
  maciSk: string
}

export interface NoteData extends ContentDataBasics {
  note: string
}

export interface PostSignUpData extends ContentDataBasics {
  maciSk: string
  signUpIndex: number
  nonce?: number
}

export interface RandomStateLeaf extends ContentDataBasics {
  randomStateLeaf: string
}

export type ContentData = MaciSk | NoteData | PostSignUpData | RandomStateLeaf

interface QrViewerProps {
  toggleModal: () => void
}

interface QrModalProps {
  toggleModal: () => void
  content: QrModalContent
  data?: ContentData
  zkCreamAddress?: string
  maciAddress?: string
  setStateIndex?: any
  setNonce?: any
  setMaciSk?: any
}

function Read() {
  return <></>
}

function View({ toggleModal }: QrViewerProps) {
  const toggleable = useToggleable()
  const setToggleable = useToggleToggleable()

  return (
    <>
      <Box my={10}>
        <Label>
          <Checkbox checked={toggleable} onChange={setToggleable} />
          <Trans>I stored the information in a secure location</Trans>
        </Label>
      </Box>
      <Box>
        <ButtonPrimary disabled={!toggleable} onClick={toggleModal}>
          <Text>
            <Trans>Clear Data</Trans>
          </Text>
        </ButtonPrimary>
      </Box>
    </>
  )
}

export default function QrModal({
  toggleModal,
  content,
  data,
  zkCreamAddress,
  maciAddress,
  setStateIndex,
  setNonce,
  setMaciSk,
}: QrModalProps) {
  const patterns = ['QR Code', 'Text']
  const [nav, setNav] = useState<string>(patterns[0])

  function toggleNav() {
    const op: number = nav === patterns[0] ? 1 : 0
    setNav(patterns[op])
  }

  return (
    <>
      <Nav patterns={patterns} nav={nav} toggleNav={toggleNav} />
      {
        {
          0: <CoordinatorKey patterns={patterns} nav={nav} data={data!} />,
          1: <Note patterns={patterns} nav={nav} data={data!} />,
          2: (
            <SignUp
              toggleModal={toggleModal}
              patterns={patterns}
              nav={nav}
              zkCreamAddress={zkCreamAddress!}
              maciAddress={maciAddress!}
            />
          ),
          3: <PostSignUp patterns={patterns} nav={nav} data={data!} />,
          4: (
            <VoterState
              toggleModal={toggleModal}
              patterns={patterns}
              nav={nav}
              setStateIndex={setStateIndex}
              setNonce={setNonce}
              setMaciSk={setMaciSk}
            />
          ),
          5: <ReadCoordinatorKey patterns={patterns} nav={nav} />,
          6: <PostProcessMessage patterns={patterns} nav={nav} data={data!} />,
          7: <ReadRandomStateLeaf patterns={patterns} nav={nav} />,
          8: <SetCoordinatorKey patterns={patterns} nav={nav} setMaciSk={setMaciSk} />,
        }[content]
      }
      {!data ? <Read /> : <View toggleModal={toggleModal} />}
    </>
  )
}
