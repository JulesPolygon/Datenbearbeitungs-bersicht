import { FormProvider, useForm  } from "react-hook-form"
import RegularInput from "./inputs/RegularInput"
import styled from "styled-components"
import Button from "./Button"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../utils/context"
import JsonChecker from "./JsonChecker"


function ViewFormComponent({setShow, data}) {
    let didInit = false;

    const {users} = useContext(UserContext)

    useEffect(() => {
        if (!didInit) {
          didInit = true;
          loadFormData();
        }
      }, []);

    const [page, setPage] = useState(1)
    const [id, setId] = useState(null)
    const [showJsonChecker, setShowJsonChecker] = useState(false)

    const methods = useForm()

    const loadFormData = () =>{
        Object.keys(data).forEach((key) => {
            if (key!= "id" && key!=="timestamp")
                methods.setValue(key, data[key]);
            
            if (key == "id"){
                const [index, timestamp] = data[key].split('-');
                setId(index)
            }
          });
    }

    const onSubmit = (data) => {
        if (Array.isArray(methods.formState.errors) && methods.formState.errors.length > 1)
            return
    }


    const handleNext = async ()=> {
        if (page<=1){
            setPage(page+1)
        }
        else {
            setShowJsonChecker(true)
        }
    }

    const handleBack = () =>{
        if (page>1){
            setPage(page-1)
        }
        else{
            setShow(false)
        }
    }

    return (
    <Container>
        <>
        {!showJsonChecker && <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>

                {page === 1 && 
                <div>
                    <HeadContainer>
                        <p className="first">Details zum Projekt</p>
                        <p className="second">Antworten</p>
                    </HeadContainer>
                    <RegularInput 
                        disabled
                        classRegister={"verantwortlicher"} 
                        label={"Identität und Kontaktdaten des Verantwortlichen"}
                        controller={true}
                        edited={"true"}
                        placeholder={"-"}/>
                    <RegularInput 
                        disabled
                        classRegister={"bearbeitungsZweck"} 
                        placeholder="-"
                        edited={"true"}
                        label={"Bearbeitungszweck"}/>
                    <RegularInput 
                        disabled
                        classRegister={"empfänger"} 
                        placeholder="-"
                        edited={"true"}
                        label={"Empfänger und Empfängerinnen oder die Kategorien von Empfängerinnen und Empfängern"}/>
                    <RegularInput 
                        disabled
                        classRegister={"offenlegungAusland"} 
                        placeholder="-"
                        edited={"true"}
                        label={"Offenlegung von Daten im Ausland? \n  \n Wenn ja, Staat / internationals Organ"}/>
                    <RegularInput 
                        disabled
                        classRegister={"offenlegungUnzureichend"} 
                        label={"Offenlegung in Land mit unzureichendem Datenschutz: \n Garantien gemäss Art. 16 Abs. 2 oder Ausnahme gemäss Art. 17"}
                        placeholder={`-`}
                        edited={"true"}
                        bottomBorder = {"true"}/>
                </div>
                }

            {page === 2 && 
                <div>
                    <HeadContainer>
                        <p className="first">Details zum Projekt</p>
                        <p className="second">Antworten</p>
                    </HeadContainer>

                    <RegularInput 
                        disabled
                        classRegister={"kategoriePersDaten"} 
                        label={"Kategorie(n) von bearbeiteten personenbezogenen Daten (fakultativ bei direkter Beschaffung)"}
                        placeholder={`-`}
                        edited={"true"}/>
                    <RegularInput 
                        disabled
                        classRegister={"automEinzelEntscheid"} 
                        label={"Automatisierte Einzelentscheidung gemäss Art. 21: Welche Entscheide wurden automatisiert getroffen?"}
                        placeholder={`-`}
                        edited={"true"}/>
                    <RegularInput 
                        disabled
                        classRegister={"automEinzelEntscheidRechte"} 
                        label={"Automatisierte Einzelentscheidung gemäss Art. 21: Wie können Rechte geltend gemacht werden?"}
                        placeholder={`-`}
                        edited={"true"}/>
                    <RegularInput 
                        disabled
                        classRegister={"weitereAngaben"} 
                        placeholder="-"
                        edited={"true"}
                        label={"Weitere Angaben zur Bearbeitung (über Mindestangaben herausgehende)"}
                        bottomBorder={"true"}/>
                </div>
            }
                
            </form>
            <ButtonContainer>
                <div onClick={()=>handleBack()}>
                    <Button type={'primary'}>Zurück</Button>
                </div>
                <div>
                    <p>Seite {page}/2</p>
                </div>
                <div onClick={methods.handleSubmit(handleNext)} type="submit">
                    {page !== 2 && <Button type={'primary'}>Weiter</Button>}
                    {page === 2 && <Button>Datenintegrität prüfen</Button>}
                </div>
            </ButtonContainer>
        </FormProvider>}
        </>
        {showJsonChecker && <JsonChecker index={id} name={data.nameProjekt} setShow = {setShowJsonChecker}/>}
    </Container>
)
}

export default ViewFormComponent

const Container = styled.div`
    margin:0 10px;
    margin-top:50px;
`

const HeadContainer = styled.div`
    display:flex;
    >p{
        font-weight:bold;
    }
    .second{
        width:100%;
        padding:6px;
    }
    .first{
        width:310px;
        padding:6px;
    }
    border:1px solid black;
    border-bottom:0px;
    background-color:#5396fc;

`

const ButtonContainer = styled.div`
    margin-top:20px;
    display:flex;
    justify-content:space-between;
    align-items:center;
`
    
