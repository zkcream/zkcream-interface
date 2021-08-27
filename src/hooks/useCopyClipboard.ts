import copy from 'copy-to-clipboard'
import { useCallback, useEffect, useState } from 'react'

export default function useCopyClipboard(timeout = 500): [state: boolean, callback: (toCopy: string) => void] {
  const [isCopied, setIsCopied] = useState<boolean>(false)

  const c = useCallback((text) => {
    const r = copy(text)
    setIsCopied(r)
  }, [])

  useEffect(() => {
    if (isCopied) {
      const hide = setTimeout(() => {
        setIsCopied(false)
      }, timeout)

      return () => {
        clearTimeout(hide)
      }
    }
    return undefined
  }, [isCopied, setIsCopied, timeout])

  return [isCopied, c]
}
