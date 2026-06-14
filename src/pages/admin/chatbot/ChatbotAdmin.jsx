"use client";
import { useState, useTransition } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  createFaqAction,
  updateFaqAction,
  deleteFaqAction
} from "./actions";
const MOCK_CHAT_LEADS = [
  { id: "cl-1", name: "Suraj Patil", phone: "9800012345", message: "Hi, need pricing for Morde chocolate in bulk", date: "2024-06-10" },
  { id: "cl-2", name: "Rekha Devi", phone: "9700056789", message: "Do you deliver to Mysore? Looking for Amul butter", date: "2024-06-11" },
  { id: "cl-3", name: "Tariq Hussain", phone: "9600098765", message: "What are payment terms for new customers?", date: "2024-06-12" }
];
const chatLeadColumns = [
  { key: "name", header: "Name" },
  { key: "phone", header: "Phone" },
  { key: "message", header: "Message" },
  { key: "date", header: "Date" }
];
export default function ChatbotAdmin({ faqs }) {
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();
  function openAdd() {
    setEditing(null);
    setError(null);
    setAddOpen(true);
  }
  function openEdit(faq) {
    setEditing(faq);
    setError(null);
    setEditOpen(true);
  }
  function handleAddSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createFaqAction(fd);
      if ("error" in result) {
        setError(result.error);
      } else {
        setAddOpen(false);
        setError(null);
      }
    });
  }
  function handleEditSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateFaqAction(fd);
      if ("error" in result) {
        setError(result.error);
      } else {
        setEditOpen(false);
        setError(null);
      }
    });
  }
  const faqColumns = [
    { key: "question", header: "Question" },
    {
      key: "answer",
      header: "Answer",
      render: (row) => <span className="line-clamp-2 text-muted-foreground text-xs max-w-xs">{row.answer}</span>
    },
    { key: "sortOrder", header: "Order" },
    {
      key: "id",
      header: "Actions",
      render: (row) => <div className="flex gap-2"><Button
        size="sm"
        variant="outline"
        onClick={(e) => {
          e.stopPropagation();
          openEdit(row);
        }}
      >
            Edit
          </Button><form
        onSubmit={(e) => {
          e.preventDefault();
          if (!window.confirm(`Delete this FAQ?`)) return;
          const fd = new FormData(e.currentTarget);
          startTransition(async () => {
            const result = await deleteFaqAction(fd);
            if ("error" in result) setError(result.error);
          });
        }}
      ><input type="hidden" name="id" value={row.id} /><Button size="sm" variant="destructive" type="submit">Delete</Button></form></div>
    }
  ];
  return <div className="space-y-8"><h1 className="text-2xl font-bold">Chatbot Knowledge Base</h1>{error && <p className="text-sm text-destructive">{error}</p>}{
    /* FAQ Section */
  }<Card><CardHeader><div className="flex items-center justify-between"><CardTitle>FAQ List</CardTitle><Button onClick={openAdd}>Add FAQ</Button></div></CardHeader><CardContent><DataTable columns={faqColumns} data={faqs} /></CardContent></Card>{
    /* Captured Chat Leads — Phase 2e wires real captured leads */
  }<Card><CardHeader><CardTitle>Captured Chat Leads</CardTitle><p className="text-sm text-muted-foreground mt-1">
            Static placeholder — Phase 2e wires real captured leads from the chatbot widget.
          </p></CardHeader><CardContent><DataTable columns={chatLeadColumns} data={MOCK_CHAT_LEADS} /></CardContent></Card>{
    /* Add FAQ Dialog */
  }<Dialog open={addOpen} onOpenChange={setAddOpen}><DialogContent><DialogHeader><DialogTitle>Add FAQ</DialogTitle><DialogDescription>Add a question and answer to the chatbot knowledge base.</DialogDescription></DialogHeader><form onSubmit={handleAddSubmit}><div className="grid gap-3 py-2"><div className="grid gap-1"><Label>Question</Label><Input name="question" placeholder="Enter question" required /></div><div className="grid gap-1"><Label>Answer</Label><Textarea name="answer" placeholder="Enter answer" required /></div><div className="grid gap-1"><Label>Sort Order</Label><Input type="number" name="sortOrder" defaultValue={0} /></div></div>{error && <p className="text-sm text-destructive mb-2">{error}</p>}<DialogFooter showCloseButton><Button type="submit" disabled={isPending}>{isPending ? "Saving…" : "Add FAQ"}</Button></DialogFooter></form></DialogContent></Dialog>{
    /* Edit FAQ Dialog */
  }<Dialog open={editOpen} onOpenChange={setEditOpen}><DialogContent><DialogHeader><DialogTitle>Edit FAQ</DialogTitle><DialogDescription>Update the question and answer.</DialogDescription></DialogHeader><form onSubmit={handleEditSubmit}>{editing && <input type="hidden" name="id" value={editing.id} />}<div className="grid gap-3 py-2"><div className="grid gap-1"><Label>Question</Label><Input
    name="question"
    defaultValue={editing?.question ?? ""}
    key={editing?.id ?? "edit-q"}
    required
  /></div><div className="grid gap-1"><Label>Answer</Label><Textarea
    name="answer"
    defaultValue={editing?.answer ?? ""}
    key={editing?.id ?? "edit-a"}
    required
  /></div><div className="grid gap-1"><Label>Sort Order</Label><Input
    type="number"
    name="sortOrder"
    defaultValue={editing?.sortOrder ?? 0}
    key={editing?.id ?? "edit-sort"}
  /></div></div>{error && <p className="text-sm text-destructive mb-2">{error}</p>}<DialogFooter showCloseButton><Button type="submit" disabled={isPending}>{isPending ? "Saving…" : "Save Changes"}</Button></DialogFooter></form></DialogContent></Dialog></div>;
}
