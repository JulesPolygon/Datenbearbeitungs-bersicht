import { useState } from 'react'
import styled from 'styled-components'
import ViewFormComponent from './ViewFormComponent'
import Button from './Button'
import ListComponent from './ListComponent'
import { areArraysFull, isArrayEmpty } from '../utils/utils'

export default function DetailsComponent({data, processes,setShow}) {

    const [showForm, setShowForm] = useState(false)

    const handleShow = () =>{
        setShowForm(true)
    }

    return (
        <>
            {!showForm && <Container>
                <h3>{data.nameProjekt} </h3>
                <FlexContainer>
                    <div className='wrap'>
                        <p className='first'>
                            Informationsrecht
                        </p>
                        <InformationContainer>
                            <div style={{paddingTop:"4px"}} onClick={()=>handleShow()}>
                                <Button type={"primary"}>Angaben Informationsrecht</Button>
                            </div>
                            {data && data.identifizierungBetroffenheit === "true" ?
                            <p>Betroffenheit konnte nicht in verhältnismässiger Weise identifiziert werden</p>
                            :
                            <p>Betroffenheit konnte  in verhältnismässiger Weise identifiziert werden</p>}
                        </InformationContainer>
                    </div>
                    <div className='wrap'>
                        <p className='first'>
                            Prozesse in denen ihre personenbezogenen Daten aktiv bearbeitet werden
                        </p>
                        <WrapContainer>

                        {Array.isArray(processes.started) &&  processes.started.length > 0 && !areArraysFull(processes.started, processes.ended) ? processes.started.map((processData,index)=>{
                            if (processData && processes.ended[index])
                                return
                            if (processData)
                            return(
                            <ListComponent 
                            list-data-0
                            key={`list-data-${index}`}
                            process={data.prozessePersonendaten[index]}
                            started={processData}
                            />
                            )})
                        :
                            <p>Keine aktiven Prozesse</p>
                        }
                        </WrapContainer>

                    </div>
                    <div className='wrap'>
                        <p className='first'>
                            Prozesse in denen ihre personenbezogenen Daten nicht aktiv bearbeitet werden
                        </p>
                        <WrapContainer>
                        {Array.isArray(processes.ended) && processes.ended.length && !isArrayEmpty(processes.ended) > 0 ? processes.ended.map((processData,index)=>{
                            if (!processData)
                                return
                            if (processData)
                            return(
                            <ListComponent 
                            key={`list-data-${index}`}
                            process={data.prozessePersonendaten[index]}
                            started={processes.ended[index]}
                            ended={processData}
                            />
                            )})
                        
                        :
                            <p>Keine inaktiven Prozesse</p>
                        }
                        </WrapContainer>
                    </div>
                </FlexContainer>

                <ButtonContainer onClick={()=>setShow(false)}>
                    <Button type={"primary"}>Zurück</Button>
                </ButtonContainer>
            </Container>}
            {showForm && <ViewFormComponent setShow={setShowForm} data={data}/>}
        </>
        
    )
}



const Container = styled.div`
    max-width:800px;
    margin:0 auto;
    margin-top:40px;
    display: flex;
    flex-direction: column;

    >h3{
        margin-bottom:30px;
    }
`

const ButtonContainer = styled.div`
    display:flex;
    justify-content:center;
    margin:0 auto; 
    margin-top:20px;  
    width:200px; 
`

const FlexContainer = styled.div`
    display:flex;
    flex-direction:column;
    

    .wrap{
        display:flex;
        border:1px solid black;
        border-bottom-width:0;
    }

    .first{
        padding:8px;
        background-color:#7cb0ff;
        width: 280px;
    }
    :last-child{
        border-bottom-width:1px;
    }

    .details{
        display:flex;
        justify-content:center;
        align-items:center;
    }
`

const InformationContainer = styled.div`
    display:flex;
    max-width:450px;
    justify-content:start;
    flex-direction:column;
    align-items:start;
    margin:0 auto;

    >p{
        margin-top:12px;
    }
`

const WrapContainer = styled.div`
    display:flex;
    max-width:450px;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    margin:0 auto;

`