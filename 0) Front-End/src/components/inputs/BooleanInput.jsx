import { useFormContext } from 'react-hook-form';
import { primaryColor } from '../../constants';
import styled from 'styled-components';


function BooleanInput({label, classRegister}) {

  const {formState:{errors}, setValue, register} = useFormContext();

  return (
    <DutyContainer errors={errors?.classRegister}>
        <p>{label}</p>
        <FlexContainer>
            <div className="wrap" onClick={()=>{
                setValue(`${classRegister}`, 'true')
            }}>
                <p>Ja</p>
                <input {...register(`${classRegister}`, { required: true })} type="radio" value="true" />
            </div>
            <div className="wrap" onClick={()=>{
                setValue(`${classRegister}`, 'false')}
                }>
                <p>Nein</p>
                <input {...register(`${classRegister}`, { required: true })} type="radio" value="false" />
            </div>
        </FlexContainer>
    </DutyContainer>
  )
}

export default BooleanInput

const DutyContainer = styled.div`
    display:flex;
    flex-direction:column;
    padding:4px;

    ${(props) => (props.errors 
        ? 
        `
        border: 1px solid red;
        `
        : 
        `
        border: 1px solid ${primaryColor};
        `
    )}
    
`

const FlexContainer = styled.div`
    display:flex;
    justify-content:space-evenly;
    .wrap{
        margin-top:10px;
        display:flex;
        :hover{
            cursor:pointer;
        }
    }

`