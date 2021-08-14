import Loader from 'react-loader-spinner'
import styled from 'styled-components'
import { wutang_yellow } from '../../theme'

const Wrapper = styled.div`
  padding-right: 1rem;
`

interface SpinnerProps {
  color?: string
  height?: number
  width?: number
}

export default function Spinner({ color = wutang_yellow, height = 16, width = 16 }: SpinnerProps) {
  return (
    <Wrapper>
      <Loader type="TailSpin" color={color} height={height} width={width} />
    </Wrapper>
  )
}
