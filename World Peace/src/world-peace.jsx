import React, { useState, useEffect } from 'react';
import { Menu, X, Heart, Globe, Users, BookOpen, MessageCircle, Award, Calendar, ArrowRight, Handshake, TreePine } from 'lucide-react';

// Custom CSS Styles
const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }

  @keyframes pulse-soft {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes spin-slow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes gradient-shift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .animate-fade-in {
    animation: fadeIn 1s ease-out;
  }

  .animate-float {
    animation: float 3s ease-in-out infinite;
  }

  .animate-pulse-soft {
    animation: pulse-soft 2s ease-in-out infinite;
  }

  .animate-slide-in-left {
    animation: slideInLeft 0.8s ease-out;
  }

  .animate-slide-in-right {
    animation: slideInRight 0.8s ease-out;
  }

  .animate-spin-slow {
    animation: spin-slow 20s linear infinite;
  }

  .gradient-animate {
    background-size: 200% 200%;
    animation: gradient-shift 15s ease infinite;
  }

  .card-hover {
    transition: all 0.3s ease;
  }

  .card-hover:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }

  .glow-effect {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
  }

  .text-gradient {
    background: linear-gradient(135deg, #3b82f6, #10b981);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .peace-button {
    position: relative;
    overflow: hidden;
  }

  .peace-button::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  .peace-button:hover::before {
    width: 300px;
    height: 300px;
  }

  .glass-effect {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .section-reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }

  .section-reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .ripple-effect {
    position: relative;
    overflow: hidden;
  }

  .ripple-effect::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(59, 130, 246, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.8s ease, height 0.8s ease;
  }

  .ripple-effect:hover::after {
    width: 500px;
    height: 500px;
  }

  .peaceful-gradient {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    background-size: 200% 200%;
    animation: gradient-shift 10s ease infinite;
  }

  .quote-transition {
    transition: opacity 1s ease-in-out, transform 1s ease-in-out;
  }

  .shadow-glow {
    box-shadow: 0 10px 40px rgba(59, 130, 246, 0.3);
  }

  .shadow-glow-green {
    box-shadow: 0 10px 40px rgba(16, 185, 129, 0.3);
  }
`;

export default function WorldPeaceWebsite() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [peaceCount, setPeaceCount] = useState(145820);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Animated peace pledge counter
    const interval = setInterval(() => {
      setPeaceCount(prev => prev + Math.floor(Math.random() * 3));
    }, 3000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(sectionId);
    setIsMenuOpen(false);
  };

  const initiatives = [
    {
      icon: <BookOpen className="w-10 h-10" />,
      title: "Peace Education",
      description: "Teaching conflict resolution, empathy, and understanding in schools worldwide",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: "Community Building",
      description: "Fostering dialogue and connection between diverse communities",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Handshake className="w-10 h-10" />,
      title: "Conflict Mediation",
      description: "Supporting peaceful resolution of disputes at all levels",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Globe className="w-10 h-10" />,
      title: "Global Cooperation",
      description: "Promoting international understanding and collaboration",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <TreePine className="w-10 h-10" />,
      title: "Environmental Peace",
      description: "Protecting our planet as the foundation for lasting peace",
      color: "from-teal-500 to-green-500"
    },
    {
      icon: <Heart className="w-10 h-10" />,
      title: "Humanitarian Aid",
      description: "Providing support and resources to communities in need",
      color: "from-rose-500 to-pink-500"
    }
  ];

  const stories = [
    {
      title: "Youth Peace Summit 2024",
      location: "Geneva, Switzerland",
      date: "October 2024",
      description: "Over 500 young leaders gathered to discuss sustainable peace initiatives",
      image: "🌍"
    },
    {
      title: "Community Dialogue Success",
      location: "Multiple Countries",
      date: "September 2024",
      description: "Facilitated 1,000+ community dialogues bridging cultural divides",
      image: "🤝"
    },
    {
      title: "Peace Education Program",
      location: "Global",
      date: "Ongoing",
      description: "Reached 2 million students with peace and empathy curriculum",
      image: "📚"
    }
  ];

  const quotes = [
    {
      text: "Peace is not merely the absence of war; it is the presence of justice.",
      author: "Martin Luther King Jr."
    },
    {
      text: "If we have no peace, it is because we have forgotten that we belong to each other.",
      author: "Mother Teresa"
    },
    {
      text: "Peace begins with a smile.",
      author: "Mother Teresa"
    },
    {
      text: "An eye for an eye only ends up making the whole world blind.",
      author: "Mahatma Gandhi"
    }
  ];

  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 6000);
    return () => clearInterval(quoteInterval);
  }, []);

  const [pledgeData, setPledgeData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handlePledgeSubmit = () => {
    if (pledgeData.name && pledgeData.email) {
      alert(`Thank you, ${pledgeData.name}! Your pledge for peace has been recorded. Together, we can make a difference! 🕊️`);
      setPledgeData({ name: '', email: '', message: '' });
    } else {
      alert('Please fill in your name and email to take the peace pledge.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <style>{styles}</style>
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-white/80 backdrop-blur-lg'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Globe className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">World Peace Initiative</span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              {['home', 'initiatives', 'stories', 'get-involved'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`capitalize transition-colors font-medium ${
                    activeSection === section 
                      ? 'text-blue-600' 
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {section.replace('-', ' ')}
                </button>
              ))}
            </div>

            <button
              className="md:hidden text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {['home', 'initiatives', 'stories', 'get-involved'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="block w-full text-left px-3 py-2 capitalize text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                >
                  {section.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6 animate-float">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400 rounded-full blur-3xl opacity-30 animate-pulse-soft"></div>
                <Globe className="w-24 h-24 text-blue-600 relative animate-spin-slow" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 animate-slide-in-left">
              Building a World of
              <span className="block text-gradient">
                Peace & Harmony
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-slide-in-right">
              Together, we can create a future where understanding, compassion, and cooperation 
              replace conflict. Join millions working toward lasting global peace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => scrollToSection('get-involved')}
                className="peace-button px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full font-semibold hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Take the Peace Pledge
                <Heart className="w-5 h-5" />
              </button>
              <button 
                onClick={() => scrollToSection('initiatives')}
                className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300 border-2 border-blue-600 flex items-center justify-center gap-2"
              >
                Learn More
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Peace Counter */}
          <div className="text-center bg-gradient-to-r from-blue-100 to-green-100 rounded-3xl p-8 max-w-md mx-auto shadow-glow">
            <div className="text-5xl font-bold text-blue-600 mb-2">
              {peaceCount.toLocaleString()}
            </div>
            <div className="text-gray-600 font-medium">Peace Pledges Worldwide</div>
          </div>
        </div>
      </section>

      {/* Inspirational Quote Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 gradient-animate bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center">
          <div className="quote-transition">
            <p className="text-2xl md:text-3xl text-white font-light italic mb-4">
              "{quotes[currentQuote].text}"
            </p>
            <p className="text-white/90 font-medium">— {quotes[currentQuote].author}</p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: <Users className="w-12 h-12" />, number: "195", label: "Countries Reached", color: "blue" },
              { icon: <Heart className="w-12 h-12" />, number: "5M+", label: "Lives Impacted", color: "red" },
              { icon: <BookOpen className="w-12 h-12" />, number: "10K+", label: "Peace Programs", color: "green" },
              { icon: <Award className="w-12 h-12" />, number: "500+", label: "Partner Organizations", color: "purple" }
            ].map((stat, index) => (
              <div key={index} className="card-hover text-center p-8 bg-white rounded-2xl shadow-lg">
                <div className={`text-${stat.color}-600 mb-4 flex justify-center animate-float`} style={{animationDelay: `${index * 0.2}s`}}>
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-gray-800 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Initiatives Section */}
      <section id="initiatives" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-4">
            Our Peace Initiatives
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Comprehensive programs addressing the root causes of conflict and building sustainable peace
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {initiatives.map((initiative, index) => (
              <div
                key={index}
                className="card-hover ripple-effect p-8 bg-white rounded-2xl shadow-lg"
              >
                <div className={`bg-gradient-to-r ${initiative.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-4 shadow-glow`}>
                  {initiative.icon}
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  {initiative.title}
                </h3>
                <p className="text-gray-600">{initiative.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stories Section */}
      <section id="stories" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-4">
            Stories of Hope
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Real impact, real change, real people making peace possible
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stories.map((story, index) => (
              <div
                key={index}
                className="card-hover bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="peaceful-gradient h-48 flex items-center justify-center text-8xl">
                  {story.image}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Calendar className="w-4 h-4" />
                    {story.date}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {story.title}
                  </h3>
                  <p className="text-blue-600 text-sm mb-3">{story.location}</p>
                  <p className="text-gray-600">{story.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section id="get-involved" className="py-20 px-4 sm:px-6 lg:px-8 peaceful-gradient">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Take the Peace Pledge
            </h2>
            <p className="text-white/90 text-lg">
              Join thousands of global citizens committed to creating a more peaceful world
            </p>
          </div>
          
          <div className="glass-effect rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="mb-8 p-6 bg-white/20 backdrop-blur-sm rounded-2xl border-l-4 border-white">
              <h3 className="font-semibold text-white mb-3 text-lg">I pledge to:</h3>
              <ul className="space-y-2 text-white/90">
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">•</span>
                  <span>Practice empathy and understanding in my daily interactions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">•</span>
                  <span>Seek peaceful solutions to conflicts in my community</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">•</span>
                  <span>Respect diversity and celebrate our common humanity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">•</span>
                  <span>Speak out against injustice and violence</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">•</span>
                  <span>Contribute to building a culture of peace</span>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">Your Name</label>
                <input
                  type="text"
                  value={pledgeData.name}
                  onChange={(e) => setPledgeData({...pledgeData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-lg text-white placeholder-white/60 focus:border-white focus:outline-none transition-colors"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Your Email</label>
                <input
                  type="email"
                  value={pledgeData.email}
                  onChange={(e) => setPledgeData({...pledgeData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-lg text-white placeholder-white/60 focus:border-white focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Your Message (Optional)</label>
                <textarea
                  rows="4"
                  value={pledgeData.message}
                  onChange={(e) => setPledgeData({...pledgeData, message: e.target.value})}
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-lg text-white placeholder-white/60 focus:border-white focus:outline-none transition-colors"
                  placeholder="Share why peace matters to you..."
                ></textarea>
              </div>
              <button
                onClick={handlePledgeSubmit}
                className="peace-button w-full px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5" />
                Submit Peace Pledge
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Every Action Counts
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Small acts of kindness create ripples of peace that transform our world
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <MessageCircle className="w-8 h-8" />, title: "Start Conversations", desc: "Bridge divides through dialogue" },
              { icon: <Users className="w-8 h-8" />, title: "Build Community", desc: "Connect with your neighbors" },
              { icon: <Heart className="w-8 h-8" />, title: "Spread Kindness", desc: "One act at a time" }
            ].map((action, index) => (
              <div key={index} className="p-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl">
                <div className="text-blue-600 flex justify-center mb-3">
                  {action.icon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{action.title}</h3>
                <p className="text-gray-600 text-sm">{action.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Globe className="w-6 h-6" />
                <span className="font-bold">World Peace Initiative</span>
              </div>
              <p className="text-gray-400 text-sm">
                Building bridges, fostering understanding, creating lasting peace.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Programs</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-white cursor-pointer transition-colors">Peace Education</li>
                <li className="hover:text-white cursor-pointer transition-colors">Community Dialogue</li>
                <li className="hover:text-white cursor-pointer transition-colors">Youth Leadership</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-white cursor-pointer transition-colors">Research & Reports</li>
                <li className="hover:text-white cursor-pointer transition-colors">Educational Materials</li>
                <li className="hover:text-white cursor-pointer transition-colors">Success Stories</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-white cursor-pointer transition-colors">Contact Us</li>
                <li className="hover:text-white cursor-pointer transition-colors">Newsletter</li>
                <li className="hover:text-white cursor-pointer transition-colors">Social Media</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2024 World Peace Initiative. Together, we build a better world. 🕊️</p>
          </div>
        </div>
      </footer>
    </div>
  );
}