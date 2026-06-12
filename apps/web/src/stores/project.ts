import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProjectState {
  activeProjectId: string | null
  selectedPaperIds: string[]
  setActiveProject: (id: string | null) => void
  togglePaper: (id: string) => void
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      activeProjectId: null,
      selectedPaperIds: [],
      setActiveProject: (id) => set({ activeProjectId: id }),
      togglePaper: (id) => {
        const current = get().selectedPaperIds
        set({
          selectedPaperIds: current.includes(id)
            ? current.filter((p) => p !== id)
            : [...current, id],
        })
      },
    }),
    { name: 'axiom-project-state' },
  ),
)
