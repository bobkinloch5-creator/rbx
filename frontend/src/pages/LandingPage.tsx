import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Zap, 
  Brain,
  TestTube2,
  ArrowRight,
  MessageSquare,
  Box,
  Boxes,
  FileCode,
  Search,
  Sparkles,
  Star,
  CheckCircle2
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'Natural Language Building',
      description: 'Just describe what you want to build, and watch the AI create it in real-time inside Roblox Studio.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Box className="w-6 h-6" />,
      title: '3D Preview & Explorer',
      description: 'Visualize your game in 3D, navigate the object hierarchy, and modify properties with an intuitive interface.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <FileCode className="w-6 h-6" />,
      title: 'Professional Lua Editor',
      description: 'Write and edit scripts with autocomplete, syntax highlighting, error detection, and instant fixes.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: 'Real Asset Browser',
      description: 'Browse millions of real Roblox models, meshes, and assets. Insert them directly into your game with AI assistance.',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'Context-Aware AI',
      description: 'The AI analyzes your entire project structure before making changes, ensuring intelligent and coherent updates.',
      gradient: 'from-violet-500 to-purple-500'
    },
    {
      icon: <TestTube2 className="w-6 h-6" />,
      title: 'Smart Testing & Debugging',
      description: 'Test your game instantly, get detailed error analysis, and receive AI-powered fix suggestions.',
      gradient: 'from-yellow-500 to-orange-500'
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Install the Plugin',
      description: 'Download and install our Roblox Studio plugin to enable seamless communication.',
      icon: <Code2 className="w-8 h-8" />
    },
    {
      step: '02',
      title: 'Connect Your Project',
      description: 'Open your game in Roblox Studio and connect it to the web app with one click.',
      icon: <Zap className="w-8 h-8" />
    },
    {
      step: '03',
      title: 'Build with AI',
      description: 'Describe what you want in natural language and watch your game come to life.',
      icon: <Sparkles className="w-8 h-8" />
    }
  ];

  const benefits = [
    '10x faster game development',
    'No coding experience required',
    'Real-time collaboration',
    'Professional code generation',
    'Built-in testing & debugging',
    'Unlimited iterations'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-roblox-red/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/10 backdrop-blur-xl bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Boxes className="w-8 h-8 text-roblox-red" />
              <div className="absolute inset-0 blur-lg bg-roblox-red/30"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">BlockForge</span>
          </div>
          <button 
            onClick={() => navigate('/builder')}
            className="group relative px-6 py-3 bg-gradient-to-r from-roblox-red to-red-600 rounded-xl font-semibold text-white shadow-lg shadow-roblox-red/50 hover:shadow-xl hover:shadow-roblox-red/60 transition-all duration-300 hover:scale-105"
          >
            <span className="flex items-center space-x-2">
              <span>Launch Builder</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-roblox-red/10 border border-roblox-red/30 rounded-full mb-6">
              <Star className="w-4 h-4 text-roblox-red fill-roblox-red" />
              <span className="text-sm font-semibold text-roblox-red">AI-Powered Game Development</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
              Build Roblox Games
              <br />
              <span className="bg-gradient-to-r from-roblox-red via-orange-500 to-yellow-500 bg-clip-text text-transparent animate-gradient">
                10x Faster
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              The ultimate AI-powered game builder that connects to <span className="text-white font-semibold">Roblox Studio</span>. 
              Create, test, and deploy real games using simple prompts.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => navigate('/builder')}
                className="group relative px-8 py-4 bg-gradient-to-r from-roblox-red to-red-600 rounded-xl font-bold text-lg text-white shadow-2xl shadow-roblox-red/50 hover:shadow-roblox-red/70 transition-all duration-300 hover:scale-105"
              >
                <span className="flex items-center space-x-2">
                  <Boxes className="w-6 h-6" />
                  <span>Start Building Free</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              
              <a 
                href="#features" 
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl font-bold text-lg text-white backdrop-blur-sm transition-all duration-300"
              >
                See How It Works
              </a>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-400">
              {benefits.map((benefit, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                  className="flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="relative max-w-6xl mx-auto"
          >
            <div className="relative glass rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-roblox-red/5 to-blue-500/5"></div>
              <div className="relative p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-400 ml-4">BlockForge Builder</span>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-6 border border-white/5">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-roblox-red to-orange-500 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-400 mb-2">You</div>
                      <div className="bg-slate-800 rounded-lg p-4 text-white">
                        Create a parkour obby with 10 levels that get progressively harder
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-400 mb-2">BlockForge AI</div>
                      <div className="bg-slate-800 rounded-lg p-4">
                        <div className="text-white mb-3">Creating your parkour obby! Here's what I'm building:</div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2 text-green-400">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>10 platforms with increasing difficulty</span>
                          </div>
                          <div className="flex items-center space-x-2 text-green-400">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Spawn point and checkpoint system</span>
                          </div>
                          <div className="flex items-center space-x-2 text-yellow-400">
                            <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                            <span>Adding winning platform and effects...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              Everything you need to build
              <br />
              <span className="bg-gradient-to-r from-roblox-red to-orange-500 bg-clip-text text-transparent">amazing games</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Powerful features designed to supercharge your game development workflow
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="group relative glass rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl from-white to-transparent"></div>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-20 px-6 bg-gradient-to-b from-transparent via-roblox-red/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              Get started in
              <span className="bg-gradient-to-r from-roblox-red to-orange-500 bg-clip-text text-transparent"> 3 simple steps</span>
            </h2>
            <p className="text-xl text-gray-400">From idea to playable game in minutes</p>
          </motion.div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="relative glass rounded-2xl p-8 border border-white/10 flex items-center space-x-6 hover:border-white/20 transition-all"
              >
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-roblox-red to-orange-500 flex items-center justify-center shadow-2xl">
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white text-black font-bold flex items-center justify-center text-sm">
                      {step.step}
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-white">{step.title}</h3>
                  <p className="text-gray-400 text-lg">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative glass rounded-3xl p-12 border border-white/10 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-roblox-red/20 via-transparent to-blue-500/20"></div>
            <div className="relative">
              <Zap className="w-16 h-16 text-roblox-red mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to revolutionize your game development?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of developers building better games faster with BlockForge
              </p>
              <button 
                onClick={() => navigate('/builder')}
                className="group relative px-10 py-5 bg-gradient-to-r from-roblox-red to-red-600 rounded-xl font-bold text-xl text-white shadow-2xl shadow-roblox-red/50 hover:shadow-roblox-red/70 transition-all duration-300 hover:scale-105"
              >
                <span className="flex items-center space-x-3">
                  <Boxes className="w-6 h-6" />
                  <span>Start Building Free</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Boxes className="w-6 h-6 text-roblox-red" />
            <span className="text-xl font-bold">BlockForge</span>
          </div>
          <p className="text-gray-400">Built with AI for the Roblox community</p>
        </div>
      </footer>
    </div>
  );
}
