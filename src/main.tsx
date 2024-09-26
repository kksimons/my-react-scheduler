import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './App.css'
import EmployeeManagement from './EmployeeManagement.tsx'
import SchedulerView from './SchedulerView.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SchedulerView />

  </StrictMode>
)
