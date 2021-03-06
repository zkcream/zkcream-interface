import { createGlobalStyle, css, DefaultTheme } from 'styled-components'

import { Colors } from './styled'

export * from './components'

export const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 720,
  upToMedium: 960,
  upToLarge: 1280,
}

const mediaWidthTemplates: { [width in keyof typeof MEDIA_WIDTHS]: typeof css } = Object.keys(MEDIA_WIDTHS).reduce(
  (accumulator, size) => {
    ;(accumulator as any)[size] = (a: any, b: any, c: any) => css`
      @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
        ${css(a, b, c)}
      }
    `
    return accumulator
  },
  {}
) as any

export const white = '#ffffff'
export const black = '#000000'
export const wutang_yellow = '#fecc01'

export function colors(): Colors {
  return {
    // base
    white,
    black,
    greyText: '#6c7284',

    // primary colors
    primary: wutang_yellow,

    // other
    blue: '#0088ff',
    green: '#00ff44',
    orange: '#FF6719',
    red: '#FF120D',

    // backgrounds
    baseBackground: white,
    darkBackgraound: '#181A20',
    modalBackground: 'rgba(0,0,0,0.3)',
    placeholderGray: '#e1e1e1',
  }
}

export function theme(): DefaultTheme {
  return {
    ...colors(),

    grids: {
      sm: 8,
      md: 12,
      lg: 24,
    },

    mediaWidth: mediaWidthTemplates,

    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `,
  }
}

export const GlobalStyle = createGlobalStyle`
html, input, textarea, button {
  font-family: 'Inter', sans-serif;
  font-display: fallback;
}
@supports (font-variation-settings: normal) {
  html, input, textarea, button {
    font-family: 'Inter var', sans-serif;
  }
}
html,
body {
  margin: 0;
  padding: 0;
}
a {
  color: 'blue';
  text-decoration: none;
}
* {
  box-sizing: border-box;
}
button {
  user-select: none;
}
html {
  font-size: 16px;
  font-variant: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  font-feature-settings: 'ss01' on, 'ss02' on,  'cv01' on, 'cv03' on;
}
`

export const ThemedGlobalStyle = createGlobalStyle`
  html {
    color: ${({ theme }) => theme.black};
    background-color: ${({ theme }) => theme.darkBackgraound};
  }
  body {
    min-height: 100vh;
  }
`
