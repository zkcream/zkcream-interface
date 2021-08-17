import { Trans } from '@lingui/macro'
import { Checkbox, Label } from '@rebass/forms'
import { useState } from 'react'
import { Box, Text } from 'rebass'
import { ButtonPrimary } from '../Button'
import CoordinatorKey from './CoordinatorKey'
import Nav from './Nav'
import Note from './Note'

export enum QrModalContent {
  CoordinatorKey,
  Note,
}

interface ContentDataBasics {
  maciSk?: string
  note?: string
}

export interface MaciSk extends ContentDataBasics {
  maciSk: string
}

export interface NoteData extends ContentDataBasics {
  note: string
}

export type ContentData = MaciSk | NoteData

interface QrModalProps {
  toggleModal: () => void
  content: QrModalContent
  data: ContentData
}

interface DetailProps extends QrModalProps {
  patterns: string[]
  nav: string
  toggleNav: () => void
}

function Show({ toggleModal, patterns, nav, toggleNav, content, data }: DetailProps) {
  const [checked, setChecked] = useState<boolean>(false)
  return (
    <>
      <Nav patterns={patterns} nav={nav} toggleNav={toggleNav} />
      {
        {
          0: <CoordinatorKey patterns={patterns} nav={nav} data={data} />,
          1: <Note patterns={patterns} nav={nav} data={data} />,
        }[content]
      }
      <Box pb={3}>
        <Label>
          <Checkbox checked={checked} onChange={() => setChecked(!checked)} />
          <Trans>I've stored my coordinator Private key</Trans>
        </Label>
      </Box>
      <Box>
        <ButtonPrimary disabled={!checked} onClick={toggleModal}>
          <Text>Clear Data</Text>
        </ButtonPrimary>
      </Box>
    </>
  )
}

export default function QrModal({ toggleModal, content, data }: QrModalProps) {
  const patterns = ['Text', 'QR Code']
  const [nav, setNav] = useState<string>(patterns[0])

  function toggleNav() {
    const op: number = nav === patterns[0] ? 1 : 0
    setNav(patterns[op])
  }

  return (
    <>
      <Show
        toggleModal={toggleModal}
        patterns={patterns}
        nav={nav}
        toggleNav={toggleNav}
        content={content}
        data={data}
      />
    </>
  )
}
