import styled from "styled-components"
import { Controller, useFormContext } from "react-hook-form";
import { primaryColor } from "../../constants";


function RegularInput({classRegister, label, controller, bottomBorder, edited, ...delegated}) {

    const {formState:{errors}, clearErrors, control, register} = useFormContext(); 

    return (
        <InputContainer errors={errors?.[classRegister]} bottomBorder={bottomBorder} edited={edited}>
            <p>
                {label}
            </p>
            {!controller ? <input
                {...register(`${classRegister}`)}
                id={classRegister}

                onChange={()=>{clearErrors(`${classRegister}`)}}

                {...delegated}
            />
        
            :
            <Controller 
                name={`${classRegister}`}
                control={control}
                onChange={()=>{clearErrors(`${classRegister}`)}}
                render={({ field }) => 
                <StyledTextArea className ="text-error" {...field} {...delegated} />}
            />
        }
        </InputContainer>
  )
}



export default RegularInput

const InputContainer = styled.div`
    display:flex;
    >p{
        width:300px;
        padding:6px;
        background-color:${props=>!props.edited ? '#7cb0ff' : 'lightgrey'};
    }

    border:1px solid ${primaryColor};
    border-bottom-width: ${props=>props.bottomBorder ? `1px` : `0px`};
    font-size:14px;

    >input, .text-error{
        padding-left:10px;
        ${(props) => (props.errors 
            ? 
            `
            border: 1px solid red;
            `
            : 
            `
            border: none;
            `
        )}
        width:100%;
        outline:none;
    }
    &:nth-child(even) {
         >input{
            background-color: #f9f9f9;
         }
    }

    >textarea{
        padding-left:10px;
        width:100%;
        outline:none;
    }

    
`

const StyledTextArea = styled.textarea`
  font-size: 14px;
  resize:none;
  height:auto;
  outline:none;
  ${(props) => (props.errors 
        ? 
        `
        border: 1px solid red;
        `
        : 
        `
        border: none;
        `
    )}
`;