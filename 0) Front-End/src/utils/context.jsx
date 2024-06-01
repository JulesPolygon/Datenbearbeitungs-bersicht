import {useState, createContext} from 'react'

export const UserContext = createContext({
    userType: 0,
    data: [],
    users:[],
    affectedData:[]
})

const UserObserver = ({children}) =>{
    const [userType, setUserType] = useState(0)

    const [data, setData] = useState([])

    const [users, setUsers] = useState([])

    const [affectedData, setAffectedData] = useState([])

    return (
        <UserContext.Provider value={{ userType, setUserType, data, setData, users, setUsers, affectedData, setAffectedData }}>
            {children}
        </UserContext.Provider>
    )

}

export default UserObserver