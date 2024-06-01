import styled from "styled-components"
import ProcessorDashboard from "./ProcessorDashboard"
import { useContext } from "react"
import { UserContext } from "../utils/context"
import UserDashboard from "./UserDashboard"

function Body() {

  const { userType } = useContext(UserContext) 

  return (
    <BodyContainer>
      {userType === 2 && <ProcessorDashboard/> }

      {userType === 1 && <UserDashboard/>}
    </BodyContainer>
    
  )
}

export default Body

const BodyContainer = styled.div`
  max-width: 1536px;
  margin:0 auto;
`