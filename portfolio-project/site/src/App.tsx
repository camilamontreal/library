import { useMediaQuery } from './lib/hooks'
import { Desktop } from './os/desktop/Desktop'
import { Mobile } from './os/mobile/Mobile'
import { Spotlight } from './os/Spotlight'

/**
 * < 768 px: experiência de iPhone (tela de bloqueio + tela inicial + apps em tela cheia).
 * ≥ 768 px: experiência de Mac (mesa, widgets, janelas, dock).
 * Os dois lêem o mesmo conteúdo em /src/content.
 */
export default function App() {
  const mobile = useMediaQuery('(max-width: 767px)')
  return <>{mobile ? <Mobile /> : <Desktop />}<Spotlight /></>
}
