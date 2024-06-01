import styled from "styled-components"
import { CheckmarkOutline } from "@styled-icons/evaicons-outline" 
import { useState } from "react"

function AddressSelector({address, initial}) {
    const [select, setSelect] = useState(initial)

    let addressParsed

    if (address) 
        addressParsed =  address.toString().substring(0,2)+(address.toString().substring(2,10) + "..." + address.toString().substring(address.toString().length - 8,address.toString().length)).toUpperCase()

  return (
    <Container onClick={()=>setSelect(!select)} style={select ? {backgroundColor: "lightblue"} : {backgroundColor:"white"}}>
        <p>{addressParsed}</p>
        {select && <Checkmark/>}
    </Container>
  )
}

export default AddressSelector

const Container = styled.div`
    display:flex;
    position:relative;
    padding:4px 8px;
    justify-content:center;
    align-items:center;
    border:1px solid black;
    font-size:14px;
    height:22px;
    &:hover{
        cursor:pointer;
    }
`

const Checkmark = styled(CheckmarkOutline)`
  position:absolute;
  right:0px;
  height:24px;
  width:24px;
  color:green;
`
