'use client'

import { useEffect, useRef, useState } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/components/AuthProvider'
import type { ChatMessage } from '@/lib/types'

function BotAvatar() {
  return (
    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mr-2.5 mt-0.5" style={{ backgroundColor: '#A51417' }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    </div>
  )
}

export default function Chat() {
  const { canUseAI } = useAuth()
  const [isOpen, setIsOpen]         = useState(false)
  const [messages, setMessages]     = useState<ChatMessage[]>([])
  const [history, setHistory]       = useState<object[]>([])
  const [input, setInput]           = useState('')
  const [loading, setLoading]       = useState(false)
  const [streamingText, setStreamingText] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingText, loading])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 50)
  }, [isOpen])

  const simulateStream = (text: string, onUpdate: (t: string) => void, onDone: () => void) => {
    const words = text.split(' ')
    let i = 0
    const tick = () => {
      if (i >= words.length) { onDone(); return }
      i++
      onUpdate(words.slice(0, i).join(' '))
      setTimeout(tick, 18 + Math.random() * 14)
    }
    tick()
  }

  const send = async () => {
    const text = input.trim()
    if (!text || loading || streamingText !== null) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setLoading(true)
    try {
      const { reply, history: newHistory } = await api.chat.send(text, history)
      setHistory(newHistory)
      setLoading(false)
      setStreamingText('')
      simulateStream(
        reply,
        (partial) => setStreamingText(partial),
        () => {
          setMessages(prev => [...prev, { role: 'assistant', content: reply }])
          setStreamingText(null)
        },
      )
    } catch (err: unknown) {
      setLoading(false)
      const msg = err instanceof Error && err.message.includes('403')
        ? 'AI advisor access is not enabled for your account.'
        : 'Something went wrong. Please try again.'
      setMessages(prev => [...prev, { role: 'assistant', content: msg }])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
    if (e.key === 'Escape') setIsOpen(false)
  }

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        style={{ backgroundColor: '#A51417' }}
        aria-label="Open AI Advisor"
        title="AI Academic Advisor"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Chat window */}
      <div
        className={`fixed z-50 inset-0 flex items-center justify-center pointer-events-none transition-all duration-200 ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <div
          className="pointer-events-auto w-full max-w-2xl mx-4 flex flex-col rounded-2xl shadow-2xl overflow-hidden bg-white"
          style={{ height: '80vh', maxHeight: '740px' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex-shrink-0 h-14 flex items-center justify-between px-5" style={{ backgroundColor: '#A51417' }}>
            <div className="flex items-center gap-2.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span className="text-white font-bold text-base">AI Academic Advisor</span>
              <span className="text-red-200 text-xs font-medium">WashU</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white text-2xl leading-none transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {!canUseAI ? (
            <div className="flex-1 flex items-center justify-center px-8">
              <div className="text-center">
                <div className="text-4xl mb-3">🔒</div>
                <div className="text-gray-600 font-semibold mb-1">AI access not enabled</div>
                <div className="text-gray-400 text-sm">Contact the admin to enable AI advisor access for your account.</div>
              </div>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                {messages.length === 0 && streamingText === null && !loading && (
                  <div className="flex flex-col items-center justify-center h-full text-center gap-3 -mt-4">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A51417' }}>
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 text-lg">Ask your AI Academic Advisor</div>
                      <div className="text-gray-400 text-sm mt-1">I can see your live degree progress and planned courses.</div>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center mt-2">
                      {[
                        "What requirements do I still need?",
                        "Which electives should I take?",
                        "Am I on track to graduate?",
                        "What courses count toward Finance Minor?",
                      ].map(q => (
                        <button
                          key={q}
                          onClick={() => { setInput(q); inputRef.current?.focus() }}
                          className="text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && <BotAvatar />}
                    <div
                      className={`max-w-[78%] text-sm rounded-2xl px-4 py-3 leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                      }`}
                      style={msg.role === 'user' ? { backgroundColor: '#A51417' } : {}}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {/* Streaming message */}
                {streamingText !== null && (
                  <div className="flex justify-start">
                    <BotAvatar />
                    <div className="max-w-[78%] text-sm rounded-2xl rounded-bl-sm px-4 py-3 leading-relaxed whitespace-pre-wrap bg-gray-100 text-gray-800">
                      {streamingText}
                      <span
                        className="inline-block w-1.5 h-3.5 ml-0.5 align-middle rounded-sm animate-pulse"
                        style={{ backgroundColor: '#A51417' }}
                      />
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="flex justify-start">
                    <BotAvatar />
                    <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* Input bar */}
              <div className="flex-shrink-0 border-t border-gray-100 px-5 py-4 flex gap-3 bg-white">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about your courses, requirements, or career..."
                  disabled={loading || streamingText !== null}
                  className="flex-1 text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#A51417] focus:ring-1 focus:ring-[#A51417] disabled:bg-gray-50 disabled:text-gray-400"
                />
                <button
                  onClick={send}
                  disabled={loading || !input.trim() || streamingText !== null}
                  className="text-white text-sm px-5 py-2.5 rounded-xl font-semibold disabled:opacity-40 transition-opacity flex items-center gap-1.5"
                  style={{ backgroundColor: '#A51417' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
