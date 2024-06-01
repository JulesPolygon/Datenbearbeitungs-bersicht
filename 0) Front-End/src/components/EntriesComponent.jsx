import { useContext, useState } from 'react'
import TableComponent from './TableComponent'
import { UserContext } from '../utils/context'
import EditFormComponent from './EditFormComponent'

function EntriesComponent({setShowEntries, setShowSuccess}) {

  const {data} = useContext(UserContext)
  const [show, setShow] = useState(false)
  const [view, setView] = useState()
  const [selected, setSelected] = useState()

  const handleShow = (index) =>{
    setShow(true)
    setView(data[index])
    setSelected(index)
  }

  return (
    <>
    { 
    !show ? 
    <TableComponent data={data} handleShow={handleShow} />
    :
    <EditFormComponent setShow={setShow} setShowForm= {setShowEntries} setShowSuccess={setShowSuccess} data={view} selected={selected}/>}

    </>
  )
}

export default EntriesComponent