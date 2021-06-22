import { useAddressInput } from '../../utils/inputs'

export default function ForOrAgainst({ setRecipients }: { setRecipients: any }) {
  // since we cannot use `for` variable, use `forValue` instead
  const { value: forValue, bind: bindFor, reset: resetFor, isEthAddress: isForCorrectFormat } = useAddressInput('')
  const {
    value: againstValue,
    bind: bindAgainst,
    reset: resetAgainst,
    isEthAddress: isAgainstCorrectFormat,
  } = useAddressInput('')

  function onConfirm(e: any) {
    e.preventDefault()
    setRecipients([forValue, againstValue])
    resetFor()
    resetAgainst()
  }

  const disabled = !isForCorrectFormat || !isAgainstCorrectFormat

  return (
    <div>
      <div>
        <span>Set candidates address</span>
      </div>
      <label>For</label>
      <input type="text" {...bindFor} />
      <label>Against</label>
      <input type="text" {...bindAgainst} />
      <button onClick={onConfirm} disabled={disabled}>
        Confirm
      </button>
    </div>
  )
}
