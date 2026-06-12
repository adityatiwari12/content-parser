import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { applyTheme, useThemeStore } from '@/stores/theme'
import HomePage from '@/pages/HomePage'
import DashboardPage from '@/pages/DashboardPage'
import DiscoveryPage from '@/pages/DiscoveryPage'
import LiteratureReviewPage from '@/pages/LiteratureReviewPage'
import GapsPage from '@/pages/GapsPage'
import CopilotPage from '@/pages/CopilotPage'
import CitationsPage from '@/pages/CitationsPage'
import WritingPage from '@/pages/WritingPage'
import PeerReviewPage from '@/pages/PeerReviewPage'
import GraphPage from '@/pages/GraphPage'
import TrendsPage from '@/pages/TrendsPage'
import WorkspacePage from '@/pages/WorkspacePage'
import DatasetsPage from '@/pages/DatasetsPage'
import ExperimentsPage from '@/pages/ExperimentsPage'
import ReproducibilityPage from '@/pages/ReproducibilityPage'
import CompliancePage from '@/pages/CompliancePage'
import AnalysisPage from '@/pages/AnalysisPage'
import HowItWorksPage from '@/pages/HowItWorksPage'

export default function App() {
  const theme = useThemeStore((s) => s.theme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/discovery" element={<DiscoveryPage />} />
        <Route path="/literature-review" element={<LiteratureReviewPage />} />
        <Route path="/gaps" element={<GapsPage />} />
        <Route path="/copilot" element={<CopilotPage />} />
        <Route path="/citations" element={<CitationsPage />} />
        <Route path="/writing" element={<WritingPage />} />
        <Route path="/peer-review" element={<PeerReviewPage />} />
        <Route path="/graph" element={<GraphPage />} />
        <Route path="/trends" element={<TrendsPage />} />
        <Route path="/workspace" element={<WorkspacePage />} />
        <Route path="/datasets" element={<DatasetsPage />} />
        <Route path="/experiments" element={<ExperimentsPage />} />
        <Route path="/reproducibility" element={<ReproducibilityPage />} />
        <Route path="/compliance" element={<CompliancePage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/generator" element={<Navigate to="/writing" replace />} />
        <Route path="/parser" element={<Navigate to="/analysis" replace />} />
        <Route path="/plagiarism-check" element={<Navigate to="/compliance" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}
