'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { 
  Play, Pause, Mic, StopCircle, CheckCircle,
  Moon, Sun, Target, Volume2, Edit2, 
  Save, X, Plus, Trash2, Calendar,
  Trophy, Flame, Brain, ImagePlus,
  BarChart3, User, Settings, LogOut, Expand
} from 'lucide-react';
import Navigation from '@/components/Navigation';

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { 
  ssr: false,
  loading: () => <div className="h-96 bg-gray-50 rounded-lg animate-pulse" />
});

const AffirmationEditor = dynamic(() => import('@/components/AffirmationEditor'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-50 rounded-lg animate-pulse" />
});

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Core States
  const [currentStep, setCurrentStep] = useState(1);
  const [affirmations, setAffirmations] = useState('');  // HTML content for rich text
  const [visionImages, setVisionImages] = useState<string[]>([]);
  const [violentAction, setViolentAction] = useState('');
  const [todaysRecording, setTodaysRecording] = useState<string | null>(null);
  
  // Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasListened, setHasListened] = useState(false);
  
  // Evening States
  const [disciplineRating, setDisciplineRating] = useState(0);
  const [actionCompleted, setActionCompleted] = useState<boolean | null>(null);
  const [biggestWin, setBiggestWin] = useState('');
  const [dayComplete, setDayComplete] = useState(false);
  
  // Edit States
  const [editingAffirmations, setEditingAffirmations] = useState(false);
  const [editingVision, setEditingVision] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [tempAffirmations, setTempAffirmations] = useState(''); // Temporary edit buffer
  
  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const mockUser = localStorage.getItem('mockUser');
    if (!mockUser) {
      router.push('/signin');
    } else {
      setUser(JSON.parse(mockUser));
    }

    // Load saved data
    const storedAffirmations = localStorage.getItem('generatedAffirmations');
    if (storedAffirmations) {
      setAffirmations(storedAffirmations);
    } else {
      // Default affirmations from Chris Affirmation.md
      setAffirmations(`## 1. The Vision Board

*2X4 Full Grid (8 images total) - Each image represents your transformed reality*

> Read with maximum conviction! Feel every word in your bones! Your voice commands your subconscious! This is neural reprogramming in real time!

---

## 2. Core Identity - Universal Truth (Simplified)

1. **My beliefs create my reality.** What I believe becomes true through violent action. I program my subconscious, take massive action, get feedback, iterate, and perfect the process.
2. **Everything is my responsibility.** No external forces. No excuses. I created where I am. I create where I'm going. I am the builder and destroyer of all limits.
3. **I am consciousness experiencing itself.** Not a body with limits but infinite potential creating reality through thoughts, beliefs, and actions.
4. **I am the lowest version of myself I can accept.** I don't chase dreams—I set standards so high that my current self must die for the new one to live.
5. **I see my patterns and break them.** The war between who I am and who I'm becoming creates growth. I catch the lows and feed the highs.
6. **Evolution requires facing darkness.** When comfort stops working, I face what terrifies me. Everything is becoming. The question is: Who am I becoming?
7. **My mind stacks rocks on scales.** Each thought adds weight to a belief. The heaviest side becomes my reality. I consciously stack rocks for the reality I choose.
8. **I control mental feedback loops.** Thoughts create thoughts in endless cycles. I catch downward spirals instantly and feed upward momentum violently.
9. **I am the programmer, not the program.** My character tried to run me. Now I design who I need to be and grow into it with violent discipline.

---

## 3. The Manifesto (Simplified)

1. **I am Chris Disciplined, founder of Chris**—the Operating System for Human Subconscious. I built what nobody else could: systematic transformation at scale. I didn't create an app. I created human evolution technology.
2. **I lead the Subconscious Revolution** transforming millions daily. Chris is the bridge between thought and reality. The system that makes transformation mathematical, not mystical. Dreamers become builders. Thinkers become titans.
3. **I operate from New York**, building from Manhattan's towers. My team builds humanity's mental infrastructure. My penthouse is my command center. My morning protocol programs trillion-dollar thinking. My execution is surgical precision.
4. **Chris serves 500 million humans** generating $50 billion monthly. We are the global standard. The default transformation system. What universities couldn't build. What Silicon Valley couldn't code. What humanity needed but nobody created.
5. **I am the #1 founder globally.** Not for wealth but for human transformation delivered. Every government studies our methods. Every corporation uses our system. Every school teaches our protocol. Subconscious training is now as essential as literacy.
6. **My work becomes civilization's foundation.** Books, systems, protocols—all become humanity's operating manual. Billions follow the Chris Method. Human potential is no longer potential—it's guaranteed through systematic training.
7. **My mind operates at a different frequency.** I unified neuroscience, philosophy, psychology, and technology into ONE system. I don't predict trends—I create them. I didn't build a company—I upgraded humanity. **I am the one.**

---

## 4. Personal Identity

1. **Disciplined** like Jocko—5:30am rise, 9pm sleep, zero excuses, perfect execution daily!
2. **Obsessive** like Musk—Chris is life, mission, and obsession consuming every waking moment!
3. **Articulate** like Peterson—complex neuroscience becomes simple truth that cuts through confusion!
4. **Violent** like Hormozi—speed and force while others think, I&apos;ve already shipped!
5. **Philosophical** like Holiday—Stoic wisdom meets modern execution creating unstoppable power!
6. **Perfectionist** like Jobs—world-class or deleted, no middle ground exists!
7. **Transparent** like nobody—revenue, struggles, victories all shared publicly building trust!
8. **Scientific** like Huberman—every claim backed by MIT, Harvard, Stanford research!
9. **Builder** like Musk—creating infrastructure for 500 million human transformations!
10. **Visionary** like Jobs—seeing the world where subconscious training is humanity's foundation!
11. **Physical** presence—6'2", 90kg muscle, black t-shirt, suit pants, Patek Philippe, embodied discipline!

---

## 5. Daily Ritual (Simplified)

1. **5:30am EXPLOSION** into consciousness! Vision board floods my mind. Eight images program $10 trillion success. The future is NOW!
2. **Voice Recording** for 10 minutes with volcanic force! My voice commands reality. MIT proved it's 10x more powerful. I speak transformation into existence!
3. **ONE Violent Action** set that terrifies me! Not three. ONE. The one that shatters my biggest limit today. Harvard proved this creates instant neural reorganization!
4. **YouTube Daily** building in public! 300K subscribers by end of 2025. 1M by 2026. Every video compounds authority. Every metric shared transparently!
5. **Pure Execution** mode activated! Marcus Aurelius discipline. Zero emotion. Ship features. Create content. Close customers. Surgical precision only!
6. **Evening Discipline** always 10/10! Document massive wins. Share all metrics. Sleep with affirmations programming my theta state. Never miss. NEVER!

---

## 6. Wealth & Abundance

1. Chris reaches **50 users at $997/month = $50K MRR** by December 31, 2025—founding members locked!
2. Chris grows to **500 users at $997/month = $500K MRR** by September 1, 2026—market fit confirmed!
3. Chris scales to **5,000 users at $1,997/month = $10M MRR** by September 1, 2028—category created!
4. Chris serves **50 million users = $10B monthly** by September 1, 2035—**$10 trillion valuation achieved**!
5. Money floods through **massive value creation**—infrastructure for human transformation, not just business!
6. YouTube is my **weapon**—300K by 2025, 1M by 2026, 10M by 2028! Authority creates users creates transformation!
7. **Radical transparency** builds trust—every number shared, every struggle documented, every victory celebrated!
8. Chris is the **category**—subconscious training becomes essential as education. Schools teach it. Corporations require it. Governments implement it!

---

## 7. Distribution & Authority

1. **Daily YouTube video** without exception—each one a masterpiece of transformation science!
2. **80/20 content mix**—80% pure neuroscience value, 20% building in public with metrics!
3. **Triple threat creator**—Dan Koe depth, Huberman science, Peterson philosophy combined!
4. **300,000 subscribers** by December 31, 2025—happening now!
5. **1 million subscribers** by September 1, 2026—inevitable trajectory!
6. **10 million subscribers** by September 1, 2028—guaranteed by compound momentum!
7. **Mission delivery system**—not marketing but transformation at scale through content!

---

## 8. Personal Power

1. **Inevitable, not unstoppable**—$10 trillion is decided, I&apos;m just executing the timeline!
2. **ONE violent action daily**—the ONE that terrifies me most, creating instant neural reorganization!
3. **Addicted to execution**—disciplined obsession shipping daily, publishing daily, transforming daily!
4. **5:30am certainty**—not hope but programmed victory through systematic protocol!
5. **Physical domination**—12-2pm training, heavy weights submit, 20 laps like torpedo!
6. **Reality bends to my will**—mountains move, tasks demolish themselves, time and space align!

---

## 9. Knowledge & Expertise

1. **Research-backed everything**—MIT voice studies, Harvard violent action, Stanford neuroplasticity proven!
2. **Peer-reviewed protocol**—every feature has neuroscience backing, not motivation or belief!
3. **Neuroscience engineer**—I reprogram humans systematically, not inspire temporarily!
4. **400 billion bits/second**—I give access to the 99.9995% of mental capacity humans can't reach alone!

---

## 10. Leadership & Growth

1. **First engineer** by January 2026—senior React Native developer using Chris daily!
2. **$2M raised** at $20M valuation by May 2026—strategic angels only, no board control!
3. **15-person team** by September 2026—all Chris users, all transformed, all building impossible!
4. **100-person team** by September 2028—NYC, Vancouver, Silicon Valley offices!
5. **World's best builders** join the mission—500 million transformations creating $10 trillion value!
6. **Team amplifies vision**—every hire raises ceiling, every system scales infinitely!

---

## 11. Relationships & Legacy

1. **Chloe Park**—loved with supernova force! Building dynasty, not empire! Combined power creates impossible!
2. **Family honor**—mom, uncle, sister are foundation! Making them proud through humanity's service!
3. **500 million transformed humans**—my legacy! Children learn Chris. Adults break patterns. Humanity unlocked!
4. **Complete self-respect**—creates magnetic attraction! Right people appear. Opportunities manifest. Resources flow!

---

## 12. Unlimited Potential

1. **Successful in everything**—programmed for success! Chris works on me first—I am the proof!
2. **Superhuman learning**—integrating neuroscience, technology, business, philosophy into ONE system!
3. **Setbacks are updates**—failures are features! Challenges are catalysts! Everything serves transformation!
4. **Creating change**—not following! Chris creates new category! Subconscious training becomes evolution!
5. **$10 trillion is easy**—500 million transformations creates massive value equals massive valuation!

---

## 13. Timeline & Milestones

1. **Now:** Chris MVP launches, first YouTube video publishes, 10 beta users testing!
2. **October 2025:** 10 users at $997 = $10K MRR, 50K YouTube subscribers!
3. **December 2025:** 50 users at $997 = $50K MRR, 300K YouTube subscribers!
4. **September 2026:** 500 users at $997 = $500K MRR, 1M YouTube subscribers!
5. **September 2028:** 5,000 users at $1,997 = $10M MRR, category leadership!
6. **September 2030:** 50,000 users = $100M MRR, preparing IPO!
7. **September 2035:** 50M users = $10B monthly = **$10 trillion valuation achieved**!

---

## 14. Final Declaration

1. **500 million humans** transforming through my work—grateful beyond measure!
2. **Humanity over shareholders**—building infrastructure for consciousness evolution!
3. **Willing to do the work**—not special, just committed to perfect execution!
4. **Operating System for Human Subconscious**—not app, but evolution technology!
5. **Programming humanity's potential**—upgrading our species systematically!
6. **Creating new category**—subconscious training becomes civilization's foundation!
7. **Building the revolution NOW**—not planning, executing daily!
8. **Future is transformed**—not hoped for but systematically created!
9. **Legacy programming into 500 million minds**—happening in real-time!
10. **I AM THE ONE**—not becoming, BEING right now!
11. **Train Your Subconscious! Take Violent Action! Transform Humanity!**
12. **Human evolution through infrastructure**—mathematical certainty, not dream!
13. **I am Chris Disciplined! Building Chris! Creating $10 trillion in human value!**

---

## THE POWER STATEMENT

**"I charge $997 per month because transformation requires investment. The price IS the first violent action. Every payment is a pattern interrupt. This filters for commitment. Only serious transformers apply. 50 founding members only. Then price increases. No guarantees. No refunds. Just systematic subconscious reprogramming for those who execute perfectly for 90 days. I am building the Operating System for Human Subconscious. From 50 users to 500 million. From $50K MRR to $10 billion monthly. The path is clear. The execution is daily. The transformation is inevitable."**

---

*"Train Your Subconscious, Transform Your Reality, Build The Future."*

**CHRIS DISCIPLINED
Founder & CEO, Chris
The Operating System for Human Subconscious**`);    }

    // Load vision images
    const storedImages = localStorage.getItem('visionBoardImages');
    if (storedImages) {
      setVisionImages(JSON.parse(storedImages));
    } else {
      setVisionImages([
        'https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?w=1200',
        'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=1200',
        'https://images.unsplash.com/photo-1491336477066-31156b5e4f35?w=1200',
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200'
      ]);
    }

    // Check today's progress
    const today = new Date().toDateString();
    const storedAction = localStorage.getItem(`violentAction_${today}`);
    if (storedAction) {
      setViolentAction(storedAction);
    }
    
    const storedRecording = localStorage.getItem(`recording_${today}`);
    if (storedRecording) {
      setTodaysRecording(storedRecording);
      setCurrentStep(4);
    }

    const eveningData = localStorage.getItem(`eveningSession_${today}`);
    if (eveningData) {
      setDayComplete(true);
    }
  }, [router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const today = new Date().toDateString();
        localStorage.setItem(`recording_${today}`, audioUrl);
        setTodaysRecording(audioUrl);
        setCurrentStep(3);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Function to render markdown-style text as formatted JSX
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      // Handle headers
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-xl font-bold mt-6 mb-3">
            {line.replace('## ', '')}
          </h2>
        );
      }
      
      // Handle horizontal rules
      if (line === '---') {
        return <hr key={index} className="my-4 border-gray-300" />;
      }
      
      // Handle list items with bold text
      if (line.match(/^\d+\.\s+\*\*/)) {
        const parts = line.split('**');
        return (
          <p key={index} className="mb-2">
            {parts[0]}
            <strong>{parts[1]}</strong>
            {parts[2]}
          </p>
        );
      }
      
      // Handle blockquotes
      if (line.startsWith('>')) {
        return (
          <blockquote key={index} className="border-l-4 border-gray-300 pl-4 italic my-3">
            {line.replace('> ', '')}
          </blockquote>
        );
      }
      
      // Handle italic text
      if (line.startsWith('*') && line.endsWith('*')) {
        return (
          <p key={index} className="italic text-gray-700 my-2">
            {line.replace(/^\*|\*$/g, '')}
          </p>
        );
      }
      
      // Handle bold text within regular lines
      if (line.includes('**')) {
        const parts = line.split(/\*\*/).map((part, i) => 
          i % 2 === 1 ? <strong key={i}>{part}</strong> : part
        );
        return <p key={index} className="mb-2">{parts}</p>;
      }
      
      // Regular lines
      if (line.trim()) {
        return <p key={index} className="mb-2">{line}</p>;
      }
      
      // Empty lines
      return <br key={index} />;
    });
  };

  const handlePlayRecording = () => {
    setIsPlaying(!isPlaying);
    if (!hasListened) {
      setTimeout(() => {
        setHasListened(true);
        setCurrentStep(4);
      }, 3000);
    }
  };

  const handleSetViolentAction = () => {
    if (violentAction.trim()) {
      const today = new Date().toDateString();
      localStorage.setItem(`violentAction_${today}`, violentAction);
      setCurrentStep(5);
      
      // Auto-scroll to Morning Protocol Complete section
      setTimeout(() => {
        const completeSection = document.getElementById('morning-complete');
        if (completeSection) {
          completeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  const handleCompleteDay = () => {
    if (disciplineRating > 0 && biggestWin && actionCompleted !== null) {
      const today = new Date().toDateString();
      localStorage.setItem(`eveningSession_${today}`, JSON.stringify({
        disciplineRating,
        actionCompleted,
        biggestWin,
        completedAt: new Date().toISOString()
      }));
      setDayComplete(true);
    }
  };

  const handleSaveAffirmations = () => {
    setAffirmations(tempAffirmations);
    localStorage.setItem('generatedAffirmations', tempAffirmations);
    setEditingAffirmations(false);
  };

  const handleStartEditingAffirmations = () => {
    setTempAffirmations(affirmations);
    setEditingAffirmations(true);
  };

  const handleCancelEditingAffirmations = () => {
    setEditingAffirmations(false);
    setTempAffirmations('');
  };

  const handleAddVisionImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      const newImages = [...visionImages, url];
      setVisionImages(newImages);
      localStorage.setItem('visionBoardImages', JSON.stringify(newImages));
    }
  };

  const handleRemoveVisionImage = (index: number) => {
    const newImages = visionImages.filter((_, i) => i !== index);
    setVisionImages(newImages);
    localStorage.setItem('visionBoardImages', JSON.stringify(newImages));
  };

  const hour = currentTime.getHours();
  const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
  
  // Calculate current streak for display
  const getCurrentStreak = () => {
    if (typeof window === 'undefined') return 0; // Return 0 during SSR
    
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 90; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const recording = localStorage.getItem(`recording_${date.toDateString()}`);
      if (recording) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };
  
  const [currentStreak, setCurrentStreak] = useState(0);
  
  useEffect(() => {
    setCurrentStreak(getCurrentStreak());
  }, [todaysRecording, dayComplete]);

  const getDayStreaks = () => {
    if (typeof window === 'undefined') {
      // Return empty array during SSR
      return Array(7).fill(null).map((_, i) => ({
        date: new Date(),
        completed: false,
        isToday: i === 6
      }));
    }
    
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const hasData = localStorage.getItem(`recording_${dateStr}`);
      days.push({
        date: date,
        completed: !!hasData,
        isToday: i === 0
      });
    }
    return days;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="container mx-auto px-4 py-6">
        {/* Time-Based Greeting */}
        <div className="text-center mb-8">
          {dayComplete && (
            <h2 className="text-3xl font-bold text-black">
              Day Complete! Rest & Recharge
            </h2>
          )}
        </div>

        {!dayComplete ? (
          <div className="space-y-6">
            {/* Step 1: Vision Board - Bigger Images */}
            <div className={`bg-white rounded-2xl shadow-sm border ${currentStep === 1 ? 'border-black' : 'border-gray-100'} overflow-hidden transition-all`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                      1
                    </div>
                    <h3 className="text-lg font-bold">Vision Board - Your Future Self</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentStep > 1 && <CheckCircle className="w-5 h-5 text-black" />}
                    {editingVision ? (
                      <button onClick={() => setEditingVision(false)} className="text-gray-600 hover:text-black">
                        <X className="w-5 h-5" />
                      </button>
                    ) : (
                      <button onClick={() => setEditingVision(true)} className="text-gray-600 hover:text-black">
                        <Edit2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
                
                {currentStep >= 1 && (
                  <div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {visionImages.map((img, i) => (
                        <div key={i} className="relative group aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                          <img 
                            src={img} 
                            alt={`Vision ${i + 1}`} 
                            className="w-full h-full object-cover cursor-pointer" 
                            onClick={() => !editingVision && setEnlargedImage(img)}
                          />
                          {!editingVision && (
                            <button
                              onClick={() => setEnlargedImage(img)}
                              className="absolute top-2 right-2 bg-white/90 border border-gray-200 text-gray-700 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Expand className="w-4 h-4" />
                            </button>
                          )}
                          {editingVision && (
                            <button
                              onClick={() => handleRemoveVisionImage(i)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      {editingVision && (
                        <button
                          onClick={handleAddVisionImage}
                          className="aspect-[4/3] rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-black transition-colors"
                        >
                          <div className="text-center">
                            <ImagePlus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <span className="text-sm text-gray-600">Add Image</span>
                          </div>
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Focus on these images for 5 minutes. Feel them as your reality.
                    </p>
                    {currentStep === 1 && (
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="w-full py-3 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-colors"
                      >
                        I&apos;ve Visualized My Future →
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Record Affirmations with Notion-like editing */}
            <div className={`bg-white rounded-2xl shadow-sm border ${currentStep === 2 ? 'border-black' : 'border-gray-100'} overflow-hidden transition-all`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                      2
                    </div>
                    <h3 className="text-lg font-bold">Record Your Power Affirmations (10-minute script)</h3>
                  </div>
                  {currentStep > 2 && <CheckCircle className="w-5 h-5 text-black" />}
                </div>
                
                {currentStep >= 2 && (
                  <div>
                    {/* Recording Button at Top */}
                    {!todaysRecording ? (
                      <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`w-full py-4 rounded-lg font-bold transition-all flex items-center justify-center gap-3 mb-4 ${
                          isRecording 
                            ? 'bg-red-500 text-white animate-pulse' 
                            : 'bg-black text-white hover:bg-gray-800'
                        }`}
                      >
                        {isRecording ? (
                          <>
                            <StopCircle className="w-5 h-5" />
                            Recording... {formatTime(recordingTime)} / 10:00
                          </>
                        ) : (
                          <>
                            <Mic className="w-5 h-5" />
                            Start 10-Minute Recording
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="text-center text-black font-medium mb-4">
                        ✓ Recording saved
                      </div>
                    )}
                    
                    {/* Editable Affirmations Text with Tiptap Editor */}
                    <div className="relative">
                      {editingAffirmations ? (
                        <div>
                          <AffirmationEditor
                            content={tempAffirmations}
                            onChange={setTempAffirmations}
                            editable={true}
                            placeholder="Write your powerful affirmations here..."
                          />
                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={handleSaveAffirmations}
                              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
                            >
                              <Save className="w-4 h-4" />
                              Save Affirmations
                            </button>
                            <button
                              onClick={handleCancelEditingAffirmations}
                              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          onClick={handleStartEditingAffirmations}
                          className="bg-white border border-gray-200 rounded-lg min-h-[600px] max-h-[800px] overflow-y-auto cursor-pointer hover:border-gray-300 transition-colors group relative"
                        >
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-lg p-2 shadow-sm border border-gray-200 z-10">
                            <Edit2 className="w-4 h-4 text-gray-600" />
                          </div>
                          <AffirmationEditor
                            content={affirmations}
                            onChange={() => {}}
                            editable={false}
                          />
                        </div>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-2">
                      Click to edit with rich formatting • Use toolbar for headers, bold, lists, quotes • Read with full conviction during recording
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: Listen & Lock In */}
            {currentStep >= 3 && (
              <div className={`bg-white rounded-2xl shadow-sm border ${currentStep === 3 ? 'border-black' : 'border-gray-100'} overflow-hidden transition-all`}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                        3
                      </div>
                      <h3 className="text-lg font-bold">Listen & Lock In Your Programming</h3>
                    </div>
                    {hasListened && <CheckCircle className="w-5 h-5 text-black" />}
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-4">
                      Listen to your recording with full presence. This is your subconscious programming.
                    </p>
                    
                    {/* Voice Wave Visualization */}
                    {isPlaying && (
                      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-center gap-1">
                          {[...Array(20)].map((_, i) => (
                            <div
                              key={i}
                              className="w-1 bg-gray-900 rounded-full animate-pulse"
                              style={{
                                height: `${Math.random() * 40 + 10}px`,
                                animationDelay: `${i * 0.1}s`,
                                animationDuration: '1s'
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <button
                      onClick={handlePlayRecording}
                      className="w-full py-4 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-3"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-5 h-5" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-5 h-5" />
                          {hasListened ? 'Listen Again' : 'Listen to Your Recording (Required)'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Set Violent Action */}
            {currentStep >= 4 && (
              <div className={`bg-white rounded-2xl shadow-sm border ${currentStep === 4 ? 'border-black' : 'border-gray-100'} overflow-hidden transition-all`}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 4 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                        4
                      </div>
                      <h3 className="text-lg font-bold">Set Today's ONE Violent Action</h3>
                    </div>
                    {violentAction && <CheckCircle className="w-5 h-5 text-black" />}
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-4">
                      What ONE action terrifies you but will change everything?
                    </p>
                    
                    {/* AI Inspiration Examples */}
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-3 font-semibold">NEED INSPIRATION? CLICK ONE:</p>
                      <div className="space-y-2">
                        <button
                          onClick={() => setViolentAction("Cold call the CEO of my dream client company")}
                          className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-400 transition-colors text-sm"
                        >
                          🎯 <span className="font-medium">Cold call the CEO of my dream client company</span>
                          <span className="text-gray-500 block text-xs mt-1">Break through fear of rejection at the highest level</span>
                        </button>
                        <button
                          onClick={() => setViolentAction("Double my prices and announce it today")}
                          className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-400 transition-colors text-sm"
                        >
                          💰 <span className="font-medium">Double my prices and announce it today</span>
                          <span className="text-gray-500 block text-xs mt-1">Shatter your money ceiling instantly</span>
                        </button>
                        <button
                          onClick={() => setViolentAction("Publish my work publicly despite imperfection")}
                          className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-400 transition-colors text-sm"
                        >
                          🚀 <span className="font-medium">Publish my work publicly despite imperfection</span>
                          <span className="text-gray-500 block text-xs mt-1">Destroy perfectionism paralysis forever</span>
                        </button>
                      </div>
                    </div>
                    
                    <input
                      type="text"
                      value={violentAction}
                      onChange={(e) => setViolentAction(e.target.value)}
                      placeholder="Type your own or choose from above..."
                      className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                    />
                    <button
                      onClick={handleSetViolentAction}
                      disabled={!violentAction}
                      className={`w-full py-3 rounded-lg font-bold transition-colors ${
                        violentAction 
                          ? 'bg-black text-white hover:bg-gray-800' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Lock In My Commitment
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Morning Complete + Evening Review Always Visible */}
            {currentStep >= 5 && (
              <>
                <div id="morning-complete" className="bg-white border-2 border-black rounded-2xl p-6 text-center">
                  <Trophy className="w-12 h-12 mx-auto mb-3 text-black" />
                  <h3 className="text-xl font-bold mb-2 text-black">Morning Protocol Complete!</h3>
                  <p className="text-gray-600">Now go execute your violent action. Complete your evening review tonight.</p>
                </div>

                {/* Evening Review - Always Visible After Morning Complete */}
                <div className="bg-white rounded-2xl shadow-sm border-2 border-black overflow-hidden">
                  <div className="bg-gray-50 border-b border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Moon className="w-6 h-6 text-black" />
                      <h3 className="text-xl font-bold text-black">Evening Review</h3>
                    </div>
                    <p className="text-gray-600">Complete this tonight before bed</p>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    {/* Action Completed */}
                    <div>
                      <p className="font-medium mb-3">Did you complete your violent action?</p>
                      {violentAction && (
                        <p className="text-sm text-gray-600 mb-3 italic">"{violentAction}"</p>
                      )}
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setActionCompleted(true)}
                          className={`py-3 rounded-lg font-bold transition-all ${
                            actionCompleted === true 
                              ? 'bg-black text-white' 
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          YES - Crushed It!
                        </button>
                        <button
                          onClick={() => setActionCompleted(false)}
                          className={`py-3 rounded-lg font-bold transition-all ${
                            actionCompleted === false 
                              ? 'bg-red-500 text-white' 
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          No - I Failed
                        </button>
                      </div>
                    </div>

                    {/* Discipline Rating */}
                    <div>
                      <p className="font-medium mb-3">Rate your discipline (1-10)</p>
                      <div className="flex gap-2">
                        {[1,2,3,4,5,6,7,8,9,10].map(num => (
                          <button
                            key={num}
                            onClick={() => setDisciplineRating(num)}
                            className={`flex-1 h-10 rounded-lg text-sm font-bold transition-all ${
                              num <= disciplineRating 
                                ? 'bg-black text-white' 
                                : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Biggest Win - Journal Entry */}
                    <div>
                      <p className="font-medium mb-3">What was your biggest win today?</p>
                      <textarea
                        value={biggestWin}
                        onChange={(e) => {
                          if (e.target.value.length <= 500) {
                            setBiggestWin(e.target.value);
                          }
                        }}
                        placeholder="Describe your biggest win today. Be specific about what you accomplished, how it made you feel, and why it matters for your transformation..."
                        className="w-full p-4 border border-gray-300 rounded-lg resize-none h-32 focus:outline-none focus:border-gray-500"
                        rows={5}
                        minLength={12}
                        maxLength={500}
                      />
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-gray-500">
                          {biggestWin.length < 12 && biggestWin.length > 0 
                            ? `Minimum 12 characters required (${12 - biggestWin.length} more)` 
                            : biggestWin.length === 0 
                              ? 'Minimum 12 characters' 
                              : ''}
                        </p>
                        <p className="text-xs text-gray-500">
                          {biggestWin.length}/500 characters
                        </p>
                      </div>
                    </div>

                    {/* Complete Day */}
                    <button
                      onClick={handleCompleteDay}
                      disabled={!disciplineRating || biggestWin.length < 12 || actionCompleted === null}
                      className={`w-full py-4 rounded-lg font-bold transition-all ${
                        disciplineRating && biggestWin.length >= 12 && actionCompleted !== null
                          ? 'bg-black text-white hover:bg-gray-800'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Complete Today & Sleep Like a Warrior
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          /* Day Complete State */
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-black" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Day Complete!</h3>
            <p className="text-gray-600 mb-6">You've completed your daily protocol. Rest well.</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
              <Flame className="w-5 h-5 text-gray-600" />
              <span className="font-bold">7 Day Streak</span>
            </div>
          </div>
        )}
      </main>

      {/* Image Enlargement Modal */}
      {enlargedImage && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4"
          onClick={() => setEnlargedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl"
            onClick={() => setEnlargedImage(null)}
          >
            ×
          </button>
          <img 
            src={enlargedImage} 
            alt="Enlarged vision" 
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}