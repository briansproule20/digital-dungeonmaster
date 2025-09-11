export default function Docs() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <article className="bg-white rounded-lg shadow-sm border p-8 prose prose-lg max-w-none prose-headings:text-black prose-p:text-black prose-li:text-black prose-strong:text-black">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dungeons & Dragons 5th Edition: Beginner's Guide</h1>
          <p className="text-xl text-gray-600 italic mb-8">A comprehensive introduction to the world's greatest roleplaying game</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What is D&D?</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Dungeons & Dragons is a tabletop roleplaying game where you and your friends create characters and embark on adventures in a fantasy world. One player acts as the <strong>Dungeon Master (DM)</strong> who describes the world and controls the story, while the other players control <strong>Player Characters (PCs)</strong> who are the heroes of the tale.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Think of it like collaborative storytelling with dice to add excitement and uncertainty!
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Core Concepts</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">The Golden Rule</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            The DM has final say on all rules interpretations. D&D is about having fun together, so rules can be bent or changed to serve the story.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">The Basic Game Loop</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-6">
            <li><strong>DM describes the situation</strong> - "You enter a dark cavern..."</li>
            <li><strong>Players say what they want to do</strong> - "I want to search for traps"</li>
            <li><strong>DM determines if dice are needed</strong> - "Roll an Investigation check"</li>
            <li><strong>Dice are rolled and results interpreted</strong> - Success, failure, or complications</li>
            <li><strong>DM describes what happens next</strong> - The story continues!</li>
          </ol>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Character Basics</h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">The Six Ability Scores</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Every character has six core abilities rated 1-20 (10-11 is average for humans):
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
            <li><strong>Strength (STR)</strong> - Physical power, lifting, jumping, melee attacks</li>
            <li><strong>Dexterity (DEX)</strong> - Agility, reflexes, stealth, ranged attacks</li>
            <li><strong>Constitution (CON)</strong> - Health, stamina, resisting poison/disease</li>
            <li><strong>Intelligence (INT)</strong> - Reasoning, memory, knowledge</li>
            <li><strong>Wisdom (WIS)</strong> - Awareness, insight, perception</li>
            <li><strong>Charisma (CHA)</strong> - Force of personality, leadership, magic for some classes</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Ability Modifiers</h3>
          <p className="text-gray-700 leading-relaxed mb-4">Each ability score gives you a modifier used for dice rolls:</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm text-black">
              <div>
                <div className="flex justify-between py-1"><span>Score 8-9:</span><span>-1</span></div>
                <div className="flex justify-between py-1"><span>Score 10-11:</span><span>+0</span></div>
                <div className="flex justify-between py-1"><span>Score 12-13:</span><span>+1</span></div>
              </div>
              <div>
                <div className="flex justify-between py-1"><span>Score 14-15:</span><span>+2</span></div>
                <div className="flex justify-between py-1"><span>Score 16-17:</span><span>+3</span></div>
                <div className="flex justify-between py-1"><span>Score 18-19:</span><span>+4</span></div>
              </div>
            </div>
            <p className="text-xs text-black mt-3">
              <strong className="text-black">Formula:</strong> (Ability Score - 10) ÷ 2, rounded down
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Proficiency Bonus</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            As your character levels up, you get better at things you're trained in. Your proficiency bonus starts at +2 and increases every few levels:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-6">
            <li><strong>Levels 1-4:</strong> +2</li>
            <li><strong>Levels 5-8:</strong> +3</li>
            <li><strong>Levels 9-12:</strong> +4</li>
            <li><strong>Levels 13-16:</strong> +5</li>
            <li><strong>Levels 17-20:</strong> +6</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Dice System</h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Types of Dice</h3>
          <p className="text-gray-700 leading-relaxed mb-4">D&D uses polyhedral dice, written as "d" + number of sides:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-6">
            <li><strong>d4</strong> (4 sides) - Small damage</li>
            <li><strong>d6</strong> (6 sides) - Common damage</li>
            <li><strong>d8</strong> (8 sides) - Medium damage</li>
            <li><strong>d10</strong> (10 sides) - Larger damage</li>
            <li><strong>d12</strong> (12 sides) - Heavy damage</li>
            <li><strong>d20</strong> (20 sides) - <strong>Most important!</strong> Used for almost all checks</li>
            <li><strong>d100</strong> (percentile) - Special situations</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">The d20 System</h3>
          <p className="text-gray-700 leading-relaxed mb-4">Most actions use a d20 roll:</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-center font-mono text-lg text-black">
              <strong className="text-black">Basic Formula:</strong> d20 + Ability Modifier + Proficiency Bonus (if applicable) ≥ Target Number
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Advantage and Disadvantage</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
            <li><strong>Advantage:</strong> Roll two d20s, use the higher result (when conditions favor you)</li>
            <li><strong>Disadvantage:</strong> Roll two d20s, use the lower result (when conditions work against you)</li>
            <li><strong>They cancel out:</strong> If you have both, roll normally</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Types of Rolls</h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Ability Checks</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Test if you can do something. Roll d20 + ability modifier (+ proficiency if you're good at it).
          </p>
          <p className="text-gray-700 font-semibold mb-2">Common Checks:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-6">
            <li><strong>Strength (Athletics)</strong> - Climbing, swimming, jumping</li>
            <li><strong>Dexterity (Acrobatics)</strong> - Balance, tumbling</li>
            <li><strong>Dexterity (Stealth)</strong> - Hiding, moving quietly</li>
            <li><strong>Intelligence (Investigation)</strong> - Finding clues, analyzing</li>
            <li><strong>Wisdom (Perception)</strong> - Noticing things</li>
            <li><strong>Charisma (Persuasion)</strong> - Convincing others</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Attack Rolls</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            When attacking, roll d20 + ability modifier + proficiency bonus vs target's <strong>Armor Class (AC)</strong>.
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-6">
            <li><strong>Melee attacks</strong> usually use Strength</li>
            <li><strong>Ranged attacks</strong> usually use Dexterity</li>
            <li><strong>Spell attacks</strong> use your spellcasting ability</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Saving Throws</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Defend against dangers. Roll d20 + ability modifier + proficiency bonus (if proficient in that save).
          </p>
          <p className="text-gray-700 font-semibold mb-2">The Six Saves:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-6">
            <li><strong>Strength</strong> - Resist being moved or grappled</li>
            <li><strong>Dexterity</strong> - Dodge explosions, avoid traps</li>
            <li><strong>Constitution</strong> - Resist poison, disease, death</li>
            <li><strong>Intelligence</strong> - Resist mental intrusion</li>
            <li><strong>Wisdom</strong> - Resist charm, fear, illusion</li>
            <li><strong>Charisma</strong> - Maintain sense of self</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Combat Basics</h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Initiative</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            At the start of combat, everyone rolls d20 + Dex modifier. Act in order from highest to lowest.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Your Turn</h3>
          <p className="text-gray-700 leading-relaxed mb-4">On your turn, you can:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-6">
            <li><strong>Move</strong> up to your speed (usually 30 feet)</li>
            <li>Take <strong>one action</strong></li>
            <li>Take <strong>one bonus action</strong> (if you have abilities that use bonus actions)</li>
            <li><strong>Interact</strong> with one object for free</li>
            <li><strong>Communicate</strong> briefly</li>
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

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-black mb-4">Quick Reference - Difficulty Classes</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-black">
              <div className="flex justify-between"><span>Very Easy:</span><span>DC 5</span></div>
              <div className="flex justify-between"><span>Easy:</span><span>DC 10</span></div>
              <div className="flex justify-between"><span>Medium:</span><span>DC 15</span></div>
              <div className="flex justify-between"><span>Hard:</span><span>DC 20</span></div>
              <div className="flex justify-between"><span>Very Hard:</span><span>DC 25</span></div>
              <div className="flex justify-between"><span>Nearly Impossible:</span><span>DC 30</span></div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Remember</h3>
            <p className="text-gray-700">
              The most important rule is to have fun! D&D is about telling stories together and creating memorable moments with friends. Don't worry about getting every rule perfect - you'll learn as you play!
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}