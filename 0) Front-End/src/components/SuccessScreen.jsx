import { CheckmarkCircle2Outline } from '@styled-icons/evaicons-outline'
import styled from 'styled-components'
import Button from './Button'

function SuccessScreen({setShow}) {
  return (
    <Container>
        <h3>Sie haben den Eintrag erfolgreich erstellt!</h3>
        <Checkmark></Checkmark>
        <div onClick={()=>setShow(false)}>
            <Button type="primary">OK</Button>
        </div>
    </Container>
  )
}

export default SuccessScreen

const Container = styled.div`
    margin-top:30px;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    gap:20px;
`

const Checkmark = styled(CheckmarkCircle2Outline)`
  height:50px;
  width:50px;
  color:green;
  &:hover{
    cursor:pointer;
    opacity:0.8;
  }
`