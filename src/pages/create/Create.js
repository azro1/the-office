import { useEffect, useState } from 'react'
import Select from 'react-select'
import { useCollection } from '../../hooks/useCollection'
import { timestamp } from '../../firebase/config'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useFirestore } from '../../hooks/useFirestore'
import { useHistory} from 'react-router-dom'

// styles
import './Create.css'

const Create = () => {
  // destructure documents from hook
  const { documents } = useCollection('users')
  const [users, setUsers] = useState([])

    // destructure addDocument function and response from hook
  const { response, addDocument } = useFirestore('projects')
  const history = useHistory()

  // destructure user from hook
  const { user } = useAuthContext()

  const categories = [
    { value: 'development', label: 'Development' },
    { value: 'design', label: 'Design' },
    { value: 'sales', label: 'Sales' },
    { value: 'marketing', label: 'Marketing' },
  ];


  // form field values
  const [name, setName] = useState('')
  const [details, setDetails] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('')
  const [assignedUser, setAssignedUser] = useState([])


  useEffect(() => {
    if (documents) {
      const options = documents.map((user) => {
        return { value: user, label: user.displayName }
      })
      setUsers(options)
    }
  }, [documents])


 
  const handleSubmit = async (e) => {
    e.preventDefault()

    const createdBy = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      id: user.uid
    }

    const assingedUsersList = assignedUser.map((user) => {
      return { 
        displayName: user.value.displayName,
        photoURL: user.value.photoURL,
        id: user.value.id
       }
    })
    
    // project object
    const project = {
      name,
      details,
      category: category.value,
      dueDate: timestamp.fromDate(new Date(dueDate)),
      comments: [],
      createdBy,
      assingedUsersList
    }

    // save project document to firestore projects collection
    await addDocument(project)
    if (!response.error) {
      history.push('/')
    }

  }

  return (
    <div className='create-form'>
       <h2 className='page-title'>Create a new project</h2>
       <form onSubmit={handleSubmit}>
          <label>
            <span>Project name:</span>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            <span>Project details:</span>
            <textarea type="text" value={details} onChange={(e) => setDetails(e.target.value)} required ></textarea>
          </label>
          <label>
            <span>Set due date:</span>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
          </label>
          <label>
            <span>Project category:</span>
            <Select options={categories} onChange={(option) => setCategory(option)} required />
          </label>
          <label>
            <span>Assign to:</span>
            <Select options={users} onChange={(option) => setAssignedUser(option)} isMulti required />
          </label>
       <button className="btn">Add Project</button>
       </form>
    </div>
  )
}

export default Create
