import { Trans } from '@lingui/macro'
import { Label } from '@rebass/forms'
import { useState } from 'react'
import QrReader from 'react-qr-reader'
import { Box, Text } from 'rebass'
import styled from 'styled-components'
import { PostSignUpData } from '.'
import { useSignUpCallback } from '../../hooks/useSignUpCallback'
import { useActiveWeb3React } from '../../hooks/web3'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen } from '../../state/application/hooks'
import { ErrorType } from '../../state/error/actions'
import { useFetchTokenState } from '../../state/token/hooks'
import { black, FormInput } from '../../theme'
import { FormatError, TxError } from '../../utils/error'
import { useInput } from '../../utils/inputs'
import { ButtonPrimary } from '../Button'
import Error from '../Error'
import MultiLevelModal, { MultiLevelModalContent } from '../MultiLevelModal'
import Spinner from '../Spinner'

interface SignUpReaderProps {
  toggleModal: () => void
  patterns: string[]
  nav: string
  zkCreamAddress: string
  maciAddress: string
}

const LoadingMessageWrapper = styled.div`
  display: flex;
  padding: 0.25rem;
`

export default function SignUp({ toggleModal, patterns, nav, zkCreamAddress, maciAddress }: SignUpReaderProps) {
  const { account } = useActiveWeb3React()
  const [error, setError] = useState<ErrorType | null>(null)
  const [noteReceived, setNoteReceived] = useState<boolean>(false)
  const { value: note, bind: bindNote, reset: resetNote } = useInput('')

  const signUpModalOpen = useModalOpen(ApplicationModal.SIGNUP)
  const arg: any = { zkCreamAddress, account }
  const fetchTokenState = useFetchTokenState(arg)

  const [txState, signUpIndex, maciSk, signUp] = useSignUpCallback(zkCreamAddress, maciAddress)

  function submit() {
    setNoteReceived(true)
    signUp(note)
      .then(() => resetNote())
      .catch((e) => {
        if (e instanceof FormatError) {
          setError(ErrorType.FORMAT_ERROR)
        } else if (e instanceof TxError) {
          setError(ErrorType.TX_ERROR)
        } else {
          setError(ErrorType.UNKNOWN_ERROR)
        }
        console.error(e.message)
      })
    setNoteReceived(false)
  }

  function handleScan(data: string | null) {
    const prefix = 'note:'
    if (data) {
      setNoteReceived(true)
      if (data.startsWith(prefix)) {
        const note = data.replace(prefix, '')
        signUp(note).then(() => {
          setError(null)
          setNoteReceived(false)
        })
      } else {
        setError(ErrorType.FORMAT_ERROR)
        setNoteReceived(false)
        return
      }
    }
  }

  function closeModal() {
    window.localStorage.clear()
    fetchTokenState()
    toggleModal()
  }

  const data: PostSignUpData = {
    maciSk: maciSk,
    signUpIndex: parseInt(signUpIndex!),
  }

  return (
    <Box my={20}>
      {parseInt(signUpIndex!) !== 0 ? ( // show vote state with nonce === 1, data = { maciSk, signUpIndex }
        <MultiLevelModal
          isOpen={signUpModalOpen}
          onDismiss={closeModal}
          content={MultiLevelModalContent.PostSignUp}
          data={data}
        />
      ) : (
        <>
          {error ? <Error error={error} /> : null}
          {nav === patterns[0] ? (
            <>
              <Box my={20}>
                <Label fontWeight="bold">
                  <Trans>Scan your barcode</Trans>
                </Label>
                {noteReceived ? (
                  <LoadingMessageWrapper>
                    <Spinner />
                    <Text>
                      <Trans>Reading....</Trans>
                    </Text>
                  </LoadingMessageWrapper>
                ) : (
                  <QrReader delay={300} onError={(e) => console.error(e)} onScan={handleScan} />
                )}
              </Box>
            </>
          ) : (
            <>
              {noteReceived ? (
                <LoadingMessageWrapper>
                  <Spinner />
                  <Text>
                    <Trans>Submitting....</Trans>
                  </Text>
                </LoadingMessageWrapper>
              ) : (
                <>
                  <Label fontWeight="bold">
                    <Trans>Note text</Trans>
                  </Label>
                  <FormInput {...bindNote} />
                </>
              )}
              <Box my={20}>
                <ButtonPrimary onClick={submit} disabled={txState}>
                  {txState && signUpIndex === '0' ? (
                    <Spinner color={black} height={16} width={16} />
                  ) : (
                    <Trans>Submit note</Trans>
                  )}
                </ButtonPrimary>
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  )
}
