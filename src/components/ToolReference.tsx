"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Copy, Check, ChevronLeft, Command } from "lucide-react";
import type { ToolData, CommandCategory, ToolCommand } from "@/lib/data";

export default function ToolReference({ data }: { data: ToolData }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Handle Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setSearchQuery("");
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter commands
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return data.categories;
    
    const query = searchQuery.toLowerCase();
    
    return data.categories
      .map((cat: CommandCategory) => {
        const matchingCommands = cat.commands.filter((cmd: ToolCommand) => {
          return (
             cmd.command?.toLowerCase().includes(query) ||
             cmd.description?.toLowerCase().includes(query)
          );
        });
        return { ...cat, commands: matchingCommands };
      })
      .filter((cat: CommandCategory) => cat.commands.length > 0);
  }, [data.categories, searchQuery]);

  // Scroll spy
  useEffect(() => {
    if (searchQuery) return; // disable scroll spy while searching to prevent jank
    
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries.filter(e => e.isIntersecting);
        if (visibleSections.length > 0) {
          // Find the one closest to the top
          const closest = visibleSections.reduce((acc, curr) => 
            (curr.boundingClientRect.top < acc.boundingClientRect.top) ? curr : acc
          );
          setActiveCategory(closest.target.id);
        }
      },
      { rootMargin: "-100px 0px -60% 0px", threshold: 0 }
    );
    
    data.categories.forEach((cat: CommandCategory) => {
      const el = document.getElementById(getCategorySlug(cat.title));
      if (el) observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, [data.categories, searchQuery]);

  return (
    <div className="min-h-screen font-mono text-neutral-200">
      {/* Sticky Top Nav */}
      <header className="sticky top-0 z-50 w-full bg-stone-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-[200px]">
            <Link 
              href="/" 
              className="p-2 -ml-2 rounded-lg hover:bg-white/5 transition-colors text-neutral-400 hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10"
                style={{ backgroundColor: `color-mix(in srgb, ${data.accent} 10%, transparent)` }}
              >
                <Image src={data.logo} alt={data.name} width={20} height={20} className="drop-shadow-sm" />
              </div>
              <span className="font-semibold text-lg text-white tracking-tight">{data.name}</span>
            </div>
          </div>
          
          <div className="flex-1 max-w-lg relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-white transition-colors" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search commands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 bg-white/5 border border-white/10 rounded-xl pl-9 pr-12 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-neutral-600 outline-none"
              style={{ '--tw-ring-color': data.accent } as React.CSSProperties}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
              <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 text-[10px] font-medium text-neutral-400">
                <Command className="w-3 h-3" />K
              </kbd>
            </div>
          </div>
          
          <div className="w-[200px] hidden md:block" />
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 hidden md:block pt-8 pb-12 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto pr-6 border-r border-white/5">
          <nav className="flex flex-col gap-1 pl-4">
            {data.categories.map((cat: CommandCategory) => {
              const slug = getCategorySlug(cat.title);
              const isActive = activeCategory === slug;
              const hasVisibleCommands = filteredCategories.some((c: CommandCategory) => c.title === cat.title);
              
              if (!hasVisibleCommands) return null;

              return (
                <a
                  key={slug}
                  href={`#${slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`text-sm py-2 px-3 rounded-lg transition-colors duration-200 border-l-2 ${
                    isActive 
                      ? 'bg-neutral-800/50 text-white font-medium' 
                      : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900 border-transparent'
                  }`}
                  style={{
                    borderLeftColor: isActive ? data.accent : 'transparent'
                  }}
                >
                  {cat.title}
                </a>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-0 pt-8 pb-24 px-4 md:px-8 xl:px-12">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-20 text-neutral-500">
              No commands found matching &quot;{searchQuery}&quot;
            </div>
          ) : (
            <div className="space-y-16">
              {filteredCategories.map((cat: CommandCategory) => (
                <section 
                  key={cat.title} 
                  id={getCategorySlug(cat.title)}
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold tracking-tight text-white mb-6 flex items-center gap-3">
                    {cat.title}
                    <div className="h-px flex-1 bg-white/[0.03]" />
                  </h2>
                  <div className="grid gap-4">
                    {cat.commands.map((cmd: ToolCommand) => (
                      <CommandCard
                        key={`${cmd.command}-${cat.title}`}
                        cmd={cmd}
                        accent={data.accent}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function CommandCard({ cmd, accent }: { cmd: ToolCommand, accent: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    // Check if clipboard API is available (may not exist in SSR or non-secure contexts)
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      console.warn('Clipboard API not available');
      return;
    }

    try {
      await navigator.clipboard.writeText(cmd.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Optionally show error feedback to user
    }
  };

  return (
    <div 
      className="group rounded-xl border border-white/5 bg-stone-900/30 overflow-hidden hover:bg-stone-900/50 transition-colors focus-within:ring-1"
      style={{ '--tw-ring-color': accent } as React.CSSProperties}
    >
      <div className="p-4 sm:p-5">
        <div className="flex justify-between items-start gap-4 mb-3">
          <p className="text-sm text-neutral-400 leading-relaxed font-sans mt-0.5">
            {cmd.description}
          </p>
        </div>
        
        <div className="relative font-mono">
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#050505] border border-white/[0.03]">
            <code className="text-neutral-200 text-sm overflow-x-auto whitespace-pre no-scrollbar w-full relative z-0 pr-8">
              <span className="text-neutral-500 mr-2 select-none">$</span>
              {cmd.command}
            </code>
            <button
              onClick={handleCopy}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-white/10 text-neutral-500 hover:text-white transition-colors z-10"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4" style={{ color: accent }} /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Optional Flags / Chips */}
        {cmd.flags && cmd.flags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {cmd.flags.map((flag: string | {name: string, description?: string}, i: number) => (
              <span 
                key={i} 
                className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border border-white/10 bg-white/5 text-neutral-300"
              >
                {typeof flag === 'string' ? flag : flag.name}
              </span>
            ))}
          </div>
        )}
        
        {/* Optional Example */}
        {cmd.example && (
          <div className="mt-4 border-t border-white/5 pt-4">
             <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-2 block font-sans">Example</span>
             <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-sm text-neutral-300">
               {cmd.example}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getCategorySlug(title: string): string {
  // Handle empty or whitespace-only titles
  if (!title || !title.trim()) {
    console.error('Category title cannot be empty');
    return 'untitled-category';
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  // If slug is empty after processing (e.g., title was only special characters)
  if (!slug) {
    console.warn(`Generated empty slug from title: "${title}", using fallback`);
    return 'category';
  }

  return slug;
}
