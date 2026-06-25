import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { dataService } from '../lib/dataService';
import { Family } from '../types';
import { 
  CheckCircle2, Navigation, PartyPopper, Map, 
  Volume2, VolumeX, Heart, Calendar, MapPin, 
  Users, Key, AlertCircle, Sparkles, Mail, Compass
} from 'lucide-react';
import VenueLayoutViewer from '../components/layout/VenueLayoutViewer';

// High-fidelity romantic background instrumental
const BG_MUSIC_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3';

export default function EntryPass() {
  const { slug } = useParams();
  const [family, setFamily] = useState<Family | null>(null);
  const [venueSettings, setVenueSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  // Audio Engine Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Invitation Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Load datasets
  useEffect(() => {
    const fetchPass = async () => {
      if (!slug) return;
      try {
        const [data, settings] = await Promise.all([
          dataService.getFamilyBySlug(slug),
          dataService.getVenueSettings()
        ]);
        setFamily(data);
        setVenueSettings(settings);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPass();
  }, [slug]);

  // Audio setup
  useEffect(() => {
    if (isOpen) {
      const audio = new Audio(BG_MUSIC_URL);
      audio.loop = true;
      audio.volume = 0.45;
      audioRef.current = audio;
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(e => {
            console.log("Audio autoplay restricted by browser policies:", e);
            setIsPlaying(false);
          });
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [isOpen]);

  // Handle music toggle
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.warn(err));
    }
  };

  // Target Ceremony Countdown
  useEffect(() => {
    const targetDate = new Date('2026-05-18T18:00:00'); // Standardized Wedding calendar target
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        clearInterval(interval);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070707] flex flex-col items-center justify-center text-[#D4AF37]">
        <div className="w-14 h-14 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4" />
        <span className="font-mono text-xs uppercase tracking-[0.3em] opacity-80 animate-pulse">Decrypting Entry Credentials...</span>
      </div>
    );
  }

  if (!family) {
    return (
      <div className="min-h-screen bg-[#070707] flex flex-col items-center justify-center text-center p-6 text-white bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.08)_0%,rgba(7,7,7,1)_80%)]">
        <div className="w-16 h-16 rounded-full bg-red-950/20 border border-red-500/25 flex items-center justify-center mb-6">
          <AlertCircle className="text-red-400" size={32} />
        </div>
        <h1 className="text-3xl font-serif text-[#c9a84c] mb-2 font-light">Invitation Not Active</h1>
        <p className="text-white/50 text-sm max-w-sm mx-auto mb-8 leading-normal">
          This digital passcode slug is either unassigned, suspended, or does not exist in our active reservation logs.
        </p>
        <Link to="/" className="px-6 py-2.5 bg-gold hover:bg-gold-light text-dark font-mono uppercase tracking-widest text-xs rounded transition-all font-bold">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070707] text-white overflow-x-hidden selection:bg-gold selection:text-black">
      
      {/* BACKGROUND FLOATING SPARKS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[20%] left-[10%] w-[30vh] h-[30vh] bg-[#c9a84c]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[40vh] h-[40vh] bg-[#8B6C2F]/5 rounded-full blur-[150px]" />
      </div>

      <AnimatePresence mode="wait">
        
        {/* PHASE 1: THE REGAL CLOSED DIGITAL ENVELOPE SHIELD */}
        {!isOpen ? (
          <motion.section 
            key="envelope"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -80, scale: 0.95 }}
            transition={{ duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C0C0C] p-6 text-center overflow-hidden"
          >
            {/* Elegant luxury borders and decorations */}
            <div className="absolute inset-4 sm:inset-8 border border-gold/15 rounded pointer-events-none" />
            <div className="absolute inset-6 sm:inset-10 border border-gold/5 rounded pointer-events-none" />
            
            {/* Corner Ornamental Graphics */}
            <div className="absolute top-10 left-10 w-8 h-8 border-t-2 border-l-2 border-gold/20" />
            <div className="absolute top-10 right-10 w-8 h-8 border-t-2 border-r-2 border-gold/20" />
            <div className="absolute bottom-10 left-10 w-8 h-8 border-b-2 border-l-2 border-gold/20" />
            <div className="absolute bottom-10 right-10 w-8 h-8 border-b-2 border-r-2 border-gold/20" />

            <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center">
              
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 1 }}
                className="w-16 h-16 rounded-full border border-gold/30 flex items-center justify-center mb-8 bg-gold/5"
              >
                <Mail className="text-gold animate-bounce" size={24} />
              </motion.div>

              <span className="text-gold tracking-[0.45em] text-[10px] uppercase block mb-4 font-mono">✦ The Royal Union ✦</span>
              
              <h1 className="font-serif text-3xl sm:text-4xl text-[#f5ebd6] tracking-wide mb-1 px-4 leading-normal">
                Wedding Celebration
              </h1>
              
              <div className="w-16 h-[1.5px] bg-gradient-to-r from-transparent via-gold to-transparent my-6" />

              <span className="text-white/40 text-[10px] tracking-widest uppercase font-mono block mb-1">
                Special Invitation Specially For
              </span>

              <motion.h2 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="font-serif text-3xl sm:text-5xl text-gold italic font-bold my-3 px-2 leading-relaxed tracking-tight"
              >
                {family.name}
              </motion.h2>

              <p className="text-text-secondary text-xs max-w-sm leading-relaxed mt-4 px-4 font-light italic">
                "We await your prestigious presence to bless us as we embark on this sacred journey of eternity."
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(true)}
                className="mt-12 group relative px-8 py-4 bg-gradient-to-r from-[#a68635] via-gold to-[#a68635] text-black font-sans text-[11px] font-bold uppercase tracking-[0.25em] rounded shadow-[0_0_40px_rgba(201,168,76,0.3)] transition-all overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                <span className="relative flex items-center justify-center gap-1.5">
                  ✦ Open Invitation ✦
                </span>
              </motion.button>
            </div>
          </motion.section>
        ) : (
          
          // PHASE 2: CINEMATIC DYNAMIC WEDDING INVITATION PRESENTATION
          <motion.div 
            key="invitation-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="relative z-10 max-w-5xl mx-auto px-4 py-8 sm:py-16 md:py-24"
          >
            
            {/* FIXED AUDIO CONTROLLERS */}
            <div className="fixed bottom-6 right-6 z-[1000] flex items-center gap-2 bg-black/80 border border-gold/30 backdrop-blur-md px-3.5 py-2.5 rounded-full shadow-[0_0_20px_rgba(201,168,76,0.15)]">
              <span className="text-[9px] font-mono tracking-widest text-[#D4AF37] uppercase animate-pulse">Ambient Mode {isPlaying ? 'ON' : 'OFF'}</span>
              <button 
                onClick={togglePlay}
                className="w-8 h-8 rounded-full bg-gold hover:bg-gold-light text-dark flex items-center justify-center transition-all"
                title={isPlaying ? 'Pause Instrumental Music' : 'Play Instrumental Music'}
              >
                {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
            </div>

            {/* HEADER CORONA DECORATION */}
            <div className="text-center mb-10 sm:mb-20">
              <span className="text-gold tracking-[0.45em] text-[9px] uppercase font-mono block mb-2">✦ Wedding Celebration & Entry ✦</span>
              <div className="w-12 h-[1px] bg-gold mx-auto" />
            </div>

            {/* THE CENTRAL PAIR OF CARDS: PERSONAL COMPILATION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* CARD LEFT: SPECIFIC PERSONAL WELCOMING CARD (With customized image uploaded by admin) */}
              <div className="lg:col-span-7 bg-[#111] border border-gold/25 rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-2xl shadow-black">
                
                {/* Background decorative texture */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,168,76,0.06)_0%,transparent_60%)] pointer-events-none" />
                
                <div className="relative z-10 flex flex-col items-center text-center">
                  
                  {/* Photo Section with Regal Frames */}
                  <div className="relative mb-8">
                    
                    {/* Ring decals */}
                    <div className="absolute -inset-2.5 border border-gold/15 rounded-full animate-spin [animation-duration:45s] pointer-events-none" />
                    <div className="absolute -inset-1 border border-gold/30 rounded-full animate-spin [animation-duration:30s] pointer-events-none" />
                    
                    {family.guest_image ? (
                      <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-full overflow-hidden border-2 border-gold/80 p-1.5 bg-dark shadow-2xl">
                        <img 
                          src={family.guest_image} 
                          alt={`${family.name}`} 
                          className="w-full h-full object-cover rounded-full" 
                        />
                      </div>
                    ) : (
                      <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-full border-2 border-gold/40 p-2 bg-dark flex flex-col items-center justify-center text-center">
                        <div className="text-gold font-serif text-4xl sm:text-5xl font-extrabold uppercase italic tracking-tighter">
                          {family.name ? family.name.slice(0, 2) : "W"}
                        </div>
                        <span className="text-[8px] font-mono text-[#D4AF37]/50 tracking-[0.2em] uppercase mt-2">Honored Invite</span>
                      </div>
                    )}
                    
                    <div className="absolute bottom-1 right-2 bg-gold text-dark border border-black shadow w-7 h-7 rounded-full flex items-center justify-center text-xs">
                      ✦
                    </div>
                  </div>

                  {/* Relationship designation if uploaded */}
                  {family.custom_title && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="px-4 py-1.5 bg-gold/10 border border-gold/30 rounded-full text-[10px] text-gold uppercase tracking-[0.2em] mb-4 font-mono leading-none"
                    >
                      {family.custom_title}
                    </motion.div>
                  )}

                  <h3 className="text-[10px] tracking-[0.3em] uppercase text-white/50 font-mono mb-2">Cordially Greeting</h3>
                  <h2 className="font-serif text-3xl sm:text-5xl text-cream italic mb-6">
                    The <span className="text-gold font-bold not-italic font-serif">{family.name}</span>
                  </h2>

                  <div className="w-16 h-[1px] bg-gold/40 mx-auto" />

                  {/* Personalized greeting note from the hosts */}
                  <div className="my-8">
                    {family.custom_greeting ? (
                      <p className="font-serif text-base sm:text-lg text-[#f0e7d5] leading-relaxed max-w-xl mx-auto italic font-light px-4">
                        "{family.custom_greeting}"
                      </p>
                    ) : (
                      <p className="font-serif text-base sm:text-lg text-text-secondary leading-relaxed max-w-xl mx-auto italic font-light px-4">
                        "Your presence adds color to our laughter, warmth to our moments, and completes our joy. We eagerly look forward to starting this special chapter of our lives in your honored presence."
                      </p>
                    )}
                  </div>

                  <span className="text-[9px] uppercase tracking-widest text-[#D4AF37]/50 block font-mono">✦ INVITATION VENUE & PASS LOGISTICS BELOW ✦</span>

                </div>
              </div>

              {/* CARD RIGHT: THE SCAN PRIORITY TICKET PASS */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* PRIORITY ENTRY PASS TICKET */}
                <div className="bg-[#121212] border border-[#c9a84c]/30 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
                  {/* Decorative Ticket Corner Cutouts (Sleek perforations mimicking offline premium invitations) */}
                  <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-[#070707] border-r border-[#c9a84c]/20 z-10 transform -translate-y-1/2" />
                  <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-[#070707] border-l border-[#c9a84c]/20 z-10 transform -translate-y-1/2" />

                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#8B6C2F] via-[#c9a84c] to-[#8B6C2F]" />
                  
                  <div className="w-14 h-14 bg-[#c9a84c]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold/20">
                    <CheckCircle2 className="text-[#c9a84c]" size={26} />
                  </div>

                  <h3 className="text-center text-[10px] text-[#c9a84c] uppercase tracking-[0.34em] font-mono mb-1">Priority Admission Ticket</h3>
                  <h2 className="text-center font-serif text-2xl text-[#f4ecd8] font-semibold mb-6">Entry Pass Verification</h2>
                  
                  {/* Grid fields */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-black/30 border border-white/5 p-3 rounded-xl text-center">
                      <span className="block text-[9px] text-white/40 uppercase tracking-widest mb-1 font-mono">Passcode ID</span>
                      <span className="font-mono text-[#c9a84c] text-xs font-bold">{family.id.slice(0, 8).toUpperCase()}</span>
                    </div>
                    <div className="bg-black/30 border border-white/5 p-3 rounded-xl text-center">
                      <span className="block text-[9px] text-white/40 uppercase tracking-widest mb-1 font-mono">Access Status</span>
                      <span className="font-mono text-green-400 text-xs font-bold uppercase flex items-center justify-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                        VALID_ENTRY
                      </span>
                    </div>
                  </div>

                  <div className="bg-black/40 border border-gold/15 p-4 rounded-xl flex items-center justify-start gap-4 mb-6">
                    <Users className="text-gold flex-shrink-0" size={20} />
                    <div className="text-left">
                      <span className="block text-[8px] uppercase tracking-widest text-[#D4AF37]/60 font-mono">Maximum Capacity</span>
                      <span className="text-sm font-semibold text-cream font-mono">Holds up to {family.max_guests} Verified Guests</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 border-dashed flex flex-col gap-3">
                    <div className="flex items-center gap-2 justify-center text-white/50 text-[10px] tracking-wide mb-1">
                      <PartyPopper size={12} className="text-gold" />
                      <span>Present this live screen to security desk</span>
                    </div>
                    
                    <button 
                      onClick={() => setShowMapModal(true)}
                      className="flex items-center gap-2 text-white/80 hover:text-gold border border-white/10 hover:border-gold/30 px-4 py-2 rounded-full transition-all w-full justify-center bg-white/5 text-xs tracking-wider uppercase font-mono font-bold"
                    >
                      <Map size={13} /> Interactive Venue Map
                    </button>

                    {venueSettings?.google_maps_url ? (
                      <a 
                        href={venueSettings.google_maps_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-dark bg-gold hover:brightness-110 px-4 py-2 rounded-full transition-all w-full justify-center text-xs tracking-wider uppercase font-mono font-bold shadow-md"
                      >
                        <Navigation size={13} /> Navigate to Venue
                      </a>
                    ) : (
                      <a 
                        href={`https://maps.google.com/?q=${encodeURIComponent(venueSettings?.address || '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-dark bg-gold hover:brightness-110 px-4 py-2 rounded-full transition-all w-full justify-center text-xs tracking-wider uppercase font-mono font-bold"
                      >
                        <Navigation size={13} /> Open Google Maps
                      </a>
                    )}
                  </div>
                </div>

                {/* COUNTDOWN TIMER CARD */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-center shadow-lg">
                  <span className="text-[9px] uppercase tracking-widest text-white/40 block mb-4 font-mono">Ceremony Begins In</span>
                  <div className="flex justify-center gap-4 text-[#D4AF37]">
                    
                    <div className="flex flex-col items-center">
                      <span className="text-3xl font-mono font-bold leading-none">{timeLeft.days}</span>
                      <span className="text-[8px] uppercase tracking-widest text-white/40 font-mono mt-1.5">Days</span>
                    </div>
                    
                    <span className="text-xl opacity-30 mt-1">:</span>
                    
                    <div className="flex flex-col items-center">
                      <span className="text-3xl font-mono font-bold leading-none">{timeLeft.hours}</span>
                      <span className="text-[8px] uppercase tracking-widest text-white/40 font-mono mt-1.5">Hours</span>
                    </div>

                    <span className="text-xl opacity-30 mt-1">:</span>

                    <div className="flex flex-col items-center">
                      <span className="text-3xl font-mono font-bold leading-none">{timeLeft.minutes}</span>
                      <span className="text-[8px] uppercase tracking-widest text-white/40 font-mono mt-1.5">Mins</span>
                    </div>

                    <span className="text-xl opacity-30 mt-1">:</span>

                    <div className="flex flex-col items-center">
                      <span className="text-3xl font-mono font-bold leading-none">{timeLeft.seconds}</span>
                      <span className="text-[8px] uppercase tracking-widest text-white/40 font-mono mt-1.5">Secs</span>
                    </div>

                  </div>
                </div>

              </div>

            </div>

            {/* FULL LOGISTICAL TIMELINE OVERVIEW REPRODUCING NIKHILWED THEMES */}
            <div className="mt-16 bg-[#111] border border-gold/15 rounded-2xl p-6 sm:p-10 shadow-xl">
              
              <div className="text-center mb-10">
                <Heart className="text-gold mx-auto mb-3" size={24} />
                <h3 className="font-serif text-2xl sm:text-3xl text-cream italic">Our Auspicious Itinerary</h3>
                <p className="text-[9px] uppercase tracking-widest text-gold/80 font-mono mt-1">Multi-day Grand Festivities</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Event 1 */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 hover:border-gold/25 transition-all text-center">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-3 border border-gold/15">
                    <Sparkles className="text-gold" size={16} />
                  </div>
                  <h4 className="font-serif font-semibold text-cream text-lg">Mehndi Ceremony</h4>
                  <p className="text-[10px] text-gold/80 font-mono mt-1 uppercase">May 16th • 4:00 PM</p>
                  <p className="text-xs text-white/50 font-light mt-3 leading-relaxed">Let the fragrance of traditional henna write our eternal bond.</p>
                </div>

                {/* Event 2 */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 hover:border-gold/25 transition-all text-center">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-3 border border-gold/15">
                    <Sparkles className="text-gold animate-pulse" size={16} />
                  </div>
                  <h4 className="font-serif font-semibold text-cream text-lg">Haldi & Sangeet</h4>
                  <p className="text-[10px] text-gold/80 font-mono mt-1 uppercase">May 17th • 11:00 AM</p>
                  <p className="text-xs text-white/50 font-light mt-3 leading-relaxed">Yellow powders and dancing rhythms to spark celebration cheer.</p>
                </div>

                {/* Event 3 */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 hover:border-gold/30 transition-all text-center">
                  <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-3 border border-gold/30 shadow-[0_0_15px_rgba(201,168,76,0.1)]">
                    <Heart className="text-gold fill-gold" size={16} />
                  </div>
                  <h4 className="font-serif font-bold text-gold text-lg">Grand Wedding</h4>
                  <p className="text-[10px] text-gold font-mono mt-1 uppercase">May 18th • 6:00 PM</p>
                  <p className="text-xs text-[#ece5d4] font-medium mt-3 leading-relaxed">The holy phere vows under the celestial canopy stargaze.</p>
                </div>

                {/* Event 4 */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 hover:border-gold/25 transition-all text-center">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-3 border border-gold/15">
                    <Sparkles className="text-gold" size={16} />
                  </div>
                  <h4 className="font-serif font-semibold text-cream text-lg">Reception Feast</h4>
                  <p className="text-[10px] text-gold/80 font-mono mt-1 uppercase">May 19th • 8:00 PM</p>
                  <p className="text-xs text-white/50 font-light mt-3 leading-relaxed">Celebrate with culinary rich delights and toast to our future.</p>
                </div>

              </div>

              {/* FOOTER */}
              <div className="text-center pt-10 border-t border-white/5 mt-10">
                <p className="text-xs text-white/30 italic">Hosted with warm regards by the Bride & Groom Families</p>
              </div>

            </div>

          </motion.div>
        )}

      </AnimatePresence>

      {/* MAP VIEWER LAYOUT MODAL */}
      <VenueLayoutViewer 
        isOpen={showMapModal} 
        onClose={() => setShowMapModal(false)} 
        customMapUrl={venueSettings?.interactive_map_url}
      />

    </div>
  );
}
