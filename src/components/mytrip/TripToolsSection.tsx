import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  Utensils, 
  HelpCircle, 
  ChevronRight,
  Compass,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface TripToolsSectionProps {
  onOpenTool: (toolId: string, title: string, description: string) => void;
}

export const TripToolsSection: React.FC<TripToolsSectionProps> = ({
  onOpenTool,
}) => {
  const { isDark } = useTheme();

  const tools = [
    {
      id: 'what-should-i-do-now',
      title: 'What should I do now?',
      subtitle: 'Real-time contextual activity suggestions',
      desc: 'Find something to do tailored to your exact location, time of day, budget, and remaining itinerary.',
      icon: <Sparkles className="w-4 h-4 text-[#EA8E75]" />,
      badge: 'Smart Assist',
    },
    {
      id: 'near-me',
      title: 'Near Me',
      subtitle: 'Places & highlights in Dahab',
      desc: 'Find curated snorkeling points, calm cafes, and local spots within walking distance.',
      icon: <MapPin className="w-4 h-4 text-[#20A89A]" />,
      badge: 'Discovery',
    },
    {
      id: 'food-now',
      title: 'Food Now',
      subtitle: 'Authentic local dining & cafes',
      desc: 'Discover seaside fresh seafood, Bedouin tea spots, and breakfast verandas around Dahab.',
      icon: <Utensils className="w-4 h-4 text-[#EA8E75]" />,
      badge: 'Dining',
    },
    {
      id: 'help-me-now',
      title: 'Help Me Now',
      subtitle: 'Fast support & live assistance',
      desc: 'Immediate assistance for bookings, transport changes, hotel coordination, and emergency questions.',
      icon: <HelpCircle className="w-4 h-4 text-rose-500" />,
      badge: 'Support',
    },
  ];

  return (
    <div
      id="trip-tools-section"
      className={`rounded-3xl p-6 border shadow-lg space-y-4 ${
        isDark ? 'bg-[#0E2520] border-white/10 text-[#F7F3EA]' : 'bg-white border-[#122420]/10 text-[#122420]'
      }`}
    >
      {/* Header */}
      <div className={`border-b pb-3 ${isDark ? 'border-white/10' : 'border-[#122420]/10'}`}>
        <span className={`text-[11px] font-bold uppercase tracking-wider block font-['Outfit',sans-serif] ${
          isDark ? 'text-[#52C4B7]' : 'text-[#0E2520]'
        }`}>
          Utilities
        </span>
        <h2 className={`text-lg font-bold font-['Outfit',sans-serif] ${
          isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'
        }`}>
          Trip tools
        </h2>
        <p className={`text-xs mt-0.5 ${isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'}`}>
          Contextual companions active during your journey
        </p>
      </div>

      {/* Grid of 4 Compact Utilities */}
      <div className="space-y-2.5">
        {tools.map((tool) => (
          <button
            key={tool.id}
            type="button"
            id={`tool-entry-${tool.id}`}
            onClick={() => onOpenTool(tool.id, tool.title, tool.desc)}
            className={`w-full p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 text-left group cursor-pointer ${
              isDark 
                ? 'bg-[#13312B] border-white/10 hover:border-white/20 hover:bg-[#13312B]/90' 
                : 'bg-stone-50 border-[#122420]/10 hover:border-[#122420]/20 hover:bg-stone-100'
            }`}
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className={`w-8 h-8 rounded-xl border flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-105 transition-transform ${
                isDark ? 'bg-[#0E2520] border-white/10 text-[#52C4B7]' : 'bg-white border-[#122420]/10 text-[#20A89A]'
              }`}>
                {tool.icon}
              </div>

              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className={`text-xs font-bold transition-colors truncate ${
                    isDark ? 'text-[#F7F3EA] group-hover:text-[#F4C36C]' : 'text-[#122420] group-hover:text-[#0E2520]'
                  }`}>
                    {tool.title}
                  </h3>
                  <span className={`text-[11px] font-semibold px-1.5 py-0.2 rounded-md border ${
                    isDark ? 'text-[#52C4B7] bg-[#0E2520] border-white/10' : 'text-[#0E2520] bg-white border-stone-200'
                  }`}>
                    {tool.badge}
                  </span>
                </div>
                <p className={`text-[12px] truncate ${
                  isDark ? 'text-[#D2E3DE]/75' : 'text-[#4A635D]'
                }`}>
                  {tool.subtitle}
                </p>
              </div>
            </div>

            <ChevronRight className={`w-4 h-4 group-hover:translate-x-0.5 transition-all flex-shrink-0 ${
              isDark ? 'text-[#D2E3DE]/40 group-hover:text-[#F7F3EA]' : 'text-[#4A635D]/50 group-hover:text-[#122420]'
            }`} />
          </button>
        ))}
      </div>
    </div>
  );
};
