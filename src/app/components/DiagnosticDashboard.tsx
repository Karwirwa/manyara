/**
 * Diagnostic Dashboard - Quick Access to All Diagnostic Tools
 */

import { Activity, TestTube, Image, GitBranch, FileSearch, ArrowRight } from 'lucide-react';

export function DiagnosticDashboard() {
  const tools = [
    {
      id: 'diagnostic',
      name: 'Sanity Diagnostic',
      description: 'Deep inspection of data structure and GROQ queries',
      icon: Activity,
      color: 'blue',
      url: '/?diagnostic=true',
      recommended: true,
      checks: [
        'Connection test',
        'Image dereferencing',
        'Colors & sizes validation',
        'Category references',
        'Description fields',
        'GROQ query verification'
      ]
    },
    {
      id: 'test-products',
      name: 'Product Data Test',
      description: 'Visual overview of all products with completeness indicators',
      icon: TestTube,
      color: 'purple',
      url: '/?test-products=true',
      checks: [
        'Product count statistics',
        'Image loading verification',
        'Data completeness grid',
        'Detail view with raw JSON'
      ]
    },
    {
      id: 'flow-diagram',
      name: 'Flow Diagram',
      description: 'Interactive architecture documentation and troubleshooting',
      icon: GitBranch,
      color: 'green',
      url: '/?flow-diagram=true',
      checks: [
        'Schema structure guide',
        'Data flow visualization',
        'Component mapping',
        'Troubleshooting guides'
      ]
    },
    {
      id: 'test-edge',
      name: 'Edge Function Tester',
      description: 'Backend API and Supabase function testing',
      icon: FileSearch,
      color: 'orange',
      url: '/?test-edge=true',
      checks: [
        'Supabase connection',
        'Edge function responses',
        'API endpoint health'
      ]
    }
  ];

  const ColorMap: Record<string, string> = {
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-400/50',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-400/50',
    green: 'from-green-500/20 to-green-600/20 border-green-400/50',
    orange: 'from-orange-500/20 to-orange-600/20 border-orange-400/50',
  };

  const IconColorMap: Record<string, string> = {
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    green: 'text-green-400',
    orange: 'text-orange-400',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-burgundy-wine to-olive-sage p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-ivory-pearl mb-4">
            🔧 Diagnostic Dashboard
          </h1>
          <p className="text-ivory-pearl/70 text-lg mb-6">
            Quick access to all diagnostic and testing tools for your MANYARA e-commerce site
          </p>
          
          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="text-sm text-ivory-pearl/60 mb-1">Sanity Project</div>
              <div className="text-lg font-bold text-champagne-gold">ximq2iuj</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="text-sm text-ivory-pearl/60 mb-1">Dataset</div>
              <div className="text-lg font-bold text-champagne-gold">production</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="text-sm text-ivory-pearl/60 mb-1">API Version</div>
              <div className="text-lg font-bold text-champagne-gold">2023-05-03</div>
            </div>
          </div>
        </div>

        {/* Recommended Workflow */}
        <div className="backdrop-blur-xl bg-gradient-to-r from-champagne-gold/20 to-champagne-gold/10 border border-champagne-gold/50 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-champagne-gold mb-4">
            ⭐ Recommended Workflow
          </h2>
          <div className="space-y-3 text-ivory-pearl/90">
            <div className="flex items-start gap-3">
              <div className="bg-champagne-gold/30 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="font-bold text-champagne-gold">1</span>
              </div>
              <div>
                <div className="font-bold text-champagne-gold">Run Sanity Diagnostic</div>
                <div className="text-sm text-ivory-pearl/70">
                  Identifies exact issues with your Sanity data structure
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-champagne-gold/30 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="font-bold text-champagne-gold">2</span>
              </div>
              <div>
                <div className="font-bold text-champagne-gold">Fix Issues in Sanity Studio</div>
                <div className="text-sm text-ivory-pearl/70">
                  Upload images, add colors/sizes, fill descriptions
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-champagne-gold/30 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="font-bold text-champagne-gold">3</span>
              </div>
              <div>
                <div className="font-bold text-champagne-gold">Verify with Product Test</div>
                <div className="text-sm text-ivory-pearl/70">
                  Visual confirmation that all data is displaying correctly
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-champagne-gold/30 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="font-bold text-champagne-gold">4</span>
              </div>
              <div>
                <div className="font-bold text-champagne-gold">Reference Flow Diagram</div>
                <div className="text-sm text-ivory-pearl/70">
                  Understand architecture and find troubleshooting guides
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                className={`backdrop-blur-xl bg-gradient-to-br ${ColorMap[tool.color]} border rounded-2xl p-6 hover:scale-[1.02] transition-transform cursor-pointer relative overflow-hidden`}
                onClick={() => window.location.href = tool.url}
              >
                {tool.recommended && (
                  <div className="absolute top-4 right-4 bg-champagne-gold/80 text-burgundy-wine text-xs font-bold px-3 py-1 rounded-full">
                    START HERE
                  </div>
                )}
                
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-xl bg-white/10 ${IconColorMap[tool.color]}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-ivory-pearl mb-2">
                      {tool.name}
                    </h3>
                    <p className="text-ivory-pearl/70">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {tool.checks.map((check, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-ivory-pearl/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-ivory-pearl/60"></div>
                      {check}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="text-xs text-ivory-pearl/50 font-mono">
                    {tool.url}
                  </div>
                  <ArrowRight className={`w-5 h-5 ${IconColorMap[tool.color]}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Links */}
        <div className="mt-8 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-ivory-pearl mb-4">
            📚 Quick Links
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="https://ximq2iuj.sanity.studio/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-champagne-gold/50 rounded-lg transition-all"
            >
              <Image className="w-5 h-5 text-champagne-gold" />
              <div>
                <div className="font-bold text-ivory-pearl">Sanity Studio</div>
                <div className="text-xs text-ivory-pearl/60">Edit products & content</div>
              </div>
            </a>
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-champagne-gold/50 rounded-lg transition-all"
            >
              <ArrowRight className="w-5 h-5 text-champagne-gold" />
              <div>
                <div className="font-bold text-ivory-pearl">Back to Home</div>
                <div className="text-xs text-ivory-pearl/60">Return to main site</div>
              </div>
            </button>
          </div>
        </div>

        {/* Console Commands */}
        <div className="mt-8 backdrop-blur-xl bg-black/30 border border-white/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-ivory-pearl mb-4">
            💻 Browser Console Commands
          </h3>
          <div className="space-y-2">
            {tools.map((tool) => (
              <div key={tool.id} className="font-mono text-sm">
                <span className="text-green-400">window.location.href</span>
                <span className="text-ivory-pearl/60"> = </span>
                <span className="text-yellow-300">'{tool.url}'</span>
                <span className="text-ivory-pearl/40"> // {tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
