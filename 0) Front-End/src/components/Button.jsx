import {styled } from 'styled-components'
import { secondaryColor } from '../constants'

function Button({ children, type, disabled }) {

    return (
    <ButtonElement variant={type} disabled={disabled}>
        {children}
    </ButtonElement>
    )
}

export default Button

const ButtonElement = styled.div`
    ${(props) => (props.variant === 'primary' 
        ? 
        `
        color: white;
        border: 2px solid ${secondaryColor};
        background-color: ${secondaryColor};
        `
        : 
        `
        color: ${secondaryColor};
        border: 2px solid ${secondaryColor};
        `
        )}

    
    display:flex;
    flex:1;
    width:auto;
    justify-content:center;
    padding: 12px 32px;
    border-radius:8px;
    font-size:14px;
    font-weight:bold;
    opacity: ${props=>props.disabled ? '0.7' : '1'};
    &:hover{
        cursor: ${props=>props.disabled ? 'not-allowed' : 'pointer'};
        opacity: ${props=>props.disabled ? '0.7' : '0.85'};
    }

`