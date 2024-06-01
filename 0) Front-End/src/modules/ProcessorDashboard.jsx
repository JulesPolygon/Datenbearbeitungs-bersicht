import styled from "styled-components"
import Button from "../components/Button"
import FormComponent from "../components/FormComponent"
import { useState } from "react"
import SuccessScreen from "../components/SuccessScreen"
import EntriesComponent from "../components/EntriesComponent"

function ProcessorDashboard() {

  const [showForm, setShowForm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showEntries, setShowEntries] = useState(false)

  const handleShowForm = () =>{
    setShowForm(true)
    setShowEntries(false)
  }

  const handleShowEntries = () =>{
    setShowEntries(true)
    setShowForm(false)
  }

  return (
    <ProcessorContainer>
        <EntryContainer>
            <div className="item"  onClick={()=>handleShowForm()}>
                <Button type={"primary"}>Neues Projekt erstellen</Button>
            </div>
            <div className="item" onClick={()=>handleShowEntries()}>
                <Button>Projekt verwalten</Button>
            </div>
        </EntryContainer>
        {showForm && <FormComponent setShowSuccess={setShowSuccess} setShowForm={setShowForm}/>}

        {showEntries && <EntriesComponent setShowSuccess={setShowSuccess} setShowEntries={setShowEntries}/>}

        {showSuccess &&  <SuccessScreen setShow={setShowSuccess}/>}
    </ProcessorContainer>
  )
}

export default ProcessorDashboard

const ProcessorContainer = styled.div`
    max-width:800px;
    margin:0 auto;
`

const EntryContainer = styled.div`
    display:flex;
    margin-top:30px;
    justify-content:center;
    gap:20px;
    
`