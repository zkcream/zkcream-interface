import { Trans } from '@lingui/macro'
import { Label } from '@rebass/forms'
import { useState } from 'react'
import QrReader from 'react-qr-reader'
import { Box, Text } from 'rebass'
import { ErrorType } from '../../state/error/actions'
import { FormInput } from '../../theme'
import { useInput } from '../../utils/inputs'
import { ButtonPrimary } from '../Button'
import Error from '../Error'

interface VoterStateProps {
  toggleModal: () => void
  patterns: string[]
  nav: string
  setStateIndex: React.Dispatch<any>
  setNonce: React.Dispatch<any>
  setMaciSk: React.Dispatch<any>
}

export default function VoterState({
  toggleModal,
  patterns,
  nav,
  setStateIndex,
  setNonce,
  setMaciSk,
}: VoterStateProps) {
  const [dataReceived, setDataReceived] = useState<boolean>(false)
  const [error, setError] = useState<ErrorType | null>(null)
  const { value: _stateIndex, bind: bindStateIndex, reset: resetStateIndex } = useInput('')
  // TEMP: fixed nonce
  const { value: _nonce } = useInput('1')
  const { value: _macisk, bind: bindMaciSk, reset: resetMaciSk } = useInput('')

  function setState() {
    if (!isNaN(parseInt(_stateIndex)) && !isNaN(parseInt(_nonce)) && typeof _macisk === 'string') {
      setStateIndex(_stateIndex.toString())
      setNonce(_nonce.toString())
      setMaciSk(_macisk)

      resetStateIndex()
      resetMaciSk()

      // TODO validate and reload
    } else {
      setError(ErrorType.FORMAT_ERROR)
    }
  }

  function validateStatesFormat(data: string[]): boolean {
    if (
      data.length !== 3 ||
      !data[0].startsWith('signUpIndex:') ||
      !data[1].startsWith('macisk.') ||
      !data[2].startsWith('nonce:')
    )
      return false
    return true
  }

  function handleScan(data: string | null) {
    if (data) {
      setDataReceived(true)
      const states = data.split(',')
      if (validateStatesFormat(states)) {
        setStateIndex(states[0].replace('signUpIndex:', ''))
        setMaciSk(states[1])
        setNonce(states[2].replace('nonce:', ''))
        setError(null)
        setDataReceived(false)
        toggleModal()
      } else {
        setError(ErrorType.FORMAT_ERROR)
        setDataReceived(false)
        return
      }
      console.log('vote state loaded')
    }
  }

  return (
    <Box my={20}>
      {error ? <Error error={error} /> : null}
      {nav === patterns[0] ? (
        <>
          <Box my={20}>
            <Text textAlign={'center'} my={20}>
              <Trans>Please scan your QR code</Trans>
            </Text>
            {dataReceived ? (
              <Text>
                <Trans>Reading....</Trans>
              </Text>
            ) : (
              <QrReader delay={300} onError={(e) => console.error(e)} onScan={handleScan} />
            )}
          </Box>
        </>
      ) : (
        <>
          {dataReceived ? (
            <Text>
              <Trans>Submitting....</Trans>
            </Text>
          ) : (
            <Box>
              <Box>
                <Label fontWeight="bold">
                  <Trans>Sign up index</Trans>
                </Label>
                <FormInput {...bindStateIndex} />
              </Box>
              <Box>
                <Label fontWeight="bold">
                  <Trans>MaciSk</Trans>
                </Label>
                <FormInput {...bindMaciSk} />
              </Box>
              <Box>
                <Label fontWeight="bold">
                  <Trans>Nonce</Trans>
                </Label>
                <FormInput disabled={true} value={1} />
              </Box>
            </Box>
          )}
          <Box my={20}>
            <ButtonPrimary onClick={setState}>
              <Trans>Set Voter's State</Trans>
            </ButtonPrimary>
          </Box>
        </>
      )}
    </Box>
  )
}
