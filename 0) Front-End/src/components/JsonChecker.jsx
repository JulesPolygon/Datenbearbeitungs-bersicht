import { createRef, useState } from "react";
import styled from "styled-components";
import Button from "./Button";
import { sortKeysAlphabetically } from "../utils/utils";
import { ethers } from "ethers";
import { readContract  } from '@wagmi/core'
import { CONTRACT_ADDRESS } from "../constants";
import SmartContract from '../abis/Proof.json'

const JsonChecker = ({index, name, setShow}) => {

  const [isDragActive, setIsDragActive] = useState(false);
  const [fileSelected, setFileSelected] = useState("")
  const [jsonFile, setJsonFile] = useState()
  const [hash, setHash] = useState("")
  const [currentHash, setCurrentHash] = useState("")
  const [historyHash, setHistoryHash] = useState("")

  const [result, setResult] = useState(-1)
  
  const fileInputRef = createRef();

  const handleFileDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    readFile(file);
  };


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    readFile(file);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const readFile = (file) => {
    setFileSelected(file.name)
    setIsDragActive(false)
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        setJsonFile(jsonData)
       
      } catch (error) {
        console.error('Error parsing JSON file:', error);
      }
    };

    reader.readAsText(file);
  };

  const calculateHash = async() =>{
    const sortedData = sortKeysAlphabetically(jsonFile)
    const jsonString = JSON.stringify(sortedData);
    const hash = ethers.keccak256(ethers.toUtf8Bytes(jsonString))

    const verify = await readContract({
      address:CONTRACT_ADDRESS,
      abi: SmartContract,
      functionName:'compareHashes',
      args:[index, hash]              
    })

    const data = await readContract({
      address:CONTRACT_ADDRESS,
      abi: SmartContract,
      functionName:'getLastHash',
      args:[index]              
    })

    const historyShow = await readContract({
      address:CONTRACT_ADDRESS,
      abi: SmartContract,
      functionName:'getHashHistory',
      args:[index]              
    })
  
    setHash(hash)
    setCurrentHash(data[0])

    setHistoryHash(historyShow)
    setResult(parseInt(verify))
  }

  return (
    <Container>
      <h1 style={{marginBottom:"10px"}}>Datenintegrität prüfen</h1>
      <DropArea
        changeColor = {isDragActive}
        onDrop={handleFileDrop}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragActive(true);
        }}
        onDragLeave={() => setIsDragActive(false)}
        onClick={handleClick}
      >

        {isDragActive ? (<h3></h3>) : 

        fileSelected ?  <p>{fileSelected}</p> : <p>JSON des Projekts {name} hochladen</p>

        }

        <input
          type="file"
          accept=".json"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </DropArea>
      {hash && 
      <>
        <div className="area">
          <h3>Ergebnisse der Datenintegritätsprüfung</h3>
          {result === 2 && <p>Der Hash Ihres Uploads stimmt mit dem letzten Hash des in unserer Lösung gespeicherten Projekts überein. Die Daten wurden nicht verändert.</p>}
          {result === 1 && <p>Der aus dem Upload generierte Hash entspricht dem Hash-Wert einer älteren Version des Projekts.</p>}
          {result === 0 && <p>Achtung: Der aus dem Upload generierte Hash-Wert entspricht weder der aktuellen Version des Projektes noch einer früheren Version. Die Daten wurden verändert.</p>}
        </div>
        <div className="area">
          <h3>Hash Ihres Uploades (nach Keccak-256):</h3>
          <p>{hash}</p>
        </div>
        <div className="area">
          <h3>Letzter Hashwert des in unserer Lösung gespeicherten Projekts (nach Keccak-256):</h3>
          <p>{currentHash}</p>
        </div>
        <div className="area">
          <h3>Alle Hashwerte des Projekts, falls mehrere vorhanden sind (nach Keccak-256):</h3>
          {Array.isArray(historyHash) && historyHash.map((item,index)=>{
            if (index!==0)
            return(<p key={`json-checker-${index}`}>{historyHash[historyHash.length-1-index].hash}</p>)
          }
          
            )
          }
        </div>
      </>
    }
      
      {fileSelected && <ButtonContainer>
        <div className="inside" onClick={()=>calculateHash()}>
          <Button type={"primary"}> Prüfen</Button>
        </div>
      </ButtonContainer>}
      <ButtonContainer onClick={()=>setShow(false)}>
        <Button>Zurück</Button>
      </ButtonContainer>
    </Container>
  );
};

export default JsonChecker;

const Container = styled.div`
  display:flex;
  justify-content:center;
  flex-direction:column;

  .area{
    padding:10px 0;
  }
`

const DropArea = styled.div`
  border: 2px dashed #aaa;
  padding: 20px;
  text-align: center;
  display:flex;
  justify-content:center;
  align-items:center;
  width: 350px;
  height:100px;
  border-radius:12px;

  ${(props) => (props.changeColor 
        ? 
        `
        border-color: #006dc7;
        opacity:0.8;
        background-color: #dff1ff89;
        `
        : 
        `
        border-color:#aaa;
        opacity:1;
        `
    )}

  &:hover{
    cursor:pointer;
    opacity:0.8;
  }
`;

const ButtonContainer = styled.div`
  margin-top:10px;
  display:flex;
  gap:10px;
  .inside{
    flex:1;
  }
`