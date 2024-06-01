import styled from 'styled-components'
import { timestampToDate } from '../utils/utils'


function ListComponent({process, started, ended}) {
  return (
    <Container>
        <li>{process}</li>
        <div className='process'>
            {started && <p>Hinzugefügt am: {timestampToDate(parseInt(started)*1000)}</p>}
            {ended && <p>Deaktivierung am: {timestampToDate(parseInt(ended)*1000)}</p>}
        </div>
    </Container>
  )
}

export default ListComponent

const Container = styled.div`
    display:flex;
    align-items:center;
    justify-content:space-between;
    width:480px;
    >li{
        padding-left:20px;
    }

    .process{
        width:140px;
        display:flex;
        flex-direction:column;
        >p{
            font-size:10px;
        }
    }

`