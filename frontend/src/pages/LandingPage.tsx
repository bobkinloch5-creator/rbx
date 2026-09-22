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
  Search
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'Natural Language Building',
      description: 'Just describe what you want to build, and watch the AI create it in real-time inside Roblox Studio.'
    },
    {
      icon: <Box className="w-6 h-6" />,
      title: '3D Preview & Explorer',
      description: 'Visualize your game in 3D, navigate the object hierarchy, and modify properties with an intuitive interface.'
    },
    {
      icon: <FileCode className="w-6 h-6" />,
      title: 'Professional Lua Editor',
      description: 'Write and edit scripts with autocomplete, syntax highlighting, error detection, and instant fixes.'
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: 'Real Asset Browser',
      description: 'Browse millions of real Roblox models, meshes, and assets. Insert them directly into your game with AI assistance.'
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'Context-Aware AI',
      description: 'The AI analyzes your entire project structure before making changes, ensuring intelligent and coherent updates.'
    },
    {
      icon: <TestTube2 className="w-6 h-6" />,
      title: 'Smart Testing & Debugging',
      description: 'Test your game instantly, get detailed error analysis, and receive AI-powered fix suggestions.'
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Install the Plugin',
      description: 'Download and install our Roblox Studio plugin to enable seamless communication.'
    },
    {
      step: '02',
      title: 'Connect Your Project',
      description: 'Open your game in Roblox Studio and connect it to the web app with one click.'
    },
    {
      step: '03',
      title: 'Build with AI',
      description: 'Describe what you want in natural language and watch your game come to life.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-roblox-darker via-roblox-dark to-roblox-darker">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Boxes className="w-8 h-8 text-roblox-red" />
            <span className="text-2xl font-bold">BlockForge</span>
          </div>
          <button 
            onClick={() => navigate('/builder')}
            className="btn-primary flex items-center space-x-2"
          >
            <span>Launch Builder</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Build Roblox Games with
              <br />
              <span className="text-gradient">BlockForge AI</span>
            </h1>
            <p className="text-xl md:text-2xl text-roblox-light mb-8 max-w-3xl mx-auto">
              The ultimate AI-powered game builder that connects to Roblox Studio. 
              Create, test, and deploy real games using simple prompts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/builder')}
                className="btn-primary text-lg flex items-center justify-center space-x-2"
              >
                <Boxes className="w-5 h-5" />
                <span>Start Building Now</span>
              </button>
              <a 
                href="#features" 
                className="btn-secondary text-lg flex items-center justify-center space-x-2"
              >
                <span>See Features</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-16 relative"
          >
            <div className="glass rounded-2xl p-8 max-w-5xl mx-auto">
              <div className="aspect-video bg-gradient-to-br from-roblox-red/20 to-orange-500/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Code2 className="w-20 h-20 text-roblox-red mx-auto mb-4" />
                  <p className="text-xl text-roblox-light">
                    "Create a parkour obby with 10 levels and a leaderboard"
                  </p>
                  <div className="mt-4 flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-roblox-red rounded-full animate-pulse"></div>
                    <span className="text-sm text-roblox-light">Building in real-time...</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-roblox-dark/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to Build Games
            </h2>
            <p className="text-xl text-roblox-light">
              Professional tools powered by AI that understand your vision
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass p-6 rounded-xl hover:border-roblox-red/50 transition-all"
              >
                <div className="w-12 h-12 bg-roblox-red/20 rounded-lg flex items-center justify-center text-roblox-red mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-roblox-light">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-roblox-light">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="glass p-8 rounded-xl h-full">
                  <div className="text-6xl font-bold text-roblox-red/20 mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-roblox-light">{item.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-roblox-red" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass p-12 rounded-2xl"
          >
            <Zap className="w-16 h-16 text-roblox-red mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Build Your Dream Game?
            </h2>
            <p className="text-xl text-roblox-light mb-8">
              Join thousands of developers using AI to create amazing Roblox experiences
            </p>
            <button 
              onClick={() => navigate('/builder')}
              className="btn-primary text-lg flex items-center justify-center space-x-2 mx-auto"
            >
              <Boxes className="w-5 h-5" />
              <span>Start Building Free</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-roblox-light">
          <p>BlockForge - Built with AI for the Roblox community</p>
        </div>
      </footer>
    </div>
  );
}
