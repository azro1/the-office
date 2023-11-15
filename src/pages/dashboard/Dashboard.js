import ProjectList from '../../components/ProjectList'
import { useCollection } from '../../hooks/useCollection'

// styles
import './Dashboard.css'

const Dashboard = () => {
  const { error, documents } = useCollection('projects')

  return (
    <div>
       <h2 className='page-title'>Dashboard</h2>
       {error && <p className='error'></p>}
       {documents && <ProjectList projects={documents} />}
    </div>
  )
}

export default Dashboard
