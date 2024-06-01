import styled from "styled-components"
import Button from "../components/Button"
import { Close, ModalContainer, ModalTop } from "../modals/WalletModal"
import { useContext, useState } from "react"
import { UserContext } from "../utils/context"
import AddressSelector from "../components/AddressSelector"

function InputModal({show, setShow, colIndex, array, insertArray}) {

  const {users} = useContext(UserContext)

  const [selectedItems, setSelectedItems] = useState(array ? array : []);

  if (!show) return null

  const handleClose = () =>{
    setSelectedItems(array)
    setShow(colIndex, false)
  }

  const handleSave = () =>{
    insertArray(colIndex, selectedItems)
    setShow(colIndex,false)
  }

  console.log(selectedItems)

  const handleClick = (index)=>{
    if (selectedItems.includes(index)) 
        setSelectedItems(selectedItems.filter((item) => item !== index));
    else
        setSelectedItems([...selectedItems, index]);
  }

  return (

    <ModalContainer>
        <ModalArea>
            <div className='end'>
                <Close onClick={()=> handleClose(colIndex,false)}></Close>
            </div>
            <ModalTop>
                <p>Wählen Sie Adressen aus der Liste aus, um sie hinzuzufügen oder zu deaktivieren</p>
            </ModalTop>
            <ModalBody>
                {
                    users.map((data,index)=>{
                        return(
                        <div 
                        onClick={()=>handleClick(index)}
                        key={`grid-${data}-${index}-${array && array.length}`} >
                            <AddressSelector 
                                initial = {selectedItems && selectedItems.includes(index) ? true : false}
                                address={data}
                            />
                        </div>
                    )})
                }
            </ModalBody>

            <ModalBottom>
                <div style={{marginLeft:'20px', marginRight:'20px', marginBottom:'6px'}}>
                    <div  onClick={()=>handleSave()}>
                        <Button type="primary" >
                            Speichern
                        </Button>
                    </div>
                </div>
            </ModalBottom>
        </ModalArea>
    </ModalContainer>


  )
}

export default InputModal

const ModalArea = styled.div`
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  width:min(90%, 800px);
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

const ModalBody = styled.div`
  margin:20px 20px;
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  justify-content:center;
  box-sizing: border-box;

  overflow-y:auto;
`

const ModalBottom = styled.div`
    
`