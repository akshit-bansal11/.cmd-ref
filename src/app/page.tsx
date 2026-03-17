import Link from "next/link";
import Image from "next/image";
import { getAllTools, ToolData } from "@/lib/data";

export default async function Home() {
  const tools = await getAllTools();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 font-mono bg-[#0c0c0c] text-neutral-200 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -z-10 mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] -z-10 mix-blend-screen" />
      
      <div className="max-w-4xl w-full flex flex-col items-center z-10 space-y-16">
        
        {/* Hero Section */}
        <header className="text-center space-y-6">
          <div className="inline-block px-4 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/50 text-xs text-neutral-400 mb-4 tracking-wider uppercase font-semibold">
            Zero-Config Documentation
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-4">
            git_ref
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 max-w-lg mx-auto leading-relaxed">
            Every command. One place.
          </p>
        </header>

        {/* Tools Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {tools.length === 0 ? (
            <div className="col-span-full text-center py-12 text-neutral-500">
              No tools found in <code className="bg-neutral-900 px-2 py-1 rounded">src/data/</code>.
            </div>
          ) : (
            tools.map((tool: ToolData) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))
          )}
        </div>
        
      </div>
      
      {/* Footer */}
      <footer className="mt-24 text-center text-sm text-neutral-600">
        <p>Drop a .json file to add a new tool.</p>
      </footer>
    </main>
  );
}

function ToolCard({ tool }: { tool: ToolData }) {
  // Using custom properties for dynamic hover colors
  return (
    <Link 
      href={`/${tool.slug}`} 
      className="group relative flex flex-col p-6 rounded-2xl glass-card transition-all duration-300 hover:scale-[1.02] hover:bg-neutral-800/40 border-neutral-800 hover:-translate-y-1 overflow-hidden"
      style={{
        '--hover-color': tool.accent,
      } as React.CSSProperties}
    >
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at top right, ${tool.accent}, transparent 70%)` }}
      />
      <div 
        className="absolute top-0 right-0 w-24 h-24 blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity duration-300 z-0"
        style={{ backgroundColor: tool.accent }}
      />
      
      <div className="relative z-10 flex items-center mb-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 bg-neutral-900 border border-neutral-800 shadow-inner group-hover:border-opacity-50 transition-colors duration-300"
          style={{ borderColor: `color-mix(in srgb, ${tool.accent} 20%, transparent)` }}
        >
          <Image 
            src={tool.logo} 
            alt={`${tool.name} logo`} 
            width={24} 
            height={24} 
            className="group-hover:scale-110 transition-transform duration-300 drop-shadow-md"
          />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-100 group-hover:text-white transition-colors duration-300">
          {tool.name}
        </h2>
      </div>
      
      <p className="text-sm text-neutral-400 leading-relaxed mt-auto relative z-10 line-clamp-2">
        {tool.description || `${tool.name} developer commands and references.`}
      </p>

      {/* Border gradient on hover */}
      <div 
        className="absolute inset-x-0 bottom-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(to right, transparent, ${tool.accent}, transparent)` }}
      />
    </Link>
  );
}
