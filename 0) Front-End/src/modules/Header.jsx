import {styled} from 'styled-components'
import Button from '../components/Button'
import {useContext, useEffect, useState} from 'react'
import WalletModal from '../modals/WalletModal'
import { useAccount, useDisconnect, useNetwork, useSignMessage } from 'wagmi'
import {UserCircle} from '@styled-icons/boxicons-regular'
import { primaryColor } from '../constants'
import { SiweMessage } from 'siwe'
import { CircularProgress } from '../components/CircularProgress'
import { httpPostRequest } from '../utils/utils'
import { UserContext } from '../utils/context'

function Header() {
  const {userType, setUserType, setData, setUsers, setAffectedData} = useContext(UserContext)

  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { address, connector } = useAccount()
  const { disconnect } = useDisconnect()
  const { chain } = useNetwork()
  const { signMessageAsync } = useSignMessage()

  let addressParsed = ""
  if (address)
   addressParsed =  address.toString().substring(0,7) + address.toString().substring(2,7) + "..." + address.toString().substring(address.toString().length - 4,address.toString().length)

  useEffect(() => {
    const handleConnectorUpdate = ({account, chain}) => {
        if (account) {
          setUserType(0)
        } else if (chain) {
          console.log('new chain', chain)
        }
      }
      
      if (connector) {
        connector.on('change', handleConnectorUpdate)
      }
    
    return () => connector?.off('change', handleConnectorUpdate)
    }, [connector, setUserType])

  const signIn = async () => {
    try {
      setLoading(true)
      setError("")
      const chainId = chain?.id
      if (!address && !chainId) return
 
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Melden Sie sich bei der Anwendung an, um Einträge zu erstellen oder anzuzeigen.',
        uri: window.location.origin,
        version: '1',
        chainId,
      })

      const sig = await signMessageAsync({
        message: message.prepareMessage(),
      })

      const jsonFile = {
        address: address,
        message: message,
        signature: sig,
      }

      const responseData = await httpPostRequest('http://localhost:8000/api', jsonFile)

      setData(responseData.jsonData)

    if (responseData && responseData.message){
      if (responseData.message == "Address is a data processor"){
        setUsers(responseData.users)
        setUserType(2)
      }
      if (responseData.message == "Address is a regular user")
        setUserType(1)
        setAffectedData(responseData.affectedData)
      }
    else
      setError(responseData)
    }
    catch(error){ 
      console.log("error is", error)
      setError(error.message) 
    }
    setLoading(false)
  }

  const handleDisconnect = () =>{
    disconnect()
    setUserType(0)
    setError("")
  }

  return (
    <>
    <HeaderContainer>
      {
        !address 
        ? 
        <div onClick={()=>{
          setShow(true)
        }}>
          <Button 
            type="primary"
            >Verbinde Wallet
          </Button>
        </div>
        :
        <SignInContainer>
          <div className='body'>
            <div className='wrap'>
              <User/>
              <p>{addressParsed}</p>
            </div>
            <div onClick={()=>handleDisconnect()}>
              <Button >
                Abmelden
              </Button>
            </div>
          </div>
          {!userType && <div className='sign-in' onClick={()=>signIn()}>
            {!loading ? 
            <Button type="primary">Signatur</Button> 
            : 
            <Button>
              <CircularProgress height={"14px"} />
            </Button>}
            <p>{error && error}</p>
          </div>}
        </SignInContainer>
      }
    </HeaderContainer>
    <WalletModal
      show={show}
      setShow={setShow}
    />
    </>
  )
}

export default Header

const HeaderContainer = styled.div`
  max-width: 1536px;
  margin:0 auto;
  display:flex;
  justify-content:center;
  margin-top:20px;
`

const SignInContainer = styled.div`
  width:min(90%,400px);
  .body{
    align-items:center;
    gap:40px;
    display:flex;
    justify-content:space-between;
    margin-bottom:12px;

    
  }
  .wrap{
      display:flex;
      gap:8px;
      align-items:center;
  }

  .sign-in{
    >p{
      margin-top:12px;
      color:red;
    }
  }
  
`

const User = styled(UserCircle)`
  height:40px;
  width:40px;
  color:${primaryColor};
  
`