import styled from "styled-components"
import { useContext, useState } from "react";
import { UserContext } from "../utils/context";
import TableComponent from "../components/TableComponent";
import DetailsComponent from "../components/DetailsComponent";

function UserDashboard() {
    const { data, affectedData } = useContext(UserContext)
    const [show, setShow] = useState(false)
    const [view, setView] = useState()
    const [processes, setProcesses] = useState([])

    const handleShow = (index) =>{
        setShow(true)
        setView(data[index])
        setProcesses(affectedData[index])
    }

    if (!data) return null

    return (
    <>
        <Container>
            {
                data ?
                    !show ? 
                    <TableComponent data={data} handleShow={handleShow} />
                    : 
                    <>
                    <DetailsComponent data={view} processes={processes} setShow={setShow}/>
                    </>
                :
                <div className="new">
                    <p>Sie sind von keinem Datenbearbeitungsprojekt betroffen</p>
                </div>
            }
            
        </Container>

    </>
    )
}

export default UserDashboard

const Container = styled.div`
    max-width:800px;
    margin:0 auto;
    .new{
        padding-left:10px;
        margin-top:20px;
        display:flex;
        font-size:18px;
    }
`
