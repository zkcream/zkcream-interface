import { ButtonNav } from '../Button'
import { RowFixed } from '../Row'

interface NavProps {
  patterns: string[]
  nav: string
  toggleNav: () => void
}

export default function Nav({ patterns, nav, toggleNav }: NavProps) {
  return (
    <RowFixed style={{ width: '100%' }}>
      {patterns.map((pattern, i) => (
        <ButtonNav disabled={nav === pattern} onClick={toggleNav} key={i}>
          {pattern}
        </ButtonNav>
      ))}
    </RowFixed>
  )
}
