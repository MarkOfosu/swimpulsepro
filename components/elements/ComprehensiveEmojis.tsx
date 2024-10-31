import React from 'react';

const ComprehensiveEmojis = () => {
  const emojis: { [key: string]: string } = {
    // Swimming & Water
    swimmer: '🏊',
    swimmerWoman: '🏊‍♀️',
    swimmerMan: '🏊‍♂️',
    waterWave: '🌊',
    sweat: '💦',
    splash: '💧',
    pool: '🏊',
    ocean: '🌊',
    
    // Sports Equipment
    goggles: '🥽',
    swimsuit: '👙',
    stopwatch: '⏱️',
    whistle: '🎯',
    clipboard: '📋',
    
    // Achievement Symbols & Medals
    trophy: '🏆',
    medal1st: '🥇',
    medal2nd: '🥈',
    medal3rd: '🥉',
    sportsmedal: '🏅',
    crown: '👑',
    star: '⭐',
    glowingStar: '🌟',
    sparkles: '✨',
    gem: '💎',
    diamond: '🔷',
    crystalBall: '🔮',
    rainbow: '🌈',
    
    // Special Achievements
    unicorn: '🦄',
    rocket: '🚀',
    lightning: '⚡',
    fire: '🔥',
    explosion: '💥',
    superpower: '⚡',
    magic: '🪄',
    crystal: '🔮',
    infinity: '♾️',
    
    // Progress & Metrics
    levelUp: '🆙',
    chartUp: '📈',
    chartDown: '📉',
    muscle: '💪',
    hundredPoints: '💯',
    timer: '⏲️',
    clock: '🕐',
    loading: '⌛',
    
    // Rewards & Treasures
    moneybag: '💰',
    gift: '🎁',
    chest: '🎯',
    jewel: '💍',
    key: '🔑',
    scroll: '📜',
    shield: '🛡️',
    sword: '⚔️',
    
    // Status Indicators
    check: '✅',
    success: '✔️',
    error: '❌',
    warning: '⚠️',
    info: '💡',
    locked: '🔒',
    unlocked: '🔓',
    newAchievement: '🆕',
    
    // Health & Performance
    heart: '❤️',
    heartbeat: '💓',
    food: '🍎',
    water: '🥤',
    sleep: '😴',
    brain: '🧠',
    
    // Feedback & Social
    smile: '😊',
    thumbsUp: '👍',
    clap: '👏',
    highFive: '🙌',
    speak: '🗣️',
    ear: '👂',
    eyes: '👀',
    
    // Competition & Team
    vs: '🆚',
    flag: '🏁',
    team: '👥',
    podium: '🏆',
    celebration: '🎉',
    
    // Notifications
    bell: '🔔',
    alert: '⚡',
    memo: '📝',
  };

  const categories = {
    'Swimming & Water': ['swimmer', 'swimmerWoman', 'swimmerMan', 'waterWave', 'sweat', 'splash', 'pool', 'ocean'],
    'Sports Equipment': ['goggles', 'swimsuit', 'stopwatch', 'whistle', 'clipboard'],
    'Achievement Symbols & Medals': ['trophy', 'medal1st', 'medal2nd', 'medal3rd', 'sportsmedal', 'crown', 'star', 'glowingStar', 'sparkles', 'gem', 'diamond', 'crystalBall', 'rainbow'],
    'Special Achievements': ['unicorn', 'rocket', 'lightning', 'fire', 'explosion', 'superpower', 'magic', 'crystal', 'infinity'],
    'Progress & Metrics': ['levelUp', 'chartUp', 'chartDown', 'muscle', 'hundredPoints', 'timer', 'clock', 'loading'],
    'Rewards & Treasures': ['moneybag', 'gift', 'chest', 'jewel', 'key', 'scroll', 'shield', 'sword'],
    'Status Indicators': ['check', 'success', 'error', 'warning', 'info', 'locked', 'unlocked', 'newAchievement'],
    'Health & Performance': ['heart', 'heartbeat', 'food', 'water', 'sleep', 'brain'],
    'Feedback & Social': ['smile', 'thumbsUp', 'clap', 'highFive', 'speak', 'ear', 'eyes'],
    'Competition & Team': ['vs', 'flag', 'team', 'podium', 'celebration'],
    'Notifications': ['bell', 'alert', 'memo']
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">Comprehensive Swimming & Achievement Emojis</h2>
      {Object.entries(categories).map(([category, emojiKeys]) => (
        <div key={category} className="space-y-2">
          <h3 className="text-xl font-semibold">{category}</h3>
          <div className="grid grid-cols-2 gap-3">
            {emojiKeys.map((key: string) => (
              <div key={key} className="flex items-center space-x-2 p-2 border rounded bg-gray-50">
                <span className="text-2xl">{emojis[key]}</span>
                <code className="bg-white px-2 py-1 rounded text-sm">{`{emojis.${key}}`}</code>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComprehensiveEmojis;