import {
  BrowserRouter as Router,
  Routes, Route, Link
} from "react-router-dom"

const App = () => {

  const padding = {
    padding: 5
  }
  
  const Home = () => {
    return (
      <h1>Home</h1>
    )
  }

  const Notes = () => {
    return (
      <h1>Notes</h1>
    )
  }

  const Users = () => {
    return (
      <h1>Users</h1>
    )
  }

  return (
    <Router>
      <div>
        <Link style={padding} to="/">home</Link>
        <Link style={padding} to="/notes">notes</Link>
        <Link style={padding} to="/users">users</Link>
      </div>

      <Routes>
        <Route path="/notes" element={<Notes />} />
        <Route path="/users" element={<Users />} />
        <Route path="/" element={<Home />} />
      </Routes>

      <div>
        <i>Note app, Department of Computer Science 2022</i>
      </div>
    </Router>
  )
}

export default App;
