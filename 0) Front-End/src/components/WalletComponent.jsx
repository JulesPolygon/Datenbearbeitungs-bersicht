import styled from 'styled-components'
import {useConnect, useAccount} from 'wagmi'
import { CircularProgress } from './CircularProgress';
import { primaryColor } from '../constants';
import Metamask from '../img/metamask_front.svg'


const WalletComponent= ({setShow, setError})=> {

    const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
    const { address, isConnected } = useAccount()

    error && error.message & setError(error.message)

    if (isConnected || address) setShow(false)

    const connectEth = async () =>{
        const test = connectors[0]
        connect({connector:test}) 
    }

    return (
        <WalletComponentContainer onClick={()=>connectEth()}>
            <img src={Metamask} alt="wallet"></img>
            {isLoading || pendingConnector?.id ? <CircularProgress/> : <p>Metamask</p>}
        </WalletComponentContainer>
    )
}

export default WalletComponent

const screen = {
    desktop: '@media(max-width: 770px)',
    mobile: '@media(max-width: 500px)',
  }


const WalletComponentContainer = styled.div`
    display:flex;
    justify-content:space-between;
    font-size:14px;
    align-items:center;
    margin:8px 16px;
    height:50px;
    width:auto;
    padding:8px;
    border:1px solid ${primaryColor};
    border-radius:8px;
    
    >img{
        padding:0 10px;
        height:40px;
        width:40px;
        ${screen.mobile}{
            scale:0.7;
        }
    }
    >p{
        padding:0 10px;
        font-size:14px;
        font-weight:bold;
        text-transform:uppercase;
        ${screen.mobile}{
            font-size:12px;
        }

    }
    &:hover{
        opacity:0.8;
        cursor:pointer;
        >p{
            opacity:0.8;
        }
    }

    `;
