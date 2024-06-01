import {useState} from 'react'
import styled from 'styled-components';
import OutsideClickHandler from 'react-outside-click-handler'
import WalletComponent from '../components/WalletComponent';
import {CloseOutline} from '@styled-icons/evaicons-outline'
import { primaryColor } from '../constants';
 
function WalletModal({show, setShow}) {
  const [error, setError] = useState("")

  const handleClose = () =>{
    setShow(false)
    setError("")
  }
  
  if(!show) return null

  return (
    <ModalContainer>
        <OutsideClickHandler onOutsideClick={()=> handleClose()}>
            <ModalArea>
                <div className='end'>
                  <Close onClick={()=> handleClose()}></Close>
                </div>
                <ModalTop>
                    <h3>Verbinde Wallet</h3>
                    <p>Verbinden Sie das Wallet, um die Funktionalitäten zu nutzen</p>
                </ModalTop>

                <ModalMiddle>
                      <WalletComponent setShow={setShow} setError={setError}/>
               </ModalMiddle>
               {error}
               <ModalFooter/>
            </ModalArea>
        </OutsideClickHandler>
    </ModalContainer>
)
}


export default WalletModal


export const Close = styled(CloseOutline)`
  height:40px;
  width:40px;
  padding-top:20px;
  padding-right:20px;
  color:${primaryColor};
  &:hover{
    cursor:pointer;
    opacity:0.8;
  }
`

export const ModalContainer = styled.div`
    transition: transform 1s ease-out;
    position: fixed;    
    top:0;
    left:0;
    right:0;
    bottom:0;
    align-items:center;
    text-align:center;
    background-color: rgba(0,0,0,.7);
    z-index:1000;
`;

export const ModalArea = styled.div`
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  width:min(90%, 550px);
  background-color:white;
  border-radius:12px;
  border:2px solid black;
  display:flex;
  flex-direction:column;

  .end{
    display:flex;
    justify-content:end;
  }

`;

export const ModalTop = styled.div`
    display:flex;
    flex-direction:column;
    color:${primaryColor};
    justify-content:space-between;
    font-size:18px;
    margin:10px 0;
    font-weight:600;
    >.MuiSvgIcon-root{
    :hover{
        color:grey;
        cursor: pointer;
        text-decoration-line:underline;
    }
}
`;

const ModalMiddle = styled.div`
`;

const ModalFooter = styled.div`
    margin-bottom:10px;
    color:grey;
    >p{
    :hover{
        cursor:pointer;
        opacity:0.9;
        text-decoration-line:underline;
        }
    }    
    `;
