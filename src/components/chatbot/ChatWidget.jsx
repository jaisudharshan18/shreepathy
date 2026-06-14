"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { whatsappLink } from "@/lib/utils";
const INITIAL_BOT_MESSAGE = {
  id: "init",
  role: "bot",
  text: "Hi there! Welcome to Shreepathy & Co. I can help you with product information, pack sizes, pricing and FAQs. How can I assist you today?"
};
const CANNED_REPLY = "Thanks! I can help with product info, pack sizes, and FAQs. For a quick reply, you can also chat with us on WhatsApp. (Live AI answers arrive in Phase 2.)";
let msgCounter = 0;
function nextId() {
  msgCounter += 1;
  return `msg-${msgCounter}`;
}
export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([INITIAL_BOT_MESSAGE]);
    }
  }, [isOpen, messages.length]);
  useEffect(() => {
    if (isOpen && messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === "function") {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);
  function handleSend() {
    const text = inputValue.trim();
    if (!text) return;
    const userMsg = { id: nextId(), role: "user", text };
    const botMsg = { id: nextId(), role: "bot", text: CANNED_REPLY };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInputValue("");
  }
  function handleKeyDown(e) {
    if (e.key === "Enter") handleSend();
  }
  function handleShareDetails() {
    console.log("[ChatWidget] Lead capture:", { name: leadName, phone: leadPhone });
    setLeadName("");
    setLeadPhone("");
  }
  return <>{
    /* Floating toggle button */
  }{!isOpen && <button
    aria-label="Open chat"
    onClick={() => setIsOpen(true)}
    className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-magenta text-white shadow-lg hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-magenta focus-visible:ring-offset-2"
  ><MessageCircle className="h-6 w-6" /></button>}{
    /* Chat panel */
  }{isOpen && <div
    role="dialog"
    aria-label="Chat with Shreepathy & Co Assistant"
    className="fixed bottom-6 right-6 z-50 flex w-[360px] max-w-[calc(100vw-2rem)] flex-col rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden"
    style={{ maxHeight: "80vh" }}
  >{
    /* Header */
  }<div className="flex items-center justify-between bg-brand-navy px-4 py-3 text-white"><div className="flex items-center gap-2"><MessageCircle className="h-5 w-5 text-brand-magenta" /><span className="font-semibold text-sm">Shreepathy &amp; Co Assistant</span></div><button
    aria-label="Close chat"
    onClick={() => setIsOpen(false)}
    className="rounded-full p-1 hover:bg-white/20 transition-colors focus-visible:outline-none"
  ><X className="h-4 w-4" /></button></div>{
    /* Messages */
  }<div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: "200px", maxHeight: "300px" }}>{messages.map((msg) => <div
    key={msg.id}
    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
  ><div
    className={`max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed ${msg.role === "user" ? "bg-brand-magenta text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"}`}
  >{msg.text}</div></div>)}<div ref={messagesEndRef} /></div>{
    /* WhatsApp handoff */
  }<div className="border-t border-gray-100 px-4 py-2"><a
    href={whatsappLink("Hi, I have a question about your products.")}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center gap-2 w-full rounded-full bg-green-500 py-2 text-xs font-semibold text-white hover:bg-green-600 transition-colors"
  >
              Chat on WhatsApp
            </a></div>{
    /* Lead capture */
  }<div className="border-t border-gray-100 px-4 py-3 bg-gray-50 space-y-2"><p className="text-xs text-gray-500 font-medium">Share your details for a callback</p><div className="flex gap-2"><input
    type="text"
    value={leadName}
    onChange={(e) => setLeadName(e.target.value)}
    placeholder="Your name"
    className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-magenta"
  /><input
    type="tel"
    value={leadPhone}
    onChange={(e) => setLeadPhone(e.target.value)}
    placeholder="Phone"
    className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-magenta"
  /></div><button
    onClick={handleShareDetails}
    className="w-full rounded-full border border-brand-navy py-1.5 text-xs font-semibold text-brand-navy hover:bg-brand-navy hover:text-white transition-colors"
  >
              Share details
            </button></div>{
    /* Input area */
  }<div className="border-t border-gray-200 px-3 py-3 flex gap-2"><input
    type="text"
    value={inputValue}
    onChange={(e) => setInputValue(e.target.value)}
    onKeyDown={handleKeyDown}
    placeholder="Type your message..."
    className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-magenta"
  /><button
    onClick={handleSend}
    aria-label="Send message"
    className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-magenta text-white hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-magenta"
  ><Send className="h-4 w-4" /></button></div></div>}</>;
}
