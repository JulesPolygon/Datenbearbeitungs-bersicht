import { FormProvider, useForm  } from "react-hook-form"
import RegularInput from "./inputs/RegularInput"
import { yupResolver } from '@hookform/resolvers/yup'
import { formSchema } from "../utils/formSchema"
import styled from "styled-components"
import Button from "./Button"
import { useState } from "react"
import { CONTRACT_ADDRESS } from "../constants"
import { ethers } from 'ethers';
import { writeContract, waitForTransaction  } from '@wagmi/core'
import SmartContract from '../abis/Proof.json'
import MultipleList from "./inputs/MultipleList"
import { httpPostRequest, sortKeysAlphabetically } from "../utils/utils"
import { CircularProgress } from "./CircularProgress"
import BooleanInput from "./inputs/BooleanInput"


function FormComponent({setShowSuccess, setShowForm}) {

    const [page, setPage] = useState(1)
    const [numbers, setNumbers] = useState([1])
    const [loading, setLoading] = useState(false)
    const [displayError, setDisplayError] = useState(false)
    const [twoDArray, setTwoDArray] = useState(Array(0));

    const currentFormSchema = formSchema[page-1]

    const methods = useForm(({
        resolver: yupResolver(currentFormSchema),
      }))

    methods.formState.errors && console.log(methods.formState.errors)

    const handleNext = async (data)=> {
        try{
            const isStepValid = await methods.trigger()

            if (page === 1){
                const beginDate = new Date(data?.beginnProjekt);
                const endDate = new Date(data?.endeProjekt);
                if (beginDate > endDate){
                    methods.setError('endeProjekt',{message:'Incorrect date'})
                    return
                }
            }

            if (isStepValid){
                if (page<=3){
                    setPage(page+1)
                }
                else {
                    setLoading(true)

                    const sortedData = sortKeysAlphabetically(data)

                    if (sortedData.idProProzess.length < sortedData.prozessePersonendaten.length){
                        for (let i=0; i<sortedData.prozessePersonendaten.length - sortedData.idProProzess.length; i++)
                            sortedData.prozessePersonendaten.pop()
                    }

                    const jsonString = JSON.stringify(sortedData);

                    const hash = ethers.keccak256(ethers.toUtf8Bytes(jsonString))
                    
                    const { hash: txHash } = await writeContract({
                        address: CONTRACT_ADDRESS,
                        abi: SmartContract,
                        functionName:'addHash',
                        args:[hash]
                    })

                    const waitTx = await waitForTransaction({
                        hash: txHash,
                    })

                    const jsonFile = {
                        json: sortedData
                    }

                    const req = await httpPostRequest('http://localhost:8000/create', jsonFile)

                    if (!req) {
                        throw new Error('Etwas ist schief gelaufen');
                    }

                    setLoading(false)
                    setShowForm(false)
                    setShowSuccess(true)
                }
            }
        }
        catch(err){
            setLoading(false)
            setDisplayError(true)
            setTimeout(() => {
                setDisplayError(false);
            }, 3000);
        }
    }

    const handleBack = (data) =>{
        if (page>1){
            setPage(page-1)
        }
    }
    
    return (

    <Container>
        <>
        <FormProvider {...methods}>
            <form>
                {page === 1 && 
                <div className="text">
                    <p>
                        {"Durch die Angabe der folgenden Informationen kann der Informationspflicht nachgekommen und diese zusätzlich individualisiert werden. Wenn keine Informationspflicht (gemäss Art. 20 des revDSG) besteht, können Sie den Vorgang abbrechen. Bitte beachten Sie, dass sich die Angaben auf ein Projekt beziehen, das sich im Standardfall aus mehreren Bearbeitungen zusammensetzt. Eine treffende Bezeichnung des Projekts erleichtert die Verwaltung der aktiv ausgeführten Prozesse innerhalb des Projekts."}
                    </p>
                    <PageContainer>
                        <RegularInput 
                            classRegister={"nameProjekt"} 
                            label={"Name des Projekts"}
                            placeholder="Geben Sie den Namen des Projekts ein"/>
                        <RegularInput 
                            classRegister={"beginnProjekt"} 
                            label={"Geplanter Beginn des Projekts"} 
                            type="date"/>
                        <RegularInput 
                            classRegister={"endeProjekt"} 
                            label={"Geplantes Ende des Projekts"} 
                            type="date"
                            bottomBorder={true}/>
                    </PageContainer>
                </div>}

                {page === 2 && 
                <div>
                    <HeadContainer>
                        <p className="first">Details zum Projekt</p>
                        <p className="second">Antworten</p>
                    </HeadContainer>
                    <RegularInput 
                        classRegister={"verantwortlicher"} 
                        label={"Identität und Kontaktdaten des Verantwortlichen"}
                        controller={true}
                        placeholder="Ihre Angaben"/>
                    <RegularInput 
                        classRegister={"bearbeitungsZweck"} 
                        placeholder="Ihre Angaben"
                        label={"Bearbeitungszweck"}/>
                    <RegularInput 
                        classRegister={"empfänger"} 
                        placeholder="Ihre Angaben"
                        label={"Empfänger und Empfängerinnen oder die Kategorien von Empfängerinnen und Empfängern"}/>
                    <RegularInput 
                        classRegister={"offenlegungAusland"} 
                        placeholder="Ihre Angaben"
                        label={"Offenlegung von Daten im Ausland? \n  \n Wenn ja, Staat / internationals Organ"}/>
                    <RegularInput 
                        classRegister={"offenlegungUnzureichend"} 
                        label={"Offenlegung in Land mit unzureichendem Datenschutz: \n Garantien gemäss Art. 16 Abs. 2 oder Ausnahme gemäss Art. 17"}
                        placeholder={"Ihre Angaben"}
                        bottomBorder = {"true"}/>
                </div>
                }

            {page === 3 && 
                <div>
                    <HeadContainer>
                        <p className="first">Details zum Projekt</p>
                        <p className="second">Antworten</p>
                    </HeadContainer>

                    <RegularInput 
                        classRegister={"kategoriePersDaten"} 
                        placeholder="Ihre Angaben"
                        label={"Kategorie(n) von bearbeiteten personenbezogenen Daten (fakultativ bei direkter Beschaffung)"}/>
                    <RegularInput 
                        classRegister={"automEinzelEntscheid"} 
                        placeholder="Ihre Angaben"
                        label={"Automatisierte Einzelentscheidung gemäss Art. 21: Welche Entscheide wurden automatisiert getroffen?"}/>
                    <RegularInput 
                        classRegister={"automEinzelEntscheidRechte"} 
                        placeholder="Ihre Angaben"
                        label={"Automatisierte Einzelentscheidung gemäss Art. 21: Wie können Rechte geltend gemacht werden?"}/>    
                    <RegularInput 
                        classRegister={"weitereAngaben"} 
                        placeholder="Ihre Angaben"
                        label={"Weitere Angaben zur Bearbeitung (über Mindestangaben herausgehende)"}
                        bottomBorder = {"true"}/>
                </div>
            }
            {page === 4 && 
                <div>
                    <MultipleList 
                        classRegister={"prozessePersonendaten"} 
                        label={"In welchen Prozessen werden personenbezogene Daten bearbeitet (in Bezug auf das Projekt)?"}
                        numbers={numbers}
                        setNumbers={setNumbers}
                        twoDArray={twoDArray}
                        setTwoDArray={setTwoDArray}
                        />
                    <MultipleList 
                        classRegister={"idProProzess"} 
                        label={"Betroffene Adressen pro angegebener Prozess"}
                        numbers={numbers}
                        setNumbers={setNumbers}
                        selectionAddress = {true}
                        twoDArray={twoDArray}
                        setTwoDArray={setTwoDArray}/>
                    <BooleanInput
                        classRegister={"identifizierungBetroffenheit"} 
                        label={"Betroffenheit kann nicht oder nicht in verhältnismässiger Weise identifiziert werden"}/>
                </div>
                }

            </form>
            <ButtonContainer>
                <div onClick={methods.handleSubmit(handleBack)}>
                    <Button type={'primary'} disabled={page === 1 ? true : false}>Zurück</Button>
                </div>
                <div>
                    <p>Seite {page}/4</p>
                </div>
                {!loading ? <div onClick={methods.handleSubmit(handleNext)} type="submit">
                    <Button type={'primary'}>{page === 4 ? "Senden" : "Weiter"}</Button>
                </div>
                :
                <div>
                    <Button>
                        <CircularProgress height={"14px"} />
                    </Button>
                </div>
                }
            </ButtonContainer>
            {displayError && <ErrorContainer>
                <p>Da ist etwas schief gelaufen</p>
            </ErrorContainer>}
        </FormProvider>
        </>
    </Container>
)
}

export default FormComponent

const Container = styled.div`
    margin:0 10px;
    margin-top:50px;

    .text{
        >p{
            padding:4px;
            padding-bottom:30px;
        }
    }
`

const PageContainer = styled.div`
    display:flex;
    flex-direction:column;
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

const ErrorContainer = styled.div`
    >p{
        text-align:right;
        color:red;
    }
`