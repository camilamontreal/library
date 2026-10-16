import { useMediaQuery } from './lib/hooks'
import { Desktop } from './os/desktop/Desktop'
import { Mobile } from './os/mobile/Mobile'
import { Spotlight } from './os/Spotlight'
import { Intro, introSeen } from './os/Intro'
import { useState } from 'react'

/**
 * < 768 px: experiência de iPhone (tela de bloqueio + tela inicial + apps em tela cheia).
 * ≥ 768 px: experiência de Mac (mesa, widgets, janelas, dock).
 * Os dois lêem o mesmo conteúdo em /src/content.
 */
export default function App() {
  const mobile = useMediaQuery('(max-width: 767px)')
  const [intro, setIntro] = useState(() => !introSeen())
  return <>{mobile ? <Mobile /> : <Desktop />}<Spotlight />{intro && <Intro onDone={() => setIntro(false)} />}</>
}
