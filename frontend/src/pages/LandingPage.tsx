import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Brain,
  TestTube2,
  ArrowRight,
  Box,
  FileCode,
  Search,
  Sparkles,
  CheckCircle2,
  Gamepad2,
  Wand2,
  Layers,
  Smile,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleStartBuilding = (initialPrompt?: string) => {
    if (initialPrompt) {
      localStorage.setItem('blockforge-initial-prompt', initialPrompt);
    }
    navigate('/builder');
  };

  const templates = [
    {
      title: 'Rainbow Cloud Obby',
      tag: 'Most Popular',
      category: 'Obstacle Course',
      image: '/images/template-obby.png',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      description: '10 progressively challenging floating neon stages with cloud checkpoints, animated coin rewards, and leaderboard.',
      prompt: 'Create a vibrant 10-stage rainbow cloud parkour obby with neon platforms, checkpoints, and coin rewards.'
    },
    {
      title: 'Cozy Town & Pet Shop',
      tag: 'Trending RPG',
      category: 'Roleplay Simulator',
      image: '/images/template-town.png',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      description: 'Charming neighborhood with customizable cottages, working pet adoption shop, interactive NPC dialogues, and currency system.',
      prompt: 'Create a cozy town roleplay game with a pet shop, currency economy, customizable houses, and friendly NPCs.'
    },
    {
      title: 'Fantasy Studio Island',
      tag: 'Adventure',
      category: 'World Explorer',
      image: '/images/builder-showcase.png',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      description: 'Floating sky realm with castle spires, slide ramps, magical particle fountains, and real-time Roblox Studio sync.',
      prompt: 'Build a magical floating island kingdom with castles, parkour slides, and particle effect shrines.'
    }
  ];

  const features = [
    {
      icon: <Wand2 className="w-6 h-6 text-cyan-400" />,
      title: 'Natural Language Creation',
      description: 'Say "Add a spinning hammer obstacle" or "Make a shop with 5 pets". The AI generates full 3D parts and scripts instantly.',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      border: 'border-cyan-500/30'
    },
    {
      icon: <Box className="w-6 h-6 text-purple-400" />,
      title: 'Live 3D Object Hierarchy',
      description: 'Inspect workspace items, edit properties in real-time, and position parts with visual precision.',
      gradient: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/30'
    },
    {
      icon: <FileCode className="w-6 h-6 text-emerald-400" />,
      title: 'Safe, Clean Luau Scripts',
      description: 'Generates professional, documented Roblox Luau scripts following best practices with zero deprecated methods.',
      gradient: 'from-emerald-500/20 to-teal-500/20',
      border: 'border-emerald-500/30'
    },
    {
      icon: <Search className="w-6 h-6 text-amber-400" />,
      title: 'Official Roblox Asset Search',
      description: 'Powered by Roblox Open Cloud API. Search and insert genuine Roblox models, decals, audio, and meshes with 1 click.',
      gradient: 'from-amber-500/20 to-orange-500/20',
      border: 'border-amber-500/30'
    },
    {
      icon: <Brain className="w-6 h-6 text-rose-400" />,
      title: 'Context-Aware Game Architect',
      description: 'The AI understands your existing game hierarchy before making changes, preventing duplicate or broken parts.',
      gradient: 'from-rose-500/20 to-red-500/20',
      border: 'border-rose-500/30'
    },
    {
      icon: <TestTube2 className="w-6 h-6 text-indigo-400" />,
      title: 'Instant Studio Test Runner',
      description: 'Simulate tests directly inside Roblox Studio, read execution logs, and auto-fix script errors instantly.',
      gradient: 'from-indigo-500/20 to-blue-500/20',
      border: 'border-indigo-500/30'
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Install Studio Plugin',
      description: 'Drop our lightweight BlockForge companion plugin into Roblox Studio to establish a secure two-way live link.',
      icon: <Code2 className="w-7 h-7 text-roblox-red" />
    },
    {
      step: '02',
      title: 'Describe Your Dream Game',
      description: 'Chat with Bolt, your friendly AI co-builder. Type your ideas in plain English, choose a template, or ask for features.',
      icon: <Smile className="w-7 h-7 text-amber-400" />
    },
    {
      step: '03',
      title: 'Play and Publish',
      description: 'Watch parts, models, and scripts materialize live in your Studio viewport. Test with friends and publish to Roblox!',
      icon: <Gamepad2 className="w-7 h-7 text-emerald-400" />
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden font-sans selection:bg-roblox-red selection:text-white">
      {/* Background Glows & Mesh Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-red-600/15 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] bg-cyan-500/15 rounded-full blur-[150px]" />
        <div className="absolute -bottom-40 left-1/3 w-[650px] h-[650px] bg-purple-600/15 rounded-full blur-[160px]" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-slate-950/70 border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="relative group">
              <img 
                src="/images/logo.png" 
                alt="BlockForge Logo" 
                className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-roblox-red/25 border border-white/20 group-hover:scale-105 transition-transform" 
              />
              <div className="absolute -inset-1 rounded-xl bg-roblox-red/30 blur opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                BlockForge
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-roblox-red/20 text-roblox-red border border-roblox-red/30 rounded-md">
                Roblox AI
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <a href="#templates" className="hover:text-white transition-colors">Templates</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#ai-guide" className="hover:text-white transition-colors">Meet Bolt AI</a>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => handleStartBuilding()}
              className="group relative px-5 py-2.5 bg-gradient-to-r from-roblox-red via-red-500 to-orange-500 rounded-xl font-bold text-sm text-white shadow-lg shadow-roblox-red/40 hover:shadow-xl hover:shadow-roblox-red/60 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Launch Builder</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto mb-14"
          >
            {/* Friendly Mascot Badge */}
            <div className="inline-flex items-center space-x-3 px-4 py-2 bg-slate-900/80 border border-white/10 rounded-full mb-8 shadow-xl backdrop-blur-md hover:border-roblox-red/40 transition-colors">
              <img 
                src="/images/mascot.png" 
                alt="Bolt AI Mascot" 
                className="w-7 h-7 rounded-full object-cover border border-cyan-400/50 shadow-sm"
              />
              <span className="text-xs sm:text-sm font-medium text-slate-200">
                Meet <strong className="text-white font-semibold">Bolt</strong> — Your Friendly Roblox AI Co-Builder
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.08] mb-6">
              Build Roblox Games
              <br />
              <span className="bg-gradient-to-r from-roblox-red via-orange-400 to-amber-300 bg-clip-text text-transparent">
                With Pure AI Magic
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
              No tricky coding needed. Describe any game world in plain English, and watch our friendly AI generate real 3D models, obstacles, and scripts live in <span className="text-white font-semibold underline decoration-roblox-red/50 underline-offset-4">Roblox Studio</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => handleStartBuilding()}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-roblox-red via-red-500 to-orange-500 rounded-2xl font-bold text-lg text-white shadow-2xl shadow-roblox-red/50 hover:shadow-roblox-red/70 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center space-x-3"
              >
                <Sparkles className="w-5 h-5" />
                <span>Start Building Free</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <a 
                href="#templates" 
                className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/15 rounded-2xl font-semibold text-lg text-slate-200 backdrop-blur-md transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Gamepad2 className="w-5 h-5 text-amber-400" />
                <span>Explore Game Templates</span>
              </a>
            </div>

            {/* Trust Points */}
            <div className="mt-10 flex flex-wrap justify-center items-center gap-6 text-xs sm:text-sm text-slate-400">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Coding Experience Needed</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Live Roblox Studio Sync</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Genuine Roblox Catalog Assets</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Visual Image with Interactive UI Overlays */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            className="relative max-w-6xl mx-auto"
          >
            <div className="relative rounded-3xl p-2 sm:p-3 bg-gradient-to-b from-white/20 via-white/5 to-transparent shadow-2xl backdrop-blur-2xl">
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-white/10 group">
                <img 
                  src="/images/hero.png" 
                  alt="BlockForge AI and Roblox Avatars Building Together" 
                  className="w-full h-auto object-cover max-h-[640px] transition-transform duration-700 group-hover:scale-[1.01]" 
                />

                {/* Dark Vignette Overlay for Crisp Floating Badges */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />

                {/* Floating Top Bar Mockup */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center space-x-2 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Roblox Studio Connected: <strong>Session Active</strong></span>
                  </div>
                  <div className="hidden sm:flex items-center space-x-2 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs text-slate-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>AI Model: <strong>GPT-5.6 Sol / Claude</strong></span>
                  </div>
                </div>

                {/* Floating Prompt & Generation Pill */}
                <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto">
                  <div className="bg-slate-950/90 backdrop-blur-xl border border-white/20 rounded-2xl p-4 max-w-xl shadow-2xl">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-6 h-6 rounded-full bg-roblox-red flex items-center justify-center text-[10px] font-bold">
                        AI
                      </div>
                      <span className="text-xs font-semibold text-slate-300">Live Roblox Prompt</span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full font-mono">
                        Generated in 1.4s
                      </span>
                    </div>
                    <p className="text-sm font-medium text-white">
                      "Spawn 10 rainbow obby platforms, add cloud checkpoints, and setup leaderstats for score tracking."
                    </p>
                  </div>

                  <button 
                    onClick={() => handleStartBuilding("Create a parkour obby with 10 levels and checkpoints")}
                    className="w-full sm:w-auto px-6 py-3.5 bg-white text-slate-950 hover:bg-slate-100 rounded-xl font-bold text-sm shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2 flex-shrink-0"
                  >
                    <span>Try This Prompt</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Templates Showcase Section */}
      <section id="templates" className="relative py-24 px-6 z-10 bg-slate-900/40 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full mb-4 text-xs font-semibold text-amber-400">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Instant Game Templates</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
              Choose a template. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
                Customize anything with AI.
              </span>
            </h2>
            <p className="text-slate-400 text-lg">
              Start with high-converting, proven Roblox game designs and ask Bolt to change colors, rules, obstacles, or mechanics.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {templates.map((tpl, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="group relative bg-slate-900/80 rounded-3xl border border-white/10 overflow-hidden hover:border-white/25 transition-all duration-300 hover:shadow-2xl hover:shadow-roblox-red/10 flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                  <img 
                    src={tpl.image} 
                    alt={tpl.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${tpl.badgeColor}`}>
                      {tpl.tag}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">{tpl.category}</span>
                    <h3 className="text-xl font-bold text-white mt-0.5">{tpl.title}</h3>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {tpl.description}
                  </p>

                  <button
                    onClick={() => handleStartBuilding(tpl.prompt)}
                    className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-roblox-red text-white text-sm font-bold border border-white/10 hover:border-roblox-red transition-all duration-200 flex items-center justify-center space-x-2 group-hover:shadow-lg group-hover:shadow-roblox-red/30"
                  >
                    <span>Build This Game</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Bolt AI Companion Section */}
      <section id="ai-guide" className="relative py-24 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 rounded-3xl border border-white/10 p-8 sm:p-14 overflow-hidden relative shadow-2xl">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-roblox-red/20 rounded-full blur-3xl pointer-events-none" />

            <div className="grid lg:grid-cols-12 gap-10 items-center relative z-10">
              <div className="lg:col-span-5 text-center">
                <div className="relative inline-block">
                  <img 
                    src="/images/mascot.png" 
                    alt="Bolt AI Mascot" 
                    className="w-72 h-72 sm:w-80 sm:h-80 mx-auto rounded-3xl object-cover shadow-2xl border-2 border-white/20 hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-slate-950/90 border border-white/20 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg text-xs font-semibold text-cyan-300 flex items-center space-x-2 whitespace-nowrap">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Hi, I'm Bolt! Your AI Builder</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-roblox-red/10 border border-roblox-red/30 rounded-full mb-4 text-xs font-semibold text-roblox-red">
                  <Smile className="w-3.5 h-3.5" />
                  <span>Beginner & Pro Friendly</span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-6">
                  Like having a seasoned Roblox developer sitting right next to you.
                </h2>

                <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
                  Whether you're making your very first obstacle course or building a complex combat simulator, Bolt understands your questions, troubleshoots Studio errors, and executes game code flawlessly.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center space-x-3 mb-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <h4 className="font-bold text-white text-sm">Anti-Broken Scripts</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Every generated script is strictly checked for valid Roblox API methods and clean structure.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center space-x-3 mb-2">
                      <Layers className="w-5 h-5 text-cyan-400" />
                      <h4 className="font-bold text-white text-sm">Real Asset Library</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Searches verified community models, mesh parts, audio, and decals directly from Roblox.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative py-24 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
              Everything required to build
              <br />
              <span className="bg-gradient-to-r from-roblox-red to-orange-400 bg-clip-text text-transparent">
                top-charting Roblox games
              </span>
            </h2>
            <p className="text-slate-400 text-lg">
              Engineered specifically for Roblox developers, creators, and studio teams.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                viewport={{ once: true }}
                className={`group relative rounded-3xl p-8 bg-slate-900/60 border ${feature.border} hover:border-white/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 border border-white/10`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2.5 text-white">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Steps */}
      <section id="how-it-works" className="relative py-24 px-6 z-10 bg-slate-900/30 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
              Go from idea to gameplay in
              <span className="text-roblox-red"> 3 steps</span>
            </h2>
            <p className="text-slate-400 text-lg">Get building in under two minutes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                viewport={{ once: true }}
                className="relative bg-slate-900/90 rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                      {step.icon}
                    </div>
                    <span className="text-3xl font-black text-slate-700 font-mono">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="relative py-24 px-6 z-10">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl p-10 sm:p-16 bg-gradient-to-r from-roblox-red/20 via-orange-500/10 to-purple-600/20 border border-white/15 text-center overflow-hidden backdrop-blur-2xl shadow-2xl">
            <div className="relative z-10 max-w-2xl mx-auto">
              <img 
                src="/images/logo.png" 
                alt="BlockForge" 
                className="w-16 h-16 rounded-2xl mx-auto mb-6 shadow-xl shadow-roblox-red/40 border border-white/20"
              />
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-white">
                Start Building Your Roblox Game Today
              </h2>
              <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
                Connect your studio and unleash infinite creations with natural language AI.
              </p>
              
              <button 
                onClick={() => handleStartBuilding()}
                className="px-10 py-5 bg-gradient-to-r from-roblox-red via-red-500 to-orange-500 rounded-2xl font-bold text-lg text-white shadow-2xl shadow-roblox-red/50 hover:shadow-roblox-red/70 transition-all duration-300 hover:scale-105 active:scale-95 inline-flex items-center space-x-3"
              >
                <Sparkles className="w-5 h-5" />
                <span>Launch BlockForge Builder</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-white/10 z-10 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <img src="/images/logo.png" alt="BlockForge" className="w-7 h-7 rounded-lg object-cover" />
            <span className="font-bold text-white">BlockForge AI</span>
            <span>— The friendly AI Roblox game creator.</span>
          </div>

          <div className="flex items-center space-x-6 text-xs text-slate-500">
            <span>Powered by Roblox Open Cloud & OpenAI Compatible Models</span>
            <span>Made for Creators</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
