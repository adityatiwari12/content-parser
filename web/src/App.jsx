import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import GeneratorPage from './pages/GeneratorPage'
import HomePage from './pages/HomePage'
import ParserPage from './pages/ParserPage'
import PlagiarismPage from './pages/PlagiarismPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/generator" element={<GeneratorPage />} />
        <Route path="/parser" element={<ParserPage />} />
        <Route path="/plagiarism-check" element={<PlagiarismPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
