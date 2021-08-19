import { useEffect, useState } from 'react'

import { ElectionData } from '../state/election/reducer'
import { useElectionState } from '../state/election/hooks'

export function useLocalStorage(key: string, initialValue: string) {
  const electionData: ElectionData | undefined = useElectionState()
  let maciAddress: string
  if (electionData) {
    maciAddress = electionData.maciAddress
  } else {
    throw Error('ERROR getting maciAddress from state.')
  }

  const [storedValue, setStoredValue] = useState(() => {
    try {
      let localMaciObj: any = window.localStorage.getItem(maciAddress)
      localMaciObj = JSON.parse(localMaciObj)
      const item = localMaciObj ? localMaciObj[key] : initialValue
      return item ? item : initialValue
    } catch (e) {
      console.error(e)
      return initialValue
    }
  })

  useEffect(() => {
    let localMaciObj: any = window.localStorage.getItem(maciAddress)
    localMaciObj = JSON.parse(localMaciObj)
    try {
      // reset
      if (localMaciObj) {
        localMaciObj[key] = undefined
      } else {
        localMaciObj = {
          [key]: initialValue,
        }
      }

      localMaciObj[key] = storedValue
      window.localStorage.setItem(maciAddress, JSON.stringify(localMaciObj))
    } catch (e) {
      console.error(e)
    }
  }, [initialValue, key, maciAddress, storedValue])

  return [storedValue, setStoredValue]
}
