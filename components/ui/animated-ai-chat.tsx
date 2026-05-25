"use client";

import { useEffect, useRef, useCallback, useTransition } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ImageIcon, Figma, MonitorIcon, Paperclip, SendIcon, XIcon, LoaderIcon, Sparkles, Command } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as React from "react";

interface UseAutoResizeTextareaProps { minHeight: number; maxHeight?: number; }
function useAutoResizeTextarea({ minHeight, maxHeight }: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const adjustHeight = useCallback((reset?: boolean) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    if (reset) {
      textarea.style.height = `${minHeight}px`;
      return;
    }
    textarea.style.height = `${minHeight}px`;
    const newHeight = Math.max(minHeight, Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY));
    textarea.style.height = `${newHeight}px`;
  }, [minHeight, maxHeight]);

  useEffect(() => { if (textareaRef.current) textareaRef.current.style.height = `${minHeight}px`; }, [minHeight]);
  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

interface CommandSuggestion { icon: React.ReactNode; label: string; description: string; prefix: string; }
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { containerClassName?: string; showRing?: boolean; }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, containerClassName, showRing = true, ...props }, ref) => {
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <div className={cn("relative", containerClassName)}>
      <textarea
        className={cn("flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-all duration-200 ease-in-out placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", showRing ? "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" : "", className)}
        ref={ref}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {showRing && isFocused && <motion.span className="absolute inset-0 rounded-md pointer-events-none ring-2 ring-offset-0 ring-violet-500/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />}
    </div>
  );
});
Textarea.displayName = "Textarea";

export function AnimatedAIChat() {
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [, startTransition] = useTransition();
  const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({ minHeight: 60, maxHeight: 200 });
  const [inputFocused, setInputFocused] = useState(false);
  const commandPaletteRef = useRef<HTMLDivElement>(null);

  const commandSuggestions: CommandSuggestion[] = [
    { icon: <ImageIcon className="w-4 h-4" />, label: "Clone UI", description: "Generate a UI from a screenshot", prefix: "/clone" },
    { icon: <Figma className="w-4 h-4" />, label: "Import Figma", description: "Import a design from Figma", prefix: "/figma" },
    { icon: <MonitorIcon className="w-4 h-4" />, label: "Create Page", description: "Generate a new web page", prefix: "/page" },
    { icon: <Sparkles className="w-4 h-4" />, label: "Improve", description: "Improve existing UI design", prefix: "/improve" }
  ];

  useEffect(() => {
    if (value.startsWith("/") && !value.includes(" ")) {
      setShowCommandPalette(true);
      const idx = commandSuggestions.findIndex((cmd) => cmd.prefix.startsWith(value));
      setActiveSuggestion(idx >= 0 ? idx : -1);
    } else setShowCommandPalette(false);
  }, [value]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const commandButton = document.querySelector("[data-command-button]");
      if (commandPaletteRef.current && !commandPaletteRef.current.contains(target) && !commandButton?.contains(target)) setShowCommandPalette(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showCommandPalette) {
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveSuggestion((p) => (p < commandSuggestions.length - 1 ? p + 1 : 0)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActiveSuggestion((p) => (p > 0 ? p - 1 : commandSuggestions.length - 1)); }
      else if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault();
        if (activeSuggestion >= 0) { setValue(commandSuggestions[activeSuggestion].prefix + " "); setShowCommandPalette(false); }
      } else if (e.key === "Escape") { e.preventDefault(); setShowCommandPalette(false); }
    } else if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (value.trim()) handleSendMessage(); }
  };

  const handleSendMessage = () => {
    if (!value.trim()) return;
    startTransition(() => {
      setIsTyping(true);
      setTimeout(() => { setIsTyping(false); setValue(""); adjustHeight(true); }, 1800);
    });
  };

  return <div className="lab-bg min-h-[72vh] w-full rounded-3xl border border-neutral-800 bg-[#0a0a0b] text-white p-6 relative overflow-hidden">
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px] animate-pulse delay-700" />
    </div>
    <div className="w-full max-w-2xl mx-auto relative z-10 space-y-8">
      <h2 className="text-center text-2xl font-medium">PresetFolio Concierge</h2>
      <div className="relative backdrop-blur-2xl bg-white/[0.02] rounded-2xl border border-white/[0.05] shadow-2xl">
        <AnimatePresence>{showCommandPalette && <motion.div ref={commandPaletteRef} className="absolute left-4 right-4 bottom-full mb-2 backdrop-blur-xl bg-black/90 rounded-lg z-50 shadow-lg border border-white/10 overflow-hidden" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}><div className="py-1 bg-black/95">{commandSuggestions.map((s, i) => <motion.div key={s.prefix} className={cn("flex items-center gap-2 px-3 py-2 text-xs transition-colors cursor-pointer", activeSuggestion === i ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5")} onClick={() => { setValue(s.prefix + " "); setShowCommandPalette(false); }}>{s.icon}<div className="font-medium">{s.label}</div><div className="text-white/40 text-xs ml-1">{s.prefix}</div></motion.div>)}</div></motion.div>}</AnimatePresence>
        <div className="p-4"><Textarea ref={textareaRef} value={value} onChange={(e) => { setValue(e.target.value); adjustHeight(); }} onKeyDown={handleKeyDown} onFocus={() => setInputFocused(true)} onBlur={() => setInputFocused(false)} placeholder="Ask PresetFolio to refine your portfolio..." className="w-full px-4 py-3 resize-none bg-transparent border-none text-white/90 text-sm placeholder:text-white/20 min-h-[60px]" style={{ overflow: "hidden" }} showRing={false} /></div>
        {attachments.length > 0 && <div className="px-4 pb-3 flex gap-2 flex-wrap">{attachments.map((f, i) => <div key={i} className="flex items-center gap-2 text-xs bg-white/[0.03] py-1.5 px-3 rounded-lg text-white/70"><span>{f}</span><button onClick={() => setAttachments((p) => p.filter((_, idx) => idx !== i))}><XIcon className="w-3 h-3" /></button></div>)}</div>}
        <div className="p-4 border-t border-white/[0.05] flex items-center justify-between"><button type="button" onClick={() => setAttachments((p) => [...p, `portfolio-${Math.floor(Math.random() * 1000)}.pdf`])} className="p-2 text-white/60 hover:text-white"><Paperclip className="w-4 h-4" /></button><button onClick={handleSendMessage} disabled={isTyping || !value.trim()} className={cn("px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2", value.trim() ? "bg-white text-black" : "bg-white/[0.05] text-white/40")}>{isTyping ? <LoaderIcon className="w-4 h-4 animate-spin" /> : <SendIcon className="w-4 h-4" />}Send</button></div>
      </div>
    </div>
    {isTyping && <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-white/70">Thinking...</div>}
    {inputFocused && <motion.div className="fixed w-[40rem] h-[40rem] rounded-full pointer-events-none z-0 opacity-[0.03] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 blur-[96px]" animate={{ x: mousePosition.x - 320, y: mousePosition.y - 320 }} transition={{ type: "spring", damping: 25, stiffness: 150, mass: 0.5 }} />}
  </div>;
}
