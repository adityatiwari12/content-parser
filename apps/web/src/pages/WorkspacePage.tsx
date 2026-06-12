import { ChangeEvent, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import { PageHeader } from '@/components/ui/PageHeader'
import { copyText, downloadText, runMockAction } from '@/lib/actions'
import { useProjectStore } from '@/stores/project'
import { getProjectProgress, useWorkspaceStore, writingSteps } from '@/stores/workspace'

type Project = { id: string; name: string; description?: string; created_at?: string }

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function formatSize(size: number) {
  if (size > 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`
  return `${Math.max(1, Math.round(size / 1024))} KB`
}

export default function WorkspacePage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [noteTitle, setNoteTitle] = useState('')
  const [noteBody, setNoteBody] = useState('')
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [citation, setCitation] = useState({ title: '', authors: '', year: '', doi: '', url: '' })
  const qc = useQueryClient()
  const activeProjectId = useProjectStore((s) => s.activeProjectId)
  const setActiveProject = useProjectStore((s) => s.setActiveProject)
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: api.listProjects })
  const allProjects = projects as Project[]
  const activeProject = allProjects.find((project) => project.id === activeProjectId) || allProjects[0]
  const projectId = activeProject?.id || ''
  const assets = useWorkspaceStore((s) => s.assets).filter((asset) => asset.projectId === projectId)
  const notes = useWorkspaceStore((s) => s.notes).filter((note) => note.projectId === projectId)
  const citations = useWorkspaceStore((s) => s.citations).filter((item) => item.projectId === projectId)
  const progress = useWorkspaceStore((s) => s.progressByProject[projectId])
  const addAsset = useWorkspaceStore((s) => s.addAsset)
  const deleteAsset = useWorkspaceStore((s) => s.deleteAsset)
  const addNote = useWorkspaceStore((s) => s.addNote)
  const updateNote = useWorkspaceStore((s) => s.updateNote)
  const deleteNote = useWorkspaceStore((s) => s.deleteNote)
  const addCitation = useWorkspaceStore((s) => s.addCitation)
  const deleteCitation = useWorkspaceStore((s) => s.deleteCitation)
  const toggleProgress = useWorkspaceStore((s) => s.toggleProgress)
  const resetProjectWorkspace = useWorkspaceStore((s) => s.resetProjectWorkspace)
  const completion = getProjectProgress(progress)

  const workspaceExport = useMemo(() => ({
    project: activeProject,
    notes,
    citations,
    assets: assets.map((asset) => ({
      id: asset.id,
      projectId: asset.projectId,
      name: asset.name,
      type: asset.type,
      mime: asset.mime,
      size: asset.size,
      createdAt: asset.createdAt,
    })),
    progress,
  }), [activeProject, assets, citations, notes, progress])

  async function create() {
    if (!name.trim()) return
    const project = await api.createProject(name, desc) as Project
    setActiveProject(project.id)
    runMockAction('Project created', `${name} is now the active workspace.`)
    await qc.invalidateQueries({ queryKey: ['projects'] })
    setName('')
    setDesc('')
  }

  async function removeProject(project: Project) {
    if (!window.confirm(`Delete "${project.name}" and all saved workspace items?`)) return
    await api.deleteProject(project.id)
    resetProjectWorkspace(project.id)
    if (activeProjectId === project.id) setActiveProject(null)
    await qc.invalidateQueries({ queryKey: ['projects'] })
    runMockAction('Project deleted', project.name)
  }

  async function uploadFiles(event: ChangeEvent<HTMLInputElement>) {
    if (!projectId) {
      runMockAction('Create a project first', 'Files need a project workspace.')
      return
    }
    const files = Array.from(event.target.files || [])
    for (const file of files) {
      const dataUrl = await fileToDataUrl(file)
      addAsset({
        id: `asset-${Date.now()}-${file.name}`,
        projectId,
        name: file.name,
        type: file.type.includes('pdf') ? 'pdf' : file.type.includes('image') ? 'image' : 'file',
        mime: file.type || 'application/octet-stream',
        size: file.size,
        dataUrl,
        createdAt: new Date().toISOString(),
      })
    }
    event.target.value = ''
    runMockAction('Files added', `${files.length} research asset${files.length === 1 ? '' : 's'} saved.`)
  }

  function saveNote() {
    if (!projectId || !noteTitle.trim()) return
    if (editingNoteId) {
      updateNote(editingNoteId, { title: noteTitle, body: noteBody })
      runMockAction('Note updated', noteTitle)
    } else {
      addNote(projectId, noteTitle, noteBody)
      runMockAction('Note added', noteTitle)
    }
    setEditingNoteId(null)
    setNoteTitle('')
    setNoteBody('')
  }

  function editNote(note: { id: string; title: string; body: string }) {
    setEditingNoteId(note.id)
    setNoteTitle(note.title)
    setNoteBody(note.body)
  }

  function saveCitation() {
    if (!projectId || !citation.title.trim()) return
    addCitation(projectId, citation)
    setCitation({ title: '', authors: '', year: '', doi: '', url: '' })
    runMockAction('Citation added', 'Citation saved to this workspace.')
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader title="Research Workspace" description="A persistent desk for PDFs, images, notes, citations, and manuscript progress." />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">Active project</p>
              <h1 className="mt-2 font-serif text-5xl leading-none">{activeProject?.name || 'Create your first research project'}</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-500">
                {activeProject?.description || 'Create a project to unlock uploads, notes, citations, and paper progress tracking.'}
              </p>
            </div>
            {activeProject && (
              <button onClick={() => downloadText(`${activeProject.name}.json`, JSON.stringify(workspaceExport, null, 2))} className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300">
                Export workspace
              </button>
            )}
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-4">
            {[
              ['Assets', assets.length],
              ['Notes', notes.length],
              ['Citations', citations.length],
              ['Progress', `${completion}%`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                <p className="font-serif text-3xl">{value}</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {activeProject ? (
              <>
                <button onClick={() => navigate('/discovery')} className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950">Find papers</button>
                <button onClick={() => navigate('/writing')} className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300">Continue writing</button>
                <button onClick={() => navigate('/citations')} className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300">Manage citations</button>
              </>
            ) : (
              <>
                <button onClick={() => { setName('My Research Project'); setDesc('A workspace for papers, notes, citations, and drafts.') }} className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950">Use starter project</button>
                <button onClick={() => navigate('/discovery')} className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300">Explore papers first</button>
              </>
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="font-serif text-2xl">Projects</h2>
          <div className="mt-4 space-y-2">
            {!allProjects.length && <p className="rounded-xl bg-zinc-950 p-4 text-sm leading-6 text-zinc-500">No projects yet. Create one to begin saving research work.</p>}
            {allProjects.map((project) => (
              <div key={project.id} className={`rounded-xl border p-3 ${project.id === projectId ? 'border-blue-800 bg-blue-950/20' : 'border-zinc-800 bg-zinc-950'}`}>
                <button onClick={() => setActiveProject(project.id)} className="block w-full text-left">
                  <p className="font-medium text-zinc-100">{project.name}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-zinc-500">{project.description || 'No description'}</p>
                </button>
                <button onClick={() => removeProject(project)} className="mt-3 rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-400">
                  Delete project
                </button>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <h3 className="font-mono text-xs uppercase tracking-wider text-zinc-500">New project</h3>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" className="mt-3 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" />
            <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" />
            <button type="button" onClick={create} className="mt-3 w-full rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900">Create project</button>
          </div>
        </div>
      </section>

      {activeProject && (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <main className="space-y-5">
            <section className="rounded-[2rem] border border-zinc-800 bg-zinc-900/50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-serif text-3xl">Research assets</h2>
                <label className="cursor-pointer rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950">
                  Add PDFs / images
                  <input type="file" multiple accept="application/pdf,image/*" onChange={uploadFiles} className="hidden" />
                </label>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {!assets.length && (
                  <div className="rounded-2xl border border-dashed border-zinc-700 p-6">
                    <p className="font-serif text-2xl text-zinc-200">No files yet</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-500">Upload PDFs, figures, screenshots, diagrams, or scanned notes so the project has source material.</p>
                  </div>
                )}
                {assets.map((asset) => (
                  <article key={asset.id} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-zinc-100">{asset.name}</p>
                        <p className="mt-1 font-mono text-[10px] uppercase text-zinc-500">{asset.type} · {formatSize(asset.size)}</p>
                      </div>
                      <button onClick={() => deleteAsset(asset.id)} className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-400">Delete</button>
                    </div>
                    {asset.type === 'image' ? (
                      <img src={asset.dataUrl} alt={asset.name} className="mt-4 max-h-56 w-full rounded-xl object-cover" />
                    ) : (
                      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                        <p className="font-serif text-2xl">PDF saved</p>
                        <p className="mt-2 text-sm text-zinc-500">Open or download the uploaded PDF from this workspace.</p>
                      </div>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <a href={asset.dataUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300">Open</a>
                      <a href={asset.dataUrl} download={asset.name} className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300">Download</a>
                      <button onClick={() => copyText(asset.name, 'Asset name copied')} className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300">Copy name</button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-zinc-800 bg-zinc-900/50 p-5">
              <h2 className="font-serif text-3xl">Research notes</h2>
              <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                <input value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} placeholder="Note title" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" />
                <textarea value={noteBody} onChange={(e) => setNoteBody(e.target.value)} placeholder="Write findings, hypotheses, reading notes, or reviewer thoughts..." rows={5} className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" />
                <button onClick={saveNote} className="mt-3 rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950">{editingNoteId ? 'Update note' : 'Add note'}</button>
                {editingNoteId && <button onClick={() => { setEditingNoteId(null); setNoteTitle(''); setNoteBody('') }} className="ml-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300">Cancel</button>}
              </div>
              <div className="mt-4 space-y-3">
                {!notes.length && (
                  <div className="rounded-2xl border border-dashed border-zinc-700 p-6">
                    <p className="font-serif text-2xl text-zinc-200">No notes yet</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-500">Start with a research question, a paper takeaway, or a hypothesis you want to test.</p>
                    <button onClick={() => { setNoteTitle('Research question'); setNoteBody('What is the strongest unanswered question in this project?') }} className="mt-4 rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300">Use note template</button>
                  </div>
                )}
                {notes.map((note) => (
                  <article key={note.id} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                    <p className="font-medium text-zinc-100">{note.title}</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-400">{note.body}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button onClick={() => editNote(note)} className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300">Edit</button>
                      <button onClick={() => copyText(`${note.title}\n\n${note.body}`, 'Note copied')} className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300">Copy</button>
                      <button onClick={() => deleteNote(note.id)} className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300">Delete</button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </main>

          <aside className="space-y-5">
            <section className="rounded-[2rem] border border-zinc-800 bg-zinc-900/50 p-5">
              <h2 className="font-serif text-3xl">Paper progress</h2>
              <div className="mt-4 h-2 rounded-full bg-zinc-800">
                <div className="h-full rounded-full bg-blue-500" style={{ width: `${completion}%` }} />
              </div>
              <p className="mt-2 font-mono text-xs text-zinc-500">{completion}% complete</p>
              <div className="mt-4 space-y-2">
                {writingSteps.map((step) => (
                  <label key={step.key} className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-zinc-300">
                    <input type="checkbox" checked={Boolean(progress?.[step.key])} onChange={() => toggleProgress(projectId, step.key)} className="accent-blue-500" />
                    {step.label}
                  </label>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-zinc-800 bg-zinc-900/50 p-5">
              <h2 className="font-serif text-3xl">Citations</h2>
              <div className="mt-4 space-y-2">
                <input value={citation.title} onChange={(e) => setCitation({ ...citation, title: e.target.value })} placeholder="Paper title" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" />
                <input value={citation.authors} onChange={(e) => setCitation({ ...citation, authors: e.target.value })} placeholder="Authors" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" />
                <div className="grid grid-cols-2 gap-2">
                  <input value={citation.year} onChange={(e) => setCitation({ ...citation, year: e.target.value })} placeholder="Year" className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" />
                  <input value={citation.doi} onChange={(e) => setCitation({ ...citation, doi: e.target.value })} placeholder="DOI" className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" />
                </div>
                <input value={citation.url} onChange={(e) => setCitation({ ...citation, url: e.target.value })} placeholder="URL" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" />
                <button onClick={saveCitation} className="w-full rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950">Add citation</button>
              </div>
              <div className="mt-4 space-y-3">
                {citations.map((item) => (
                  <article key={item.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                    <p className="text-sm font-medium text-zinc-100">{item.title}</p>
                    <p className="mt-1 text-xs text-zinc-500">{item.authors} · {item.year}</p>
                    {item.description && <p className="mt-2 text-sm leading-6 text-zinc-400">{item.description}</p>}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.url && <a href={item.url} target="_blank" rel="noreferrer" className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300">Open</a>}
                      <button onClick={() => copyText(`${item.authors} (${item.year}). ${item.title}. ${item.doi || item.url}`, 'Citation copied')} className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300">Copy</button>
                      <button onClick={() => deleteCitation(item.id)} className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300">Delete</button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </div>
      )}
    </div>
  )
}
