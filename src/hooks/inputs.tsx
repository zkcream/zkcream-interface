import { useState } from 'react'
import { isAddress } from '@ethersproject/address'

export function useInput(initialValue: any) {
  const [value, setValue] = useState(initialValue)
  return {
    value,
    setValue,
    reset: () => setValue(''),
    bind: {
      value,
      onChange: (event: any) => {
        setValue(event.target.value)
      },
    },
  }
}

export function useAddressInput(initialValue: any) {
  const [value, setValue] = useState(initialValue)
  const [isEthAddress, setIsEthAddress] = useState(false)

  return {
    value,
    setValue,
    isEthAddress,
    setIsEthAddress,
    reset: () => {
      setValue('')
      setIsEthAddress(false)
    },
    bind: {
      value,
      onChange: (event: any) => {
        setValue(event.target.value)
        setIsEthAddress(isAddress(event.target.value))
      },
    },
  }
}
