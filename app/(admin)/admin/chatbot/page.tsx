'use client'

import { useState } from 'react'
import { faqs as seedFaqs } from '@/lib/mock/data'
import { DataTable, type Column } from '@/components/admin/DataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Faq } from '@/lib/types'

type FaqRow = Faq & Record<string, unknown>

interface ChatLead extends Record<string, unknown> {
  id: string
  name: string
  phone: string
  message: string
  date: string
}

const MOCK_CHAT_LEADS: ChatLead[] = [
  { id: 'cl-1', name: 'Suraj Patil', phone: '9800012345', message: 'Hi, need pricing for Morde chocolate in bulk', date: '2024-06-10' },
  { id: 'cl-2', name: 'Rekha Devi', phone: '9700056789', message: 'Do you deliver to Mysore? Looking for Amul butter', date: '2024-06-11' },
  { id: 'cl-3', name: 'Tariq Hussain', phone: '9600098765', message: 'What are payment terms for new customers?', date: '2024-06-12' },
]

const chatLeadColumns: Column<ChatLead>[] = [
  { key: 'name', header: 'Name' },
  { key: 'phone', header: 'Phone' },
  { key: 'message', header: 'Message' },
  { key: 'date', header: 'Date' },
]

interface FaqForm {
  question: string
  answer: string
}

const emptyForm: FaqForm = { question: '', answer: '' }

export default function ChatbotPage() {
  const [faqs, setFaqs] = useState<FaqRow[]>(() => seedFaqs.map(f => ({ ...f }) as FaqRow))
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [form, setForm] = useState<FaqForm>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)

  function openAdd() {
    setForm(emptyForm)
    setAddOpen(true)
  }

  function handleAdd() {
    if (!form.question.trim() || !form.answer.trim()) return
    const newFaq: FaqRow = {
      id: `faq-${Date.now()}`,
      question: form.question.trim(),
      answer: form.answer.trim(),
    }
    console.log('[Admin] Add FAQ (Phase 2 persists):', newFaq)
    setFaqs(prev => [...prev, newFaq])
    setAddOpen(false)
  }

  function openEdit(row: FaqRow) {
    setEditingId(row.id as string)
    setForm({ question: row.question as string, answer: row.answer as string })
    setEditOpen(true)
  }

  function handleEdit() {
    if (!form.question.trim() || !form.answer.trim()) return
    console.log('[Admin] Edit FAQ (Phase 2 persists):', editingId, form)
    setFaqs(prev =>
      prev.map(f =>
        f.id === editingId ? { ...f, question: form.question.trim(), answer: form.answer.trim() } : f
      )
    )
    setEditOpen(false)
  }

  function handleDelete(row: FaqRow) {
    console.log('[Admin] Delete FAQ (Phase 2 persists):', row.id)
    setFaqs(prev => prev.filter(f => f.id !== row.id))
  }

  const set = (k: keyof FaqForm, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const faqColumns: Column<FaqRow>[] = [
    { key: 'question', header: 'Question' },
    {
      key: 'answer',
      header: 'Answer',
      render: (row) => (
        <span className="line-clamp-2 text-muted-foreground text-xs max-w-xs">
          {row.answer as string}
        </span>
      ),
    },
    {
      key: 'id',
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); openEdit(row) }}>
            Edit
          </Button>
          <Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); handleDelete(row) }}>
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Chatbot Knowledge Base</h1>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>FAQ List</CardTitle>
            <Button onClick={openAdd}>Add FAQ</Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={faqColumns} data={faqs} />
        </CardContent>
      </Card>

      {/* Captured Chat Leads */}
      <Card>
        <CardHeader>
          <CardTitle>Captured Chat Leads</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Mock data — illustrates what the live chatbot widget will capture automatically in Phase 2.
          </p>
        </CardHeader>
        <CardContent>
          <DataTable columns={chatLeadColumns} data={MOCK_CHAT_LEADS} />
        </CardContent>
      </Card>

      {/* Add FAQ Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add FAQ</DialogTitle>
            <DialogDescription>Add a question and answer to the chatbot knowledge base.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1">
              <Label>Question</Label>
              <Input
                placeholder="Enter question"
                value={form.question}
                onChange={e => set('question', e.target.value)}
              />
            </div>
            <div className="grid gap-1">
              <Label>Answer</Label>
              <Textarea
                placeholder="Enter answer"
                value={form.answer}
                onChange={e => set('answer', e.target.value)}
              />
            </div>
          </div>
          <DialogFooter showCloseButton>
            <Button onClick={handleAdd} disabled={!form.question.trim() || !form.answer.trim()}>
              Add FAQ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit FAQ Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit FAQ</DialogTitle>
            <DialogDescription>Update the question and answer.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1">
              <Label>Question</Label>
              <Input
                value={form.question}
                onChange={e => set('question', e.target.value)}
              />
            </div>
            <div className="grid gap-1">
              <Label>Answer</Label>
              <Textarea
                value={form.answer}
                onChange={e => set('answer', e.target.value)}
              />
            </div>
          </div>
          <DialogFooter showCloseButton>
            <Button onClick={handleEdit} disabled={!form.question.trim() || !form.answer.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
