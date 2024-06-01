import { FormProvider, useForm  } from "react-hook-form"
import RegularInput from "./inputs/RegularInput"
import { yupResolver } from '@hookform/resolvers/yup'
import { formSchema } from "../utils/formSchema"
import styled from "styled-components"
import Button from "./Button"
import { useContext, useEffect, useState } from "react"
import { CONTRACT_ADDRESS } from "../constants"
import { ethers } from 'ethers';
import { writeContract, waitForTransaction  } from '@wagmi/core'
import SmartContract from '../abis/Proof.json'
import MultipleList from "./inputs/MultipleList"
import { convertStringToArray, httpPostRequest, sortKeysAlphabetically } from "../utils/utils"
import { CircularProgress } from "./CircularProgress"
import BooleanInput from "./inputs/BooleanInput"
import { UserContext } from "../utils/context"


function EditFormComponent({setShowSuccess, setShowForm, setShow, data, selected}) {
    let didInit = false;

    const {users, data:contextData, setData:setContextData} = useContext(UserContext)

    useEffect(() => {
        if (!didInit) {
          didInit = true;
          loadFormData()
          let initialHash = calculateBaseHash(data)
          setInitialHash(initialHash)

        }
      }, []);

    const [page, setPage] = useState(1)
    const [displayError, setDisplayError] = useState(false)
    const [id, setId] = useState(null)
    const [numbers, setNumbers] = useState([1])
    const [loading, setLoading] = useState(false)
    const [initialHash, setInitialHash] = useState([])
    const [twoDArray, setTwoDArray] = useState(Array(0));


    const currentFormSchema = formSchema[page-1]

    const methods = useForm(({
        resolver: yupResolver(currentFormSchema),
      }))


    const calculateBaseHash = (data) =>{
        let jsonData = {...data}
        delete jsonData["idProProzess"]
        delete jsonData["prozessePersonendaten"]
        delete jsonData["timestamp"]
        delete jsonData["id"]
        let sortedData = sortKeysAlphabetically(jsonData)
        const jsonString = JSON.stringify(sortedData);
        const hash = ethers.keccak256(ethers.toUtf8Bytes(jsonString))
        return hash
    }

    const loadFormData = () =>{
        Object.keys(data).forEach((key) => {
            if (key!== "id" && key!=="timestamp")
                methods.setValue(key, data[key]);
            if (key === "idProProzess"){
                const newArray = data[key].map((str)=>{
                    return convertStringToArray(str).map((newString)=>{
                        return users.indexOf(newString)
                    })
                })
                
                setTwoDArray(newArray)
                let num =[]
                newArray.map((data,index)=>(
                    num.push(index+1)  
                ))
                setNumbers(num)
            }
            if (key === "id"){
                const [index, ] = data[key].split('-');
                setId(index)
            }
          });
    }

    const handleNext = async (data)=> {
        try {
        const isStepValid = await methods.trigger()

        if (isStepValid){
            if (page<=2){
                setPage(page+1)
            }
            else {
                setLoading(true)
                const sortedData = sortKeysAlphabetically(data)
                const jsonString = JSON.stringify(sortedData);

                const hash = ethers.keccak256(ethers.toUtf8Bytes(jsonString))
                
                const { hash:txHash } = await writeContract({
                    address:CONTRACT_ADDRESS,
                    abi: SmartContract,
                    functionName:'appendHash',
                    args:[id, hash]              
                })

            
                const waitTx = await waitForTransaction({
                    hash: txHash,
                })

                let newHash = calculateBaseHash(data)

                const jsonFile = {
                    json: sortedData,
                    index: id,
                    refresh: newHash == initialHash ? false : true
                }

                const responseData = await httpPostRequest('http://localhost:8000/update', jsonFile)

                if (!responseData) {
                    throw new Error('Etwas ist schief gelaufen');
                }

                let jsonData = {
                    ...sortedData, 
                    id: responseData.id, 
                    nameProjekt: contextData[selected].nameProjekt, 
                    beginnProjekt: contextData[selected].beginnProjekt,
                    endeProjekt: contextData[selected].endeProjekt
                }
                let modifiedData = [...contextData]
                modifiedData[selected]= jsonData

                setContextData(modifiedData)
                setLoading(false)
                setShowForm(false)
                setShowSuccess(true)

            }
        }
        }
        catch(err){
            console.log(err)
            setLoading(false)
            setDisplayError(true)
            setTimeout(() => {
                setDisplayError(false);
            }, 3000);
        }

    }

    const handleBack = () =>{
        if (page>2){
            setPage(page-1)
        }
        else{
            setShow(false)
        }
    }

    return (

    <Container>
        <>
        <FormProvider {...methods}>
            <form>

                {page === 1 && 
                <div>
                    <HeadContainer>
                        <p className="first">Details zum Projekt</p>
                        <p className="second">Antworten</p>
                    </HeadContainer>
                    <RegularInput 
                        classRegister={"verantwortlicher"} 
                        label={"Identität und Kontaktdaten des Verantwortlichen"}
                        controller={true}
                        edited={true}
                        placeholder={`Thomas Hersperger\nSchlossbergstrasse 158000 Zürich\nthomas.hersperger@outlook.com`}/>
                    <RegularInput 
                        classRegister={"bearbeitungsZweck"} 
                        placeholder="Ihre Angaben"
                        edited={true}
                        label={"Bearbeitungszweck"}/>
                    <RegularInput 
                        classRegister={"empfänger"} 
                        placeholder="Ihre Angaben"
                        edited={true}
                        label={"Empfänger und Empfängerinnen oder die Kategorien von Empfängerinnen und Empfängern"}/>
                    <RegularInput 
                        classRegister={"offenlegungAusland"} 
                        placeholder="Ihre Angaben"
                        edited={true}
                        label={"Offenlegung von Daten im Ausland? \n  \n Wenn ja, Staat / internationals Organ"}/>
                    <RegularInput 
                        classRegister={"offenlegungUnzureichend"} 
                        label={"Offenlegung in Land mit unzureichendem Datenschutz: \n Garantien gemäss Art. 16 Abs. 2 oder Ausnahme gemäss Art. 17"}
                        placeholder={`Ihre Angaben`}
                        edited={true}
                        bottomBorder = {true}/>
                </div>
                }

            {page === 2 && 
                <div>
                    <HeadContainer>
                        <p className="first">Details zum Projekt</p>
                        <p className="second">Antworten</p>
                    </HeadContainer>
                    <RegularInput 
                        classRegister={"kategoriePersDaten"} 
                        placeholder="Ihre Angaben"
                        edited={true}
                        label={"Kategorie(n) von bearbeiteten personenbezogenen Daten (fakultativ bei direkter Beschaffung)"}/>
                    <RegularInput 
                        classRegister={"automEinzelEntscheid"} 
                        placeholder="Ihre Angaben"
                        edited={true}
                        label={"Automatisierte Einzelentscheidung gemäss Art. 21: Welche Entscheide wurden automatisiert getroffen?"}/>
                    <RegularInput 
                        classRegister={"automEinzelEntscheidRechte"} 
                        placeholder="Ihre Angaben"
                        edited={true}
                        label={"Automatisierte Einzelentscheidung gemäss Art. 21: Wie können Rechte geltend gemacht werden?"}/>
                    <RegularInput 
                        classRegister={"weitereAngaben"} 
                        placeholder="Ihre Angaben"
                        edited={true}
                        label={"Weitere Angaben zur Bearbeitung (über Mindestangaben herausgehende)"}
                        bottomBorder = {true}/>
                </div>
            }
            {page === 3 && 
                <div>
                    <MultipleList 
                        classRegister={"prozessePersonendaten"} 
                        label={"In welchen Prozessen werden personenbezogene Daten bearbeitet (in Bezug auf das Projekt)?"}
                        numbers={numbers}
                        setNumbers={setNumbers}
                        twoDArray = {twoDArray}
                        setTwoDArray={setTwoDArray}
                        edited={true}/>
                    <MultipleList 
                        classRegister={"idProProzess"} 
                        label={"Betroffene Adressen pro angegebener Prozess"}
                        numbers={numbers}
                        setNumbers={setNumbers}
                        selectionAddress = {true}
                        twoDArray = {twoDArray}
                        setTwoDArray={setTwoDArray}
                        edited={true}/>
                    <BooleanInput
                        classRegister={"identifizierungBetroffenheit"} 
                        label={"Betroffenheit kann nicht oder nicht in verhältnismässiger Weise identifiziert werden"}/>
                </div>
            }
            </form>
            <ButtonContainer>
                <div onClick={()=>handleBack()}>
                    <Button type={'primary'}>Zurück</Button>
                </div>
                <div>
                    <p>Seite {page}/3</p>
                </div>
                {!loading ? <div onClick={methods.handleSubmit(handleNext)} type="submit">
                    <Button type={'primary'}>{page === 3 ? "Senden" : "Weiter"}</Button>
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
                <p>Da ist etwas schlief gelaufen</p>
            </ErrorContainer>}
        </FormProvider>
        </>
    </Container>
)
}

export default EditFormComponent

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

const ErrorContainer = styled.div`
    >p{
        text-align:right;
        color:red;
    }
`