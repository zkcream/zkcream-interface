import { Box, Flex } from 'rebass'
import { Label } from '@rebass/forms'
import { Trans } from '@lingui/macro'

import { useSendTokenCallback } from '../../hooks/useSendTokenCallback'
import { useElectionState } from '../../state/election/hooks'
import { ElectionData } from '../../state/election/reducer'
import { useAddressInput } from '../../utils/inputs'
import Spinner from '../Spinner'
import { ButtonInverse, ButtonPrimary } from '../Button'
import { black, FormInput } from '../../theme'
import { TxError } from '../../utils/error'
import { ErrorType } from '../../state/error/actions'
import { useEffect, useState } from 'react'
import Error from '../Error'
import styled from 'styled-components'
import { isAddress } from '../../utils'

interface DistributeProps {
  toggleModal: () => void
}

const AddressInputWrapper = styled.div`
  display: flex;
  padding: 0.25rem;
`

const RemoveButton = styled.button`
  font-size: x-large;
  border-radius: 6rem;
  border: none;
  background: none;
  margin-left: 0.5rem;
  :hover {
    color: ${({ theme }) => theme.primary};
  }
`

const EthInputComponent = ({
  addressList,
  setAddressList,
  index,
}: {
  addressList: string[]
  setAddressList: any
  index: number
}) => {
  function handleRemove(index: number) {
    const list = [...addressList]
    list.splice(index, 1)
    setAddressList(list)
  }

  function handleInputChange(e: any, index: number) {
    const { value } = e.target
    const list = [...addressList]
    list[index] = value
    setAddressList(list)
  }

  return (
    <AddressInputWrapper>
      <FormInput onChange={(e) => handleInputChange(e, index)} value={addressList[index]} />
      <RemoveButton onClick={() => handleRemove(index)}>-</RemoveButton>
    </AddressInputWrapper>
  )
}

export default function Distribute({ toggleModal }: DistributeProps) {
  const electionData: ElectionData | undefined = useElectionState()
  const [txState, sendToken] = useSendTokenCallback(electionData?.votingTokenAddress as string)
  const [error, setError] = useState<ErrorType | null>(null)
  const [addressList, setAddressList] = useState<string[]>([''])
  const [isValid, setValid] = useState<boolean>(false)

  useEffect(() => {
    function isDuplicated(e: string[]) {
      const setElements = new Set(e)
      return setElements.size !== e.length
    }

    function isOwnerOrCoordinator(address: string): boolean {
      return electionData?.owner === address || electionData?.coordinator === address
    }

    addressList.map((address) => {
      isAddress(address)
        ? !isOwnerOrCoordinator(address)
          ? !isDuplicated(addressList)
            ? setValid(true)
            : setValid(false)
          : setValid(false)
        : setValid(false)
    })
  }, [addressList])

  return (
    <Box>
      {error ? <Error error={error} /> : null}
      <Box mb={20}>
        <Flex pb={2}>
          <Label fontWeight="bold">
            <Trans>Voter's Address</Trans>
          </Label>
          <ButtonInverse
            borderRadius={'2rem'}
            padding={'5px'}
            width={'160px'}
            onClick={() => setAddressList([...addressList, ''])}
          >
            <Trans>Add Address</Trans>
          </ButtonInverse>
        </Flex>
        {addressList.map((address, i) => (
          <EthInputComponent addressList={addressList} setAddressList={setAddressList} key={i} index={i} />
        ))}
      </Box>
      <Box>
        <ButtonPrimary
          disabled={!isValid || txState}
          onClick={() =>
            sendToken(addressList)
              .then(toggleModal)
              .catch((e) => {
                if (e instanceof TxError) {
                  setError(ErrorType.TX_ERROR)
                } else {
                  setError(ErrorType.UNKNOWN_ERROR)
                }
              })
          }
        >
          {txState ? <Spinner color={black} height={16} width={16} /> : <Trans>Send Token</Trans>}
        </ButtonPrimary>
      </Box>
    </Box>
  )
}
