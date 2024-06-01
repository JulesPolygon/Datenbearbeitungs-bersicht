import styled from "styled-components"
import Button from "../components/Button"
import { UserContext } from "../utils/context"
import { useContext } from "react"

function TableComponent({data, handleShow}) {

    const {userType, data:userData} = useContext(UserContext)

    if (!data)
        return null

    const timestampToDate = (timestamp) =>{
        try{
        const date = new Date(parseInt(timestamp) * 1000);
            
        const formattedDate = date.toISOString().split('T')[0];
    
        return formattedDate

        }
        catch(err){
            return 
        }

    }

    function convertDate(dateString) {
        var date = new Date(dateString);
        return date.getDate()+"."+(date.getMonth() + 1)+"."+date.getFullYear();
    }

    const parseEntry = (entry) => {
        const [index, timestamp] = entry.split('-');

        const formattedDate = timestampToDate(timestamp)
        
        return {timestamp, formattedDate };
    };      

    return (
    <>
    <Container>
        <Table>
            <TableHead>
                <TableRow>
                    <TableHeaderCell>Name</TableHeaderCell>
                    <TableHeaderCell>Beginn Projekt</TableHeaderCell>
                    <TableHeaderCell>Ende Projekt</TableHeaderCell>
                    <TableHeaderCell>Erstellungsdatum</TableHeaderCell>
                    <TableHeaderCell>Eintrag</TableHeaderCell>
                </TableRow>
            </TableHead>
            <tbody>
                {data.map((entry, index) => {
                        const result = parseEntry(entry.id)
                        const issuedDate = timestampToDate(result.timestamp)

                    
                return(
                <TableRow key={`table+${index}`}>
                    <TableCell>{entry.nameProjekt}</TableCell>
                    <TableCell>{convertDate(entry.beginnProjekt)}</TableCell>
                    <TableCell>{convertDate(entry.endeProjekt)}</TableCell>
                    <TableCell>{convertDate(issuedDate)}</TableCell>
                    <TableCell>
                        <div onClick={() => handleShow(index)}>
                            <Button type={"primary"} >{userType === 2 ? "Eintrag ändern" : "Lesen"}</Button>
                        </div>
                    </TableCell>
                </TableRow>
                )})}
            </tbody>
        </Table>
    </Container>

    </>
    )
}

export default TableComponent

const Container = styled.div`
    max-width:800px;
    margin:0 auto;
    margin-top:40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

const TableHead = styled.thead`
    background-color: #f2f2f2;
`;

const TableHeaderCell = styled.th`
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
`;

const TableRow = styled.tr`
    &:nth-child(even) {
        background-color: #f9f9f9;
    }
`;

const TableCell = styled.td`
    padding: 5px;
    border-bottom: 1px solid #ddd;
`;
