import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type WorkspaceAsset = {
  id: string
  projectId: string
  name: string
  type: 'pdf' | 'image' | 'file'
  mime: string
  size: number
  dataUrl: string
  createdAt: string
}

export type WorkspaceNote = {
  id: string
  projectId: string
  title: string
  body: string
  createdAt: string
  updatedAt: string
}

export type WorkspaceCitation = {
  id: string
  projectId: string
  title: string
  authors: string
  year: string
  doi: string
  url: string
  description?: string
  createdAt: string
}

export type WritingProgress = {
  outline: boolean
  literature: boolean
  methods: boolean
  draft: boolean
  review: boolean
}

type WorkspaceState = {
  assets: WorkspaceAsset[]
  notes: WorkspaceNote[]
  citations: WorkspaceCitation[]
  progressByProject: Record<string, WritingProgress>
  addAsset: (asset: WorkspaceAsset) => void
  deleteAsset: (id: string) => void
  addNote: (projectId: string, title: string, body: string) => void
  updateNote: (id: string, updates: Partial<Pick<WorkspaceNote, 'title' | 'body'>>) => void
  deleteNote: (id: string) => void
  addCitation: (projectId: string, citation: Omit<WorkspaceCitation, 'id' | 'projectId' | 'createdAt'>) => void
  deleteCitation: (id: string) => void
  toggleProgress: (projectId: string, key: keyof WritingProgress) => void
  resetProjectWorkspace: (projectId: string) => void
}

const defaultProgress: WritingProgress = {
  outline: false,
  literature: false,
  methods: false,
  draft: false,
  review: false,
}

export const writingSteps: Array<{ key: keyof WritingProgress; label: string }> = [
  { key: 'outline', label: 'Research outline' },
  { key: 'literature', label: 'Literature mapped' },
  { key: 'methods', label: 'Methodology drafted' },
  { key: 'draft', label: 'Paper draft' },
  { key: 'review', label: 'Review ready' },
]

export function getProjectProgress(progress?: WritingProgress) {
  const current = progress || defaultProgress
  const complete = writingSteps.filter((step) => current[step.key]).length
  return Math.round((complete / writingSteps.length) * 100)
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      assets: [],
      notes: [],
      citations: [],
      progressByProject: {},
      addAsset: (asset) => set((state) => ({ assets: [asset, ...state.assets] })),
      deleteAsset: (id) => set((state) => ({ assets: state.assets.filter((asset) => asset.id !== id) })),
      addNote: (projectId, title, body) => {
        const now = new Date().toISOString()
        set((state) => ({
          notes: [{ id: `note-${Date.now()}`, projectId, title, body, createdAt: now, updatedAt: now }, ...state.notes],
        }))
      },
      updateNote: (id, updates) => set((state) => ({
        notes: state.notes.map((note) => note.id === id ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note),
      })),
      deleteNote: (id) => set((state) => ({ notes: state.notes.filter((note) => note.id !== id) })),
      addCitation: (projectId, citation) => set((state) => ({
        citations: [{ id: `cite-${Date.now()}`, projectId, createdAt: new Date().toISOString(), ...citation }, ...state.citations],
      })),
      deleteCitation: (id) => set((state) => ({ citations: state.citations.filter((citation) => citation.id !== id) })),
      toggleProgress: (projectId, key) => {
        const current = get().progressByProject[projectId] || defaultProgress
        set((state) => ({
          progressByProject: {
            ...state.progressByProject,
            [projectId]: { ...current, [key]: !current[key] },
          },
        }))
      },
      resetProjectWorkspace: (projectId) => set((state) => ({
        assets: state.assets.filter((asset) => asset.projectId !== projectId),
        notes: state.notes.filter((note) => note.projectId !== projectId),
        citations: state.citations.filter((citation) => citation.projectId !== projectId),
        progressByProject: Object.fromEntries(Object.entries(state.progressByProject).filter(([id]) => id !== projectId)),
      })),
    }),
    { name: 'axiom-workspace' },
  ),
)
