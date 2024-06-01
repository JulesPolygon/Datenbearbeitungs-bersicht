import {Plus, Minus} from '@styled-icons/boxicons-regular'
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components'
import { primaryColor } from '../../constants';
import { useContext, useState } from 'react';
import InputModal from '../../modals/InputModal';
import { UserContext } from '../../utils/context';
import { shortenString } from '../../utils/utils';


function MultipleList({classRegister, label, numbers, setNumbers, selectionAddress, edited, twoDArray, setTwoDArray, ...delegated}) {
  
  const {formState:{errors}, setValue, clearErrors, register, unregister} = useFormContext(); 

  const [show, setShow] = useState([false])

  const {users} = useContext(UserContext)

  const insertArray = (colIndex, array) => {

    const addressArray = array.map((data)=>{
      return users[data]
    }).join(', ')

    setValue(`${classRegister}.${colIndex}`, addressArray)

    let newArray = [...twoDArray]
    newArray[colIndex] = array
    setTwoDArray(newArray)
  };

  const expandArray = (index) => {
    register(`${classRegister}.${index}`)
    setTwoDArray((prevArray) => [...prevArray, []]);
  };

  const handleShow = (colIndex, state) =>{
    let newArray = [...show]
    newArray[colIndex] = state
    setShow(newArray)
  }

  const deleteArray = (index) =>{
    const newArray = twoDArray.filter((_, indexNew) => indexNew !== index);
    setTwoDArray(newArray)

    let newRows = [...numbers]

    newRows.splice(index,1)
    console.log(newRows)
    setNumbers(newRows)

    unregister(`prozessePersonendaten.${index}`)
    unregister(`idProProzess.${index}`)
    clearErrors(`${classRegister}.${index}`)
  }

  const handleAdd = (index) =>{
  setNumbers([...numbers, numbers[numbers.length-1] + 1 ])
  expandArray(index)
  }

  return (
    <Container edited={edited}>
        <p>{label}</p>
        {Array.isArray(numbers) && numbers.map((item,index)=>(
            <BodyContainer errors={errors?.[classRegister]} key={`${index}-${twoDArray.length}}`}>
              <div className='wrap'>
                <p>{index+1}</p>
                {!selectionAddress ? 
                  <input
                      {...register(`${classRegister}.${index}`)}
                      id={classRegister}
                      onChange={()=>{clearErrors(`${classRegister}`)}}
                      {...delegated}
                  />
                :
                  <>
                    <InputContainer onClick={()=>handleShow(index, true)}>
                      <p>{twoDArray && twoDArray.length > index && twoDArray[index].map((str)=> shortenString(users[str])).join(', ')}</p>
                    </InputContainer>
                    <InputModal array={twoDArray[index]} show={show[index]} setShow={handleShow} colIndex={index} insertArray={insertArray}/>
                  </>
                }

              </div>
              <div className='wrap'>
                {index + 1 === numbers.length ? <PlusIcon onClick={()=>handleAdd(index)}/> : <></>}
                {numbers.length !== 1 &&  
                <MinusIcon onClick={()=>deleteArray(index)}/>}
              </div>
            </BodyContainer>)
          )}

    </Container>
  )
}

export default MultipleList

const Container = styled.div`
    >p{
        padding:6px;
        font-size:14px;
        background-color:${'#7cb0ff'};
    }
    border:1px solid black;
    border-bottom:none;
`

const BodyContainer = styled.div`
  padding:6px;
  display:flex;
  align-items:center;
  gap:20px; 

  .wrap{
    display:flex;
    align-items:center;
    gap:10px;

    >p{
      width:20px;
      font-size:14px;
    }

    >input{
      font-size:14px;
      width:400px;
      outline:none;
      height:20px;
      padding-left:10px;
      ${(props) => (props.errors 
          ? 
          `
          border: 1px solid red;
          `
          : 
          `
          border: 1px solid black;
          `
      )}
    }
  }
  
`

const PlusIcon = styled(Plus)`
  height:22.5px;
  width:22.5px;
  border:1px solid black;
  color:${primaryColor};
  &:hover{
    cursor:pointer;
    opacity:0.8;
  }
`


const MinusIcon = styled(Minus)`
  height:22.5px;
  width:22.5px;
  border:1px solid black;
  color:${primaryColor};
  &:hover{
    cursor:pointer;
    opacity:0.8;
  }
`

const InputContainer = styled.div`
  display:flex;
  padding-left:10px;
  width:402px;
  border:1px solid black;
  min-height:22px;
  max-height:48px;
  overflow-y:auto;
`