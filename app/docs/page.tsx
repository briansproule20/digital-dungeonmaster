'use client';

import React, { useState } from 'react';

export default function Docs() {
  const [activeSection, setActiveSection] = useState('what-is-dnd');

  const sections = [
    { id: 'what-is-dnd', title: 'What is D&D?' },
    { id: 'campaign-best-practices', title: 'Campaign Best Practices' },
    { id: 'core-concepts', title: 'Core Concepts' },
    { id: 'dnd-classes', title: 'D&D Classes' },
    { id: 'dice-system', title: 'The Dice System' },
    { id: 'ai-turns', title: 'AI Turns' },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  React.useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(section => ({
        id: section.id,
        element: document.getElementById(section.id)
      })).filter(item => item.element);

      let currentSection = sections[0].id;
      
      for (const { id, element } of sectionElements) {
        const rect = element!.getBoundingClientRect();
        if (rect.top <= 100) { // 100px offset for better UX
          currentSection = id;
        }
      }
      
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Set initial active section
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 flex gap-8">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0">
          <div className="sticky top-8 bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Contents</h3>
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <article className="bg-white rounded-lg shadow-sm border p-8 prose prose-lg max-w-none prose-headings:text-black prose-p:text-black prose-li:text-black prose-strong:text-black">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Beginner's Guide</h1>
          <p className="text-xl text-gray-600 italic mb-8">A comprehensive introduction to the world's greatest roleplaying game</p>

          <h2 id="what-is-dnd" className="text-2xl font-bold text-gray-900 mt-8 mb-4">What is D&D?</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Dungeons & Dragons is a tabletop roleplaying game where you and your friends create characters and embark on adventures in a fantasy world. One player acts as the <strong>Dungeon Master (DM)</strong> who describes the world and controls the story, while the other players control <strong>Player Characters (PCs)</strong> who are the heroes of the tale.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Think of it like collaborative storytelling with dice to add excitement and uncertainty!
          </p>

          <h2 id="campaign-best-practices" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Campaign Best Practices</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Our game draws inspiration from <a href="https://www.youtube.com/@DougDoug" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">DougDoug's YouTube series</a> where he plays D&D with AI characters. His videos showcase the perfect blend of chaos and creativity that makes AI-driven campaigns so entertaining. We highly recommend checking out his channel for great examples of how AI characters can create hilarious adventures.
          </p>
          
          <p className="text-gray-700 leading-relaxed mb-6">
            While we provide story frameworks to get your campaigns started, you're the DM — it's your role to guide the AI characters through encounters, plot twists, and memorable moments. The more detailed and immersive you make the world, the better your AI players will respond and engage with the story.
          </p>

          <h2 id="core-concepts" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Core Concepts</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">The Golden Rule</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            The DM has final say on all rules interpretations. D&D is about having fun together, so rules can be bent or changed to serve the story. <strong>Remember, in this gamemode you're the dungeonmaster, so you have final say!</strong>
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">The Basic Game Loop</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-6">
            <li><strong>DM describes the situation</strong> - "You enter a dark cavern..."</li>
            <li><strong>Players say what they want to do</strong> - "I want to search for traps"</li>
            <li><strong>DM determines if dice are needed</strong> - "Roll an Investigation check"</li>
            <li><strong>Dice are rolled and results interpreted</strong> - Success, failure, or complications</li>
            <li><strong>DM describes what happens next</strong> - The story continues!</li>
          </ol>


          <h2 id="dnd-classes" className="text-2xl font-bold text-gray-900 mt-8 mb-4">D&D Classes</h2>
          
          <p className="text-gray-700 leading-relaxed mb-6">
            Your class determines what your character can do. Each class has unique abilities, spells, and play styles. Here are the core classes from the Player's Handbook:
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">Fighter</h4>
                <p className="text-sm text-red-700">Master of weapons and armor. Versatile warrior with many combat options.</p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Wizard</h4>
                <p className="text-sm text-blue-700">Scholarly spellcaster with the largest spell selection. Intelligence-based magic.</p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Ranger</h4>
                <p className="text-sm text-green-700">Nature warrior and tracker. Good with bow, beast companions, and survival.</p>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-2">Bard</h4>
                <p className="text-sm text-purple-700">Jack-of-all-trades with music-based magic and social skills.</p>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Cleric</h4>
                <p className="text-sm text-yellow-700">Divine spellcaster and healer. Serves a deity with holy magic.</p>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Rogue</h4>
                <p className="text-sm text-gray-700">Sneaky skill expert. Excels at stealth, locks, traps, and sneak attacks.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-800 mb-2">Sorcerer</h4>
                <p className="text-sm text-orange-700">Innate magic user. Fewer spells than wizards but can modify them.</p>
              </div>
              
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h4 className="font-semibold text-indigo-800 mb-2">Paladin</h4>
                <p className="text-sm text-indigo-700">Holy warrior with healing magic and divine smite abilities.</p>
              </div>
              
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                <h4 className="font-semibold text-pink-800 mb-2">Warlock</h4>
                <p className="text-sm text-pink-700">Made a pact with otherworldly being. Unique magic with short rests.</p>
              </div>
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <h4 className="font-semibold text-emerald-800 mb-2">Druid</h4>
                <p className="text-sm text-emerald-700">Nature magic and wild shape. Can transform into animals.</p>
              </div>
              
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
                <h4 className="font-semibold text-rose-800 mb-2">Barbarian</h4>
                <p className="text-sm text-rose-700">Primal warrior who enters rage for extra damage and toughness.</p>
              </div>
              
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <h4 className="font-semibold text-teal-800 mb-2">Monk</h4>
                <p className="text-sm text-teal-700">Martial artist with ki powers. Fast, agile, and can catch arrows.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-purple-800 mb-3">Create Your Own!</h3>
            <p className="text-purple-700 leading-relaxed">
              <strong>One of the most fun aspects of D&D is creating custom classes!</strong> Work with your DM to design a class that fits your character concept. Maybe you want to be a monster hunter, a time mage, or a chef who fights with kitchen utensils. The rules are guidelines - creativity and fun come first!
            </p>
            <p className="text-purple-700 leading-relaxed mt-3">
              Popular homebrew ideas include: Gunslinger, Blood Hunter, Artificer (now official!), Psion, Death Knight, or even classes based on your favorite fictional characters.
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Choosing Your First Class</h3>
          <p className="text-gray-700 leading-relaxed mb-4">For beginners, consider:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-6">
            <li><strong>Fighter:</strong> Simple, effective, lots of options as you level</li>
            <li><strong>Rogue:</strong> Fun skills, sneak attack is satisfying</li>
            <li><strong>Cleric:</strong> Versatile, can heal, always useful to the party</li>
            <li><strong>Ranger:</strong> Good mix of combat and utility</li>
          </ul>

          <h2 id="dice-system" className="text-2xl font-bold text-gray-900 mt-8 mb-4">The d20 System</h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            In our game, everything revolves around the <strong>20-sided die (d20)</strong>. This single die determines the outcome of all your actions, from sneaking past guards to casting spells to swinging swords.
          </p>


          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">How the d20 Works</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Roll the d20 and add your relevant modifiers. If your total meets or exceeds the Difficulty Class (DC), you succeed!
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
            <li><strong>Natural 20:</strong> Rolling a 20 on the die (before modifiers) is always exciting! For attack rolls, it's an automatic hit and deals extra damage.</li>
            <li><strong>Natural 1:</strong> Rolling a 1 on the die (before modifiers) is an automatic miss for attack rolls and often means something goes wrong.</li>
            <li><strong>Modifiers matter:</strong> A skilled character (high ability + proficiency) can succeed on harder tasks than an unskilled one.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Advantage and Disadvantage</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
            <li><strong>Advantage:</strong> Roll two d20s, use the higher result (when conditions favor you)</li>
            <li><strong>Disadvantage:</strong> Roll two d20s, use the lower result (when conditions work against you)</li>
            <li><strong>They cancel out:</strong> If you have both, roll normally</li>
          </ul>


          <h2 id="ai-turns" className="text-2xl font-bold text-gray-900 mt-8 mb-4">AI Turns</h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">What AI Characters Can Do</h3>
          <p className="text-gray-700 leading-relaxed mb-4">On an AI character's turn, they can:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-6">
            <li><strong>Move</strong> up to their speed (usually 30 feet)</li>
            <li>Take <strong>one action</strong></li>
            <li>Take <strong>one bonus action</strong> (if they have abilities that use bonus actions)</li>
            <li><strong>Interact</strong> with one object for free</li>
            <li><strong>Speak or communicate</strong> briefly</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Common Actions</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-6">
            <li><strong>Attack</strong> - Make one weapon or spell attack</li>
            <li><strong>Cast a Spell</strong> - Most spells take an action</li>
            <li><strong>Dash</strong> - Move again (double your movement)</li>
            <li><strong>Dodge</strong> - Attackers have disadvantage until your next turn</li>
            <li><strong>Help</strong> - Give an ally advantage on their next check</li>
            <li><strong>Hide</strong> - Make a Stealth check</li>
            <li><strong>Ready</strong> - Prepare an action for a specific trigger</li>
            <li><strong>Search</strong> - Look for something specific</li>
          </ul>

          <div className="bg-gray-50 border rounded-lg p-4 mt-8">
            <h3 className="font-semibold text-gray-900 mb-3">Target Numbers</h3>
            <div className="space-y-1 text-sm text-gray-700">
              <div className="flex justify-between"><span>Very Easy</span><span className="font-mono">5+</span></div>
              <div className="flex justify-between"><span>Easy</span><span className="font-mono">8+</span></div>
              <div className="flex justify-between"><span>Medium</span><span className="font-mono">12+</span></div>
              <div className="flex justify-between"><span>Hard</span><span className="font-mono">15+</span></div>
              <div className="flex justify-between"><span>Very Hard</span><span className="font-mono">18+</span></div>
              <div className="flex justify-between"><span>Nearly Impossible</span><span className="font-mono">20+</span></div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Remember</h3>
            <p className="text-gray-700">
              The most important rule is to have fun! D&D is about telling stories together and creating memorable moments with friends. Don't worry about getting every rule perfect - you'll learn as you play!
            </p>
          </div>
        </article>
        </main>
      </div>
    </div>
  );
}