import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { polygon, polygonMumbai } from 'viem/chains'
import Header from './modules/Header'
import Body from './modules/Body'
import UserObserver from './utils/context'

function App() {
  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [polygon,
    polygonMumbai],
    [publicProvider()],
  )
  
  const config = createConfig({
    autoConnect: true,
    connectors: [
      new InjectedConnector({
        chains,
        options: {
          name: 'Injected',
          shimDisconnect: true,
        },
      })
    ],
    publicClient,
    webSocketPublicClient,
  })

  return (
    <WagmiConfig config={config}>
      <UserObserver>
        <Header/>
        <Body/>
      </UserObserver>
    </WagmiConfig>
  )
}

export default App