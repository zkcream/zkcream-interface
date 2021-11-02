import { useEffect } from "react"
import { getToken, verify } from "../../utils/user"
import { ErrorType } from "../error/actions";
import { useSetError } from "../error/hooks";


export default function Initializer(): null {
  const setError = useSetError()

  useEffect(() => {
    async function run() {
      const verified = await verify()
      if (!verified) {
        const token = await getToken()
        if (token === null) { 
          setError(ErrorType.SIG_ERROR)
          return
        }
        window.location.reload()
      }
    }
    run()
  });

  return null
}
