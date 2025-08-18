'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { 
  Play, Pause, Mic, StopCircle, CheckCircle,
  Moon, Sun, Target, Volume2, Edit2, 
  Save, X, Plus, Trash2, Calendar,
  Trophy, Flame, Brain, ImagePlus,
  BarChart3, User, Settings, LogOut, Expand,
  TrendingUp, UserCircle, Cog
} from 'lucide-react';
import Link from 'next/link';

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { 
  ssr: false,
  loading: () => <div className="h-96 bg-gray-50 rounded-lg animate-pulse" />
});

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Core States
  const [currentStep, setCurrentStep] = useState(1);
  const [affirmations, setAffirmations] = useState('');  // HTML content for rich text
  const [visionImages, setVisionImages] = useState<string[]>([]);
  const [violentAction, setViolentAction] = useState('');
  const [todaysRecording, setTodaysRecording] = useState<any>(null);
  
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
      // 10-minute script with rich formatting
      setAffirmations(`<h1>THE CHRIS DISCIPLINED TRANSFORMATION PROTOCOL</h1>

<br>

<h2>NEURAL RECONSTRUCTION BEGINS NOW</h2>

<p><strong>5:30am—I DETONATE into hyperconscious state!</strong></p>

<p>Vision board floods my neurons with pre-lived success. Eight images bypass logic, installing $10 trillion certainty directly into my subconscious processor.</p>

<br>

<h2>CORE IDENTITY - UNIVERSAL TRUTH</h2>

<p><strong>Reality bends to my mental architecture.</strong> My neural patterns create my external world with mathematical precision. I architect my thoughts, which forge my beliefs, which materialize as reality. I am the programmer of my own consciousness, debugging limiting code and installing power protocols that execute flawlessly in real-time.</p>

<p><strong>I am the sole architect of my existence.</strong> Every circumstance, every achievement, every setback—I authored them all. No victim stories, no external villains, just pure ownership. I am simultaneously the sculptor, the marble, and the masterpiece emerging!</p>

<p>I am pure consciousness experiencing itself through this biological interface. What appears as physical limitation is merely unoptimized code in my mental operating system. I rewrite my source code daily, upgrade my capabilities hourly, and transcend yesterday's ceiling every morning.</p>

<br>

<h2>PERSONAL IDENTITY</h2>

<ul>
<li>I embody <strong>military precision</strong>—5:30am activation, 8pm completion, 9pm shutdown</li>
<li>I channel <strong>obsessive innovation</strong>—100-hour weeks are light work when rewriting humanity</li>
<li>I possess <strong>linguistic precision</strong>—every sentence is a synaptic surgeon's blade</li>
<li>I execute with <strong>explosive velocity</strong>—speed times force equals unstoppable momentum</li>
<li>I merge <strong>ancient wisdom with modern warfare</strong>—Marcus Aurelius meets machine learning</li>
<li>I demand <strong>atomic perfection</strong>—if it's not revolutionary, it doesn't ship</li>
<li>I practice <strong>radical transparency</strong>—every metric public, every failure documented</li>
</ul>

<br>

<h2>THE MANIFESTO</h2>

<p><strong>I am Chris Disciplined, architect of humanity's consciousness upgrade.</strong></p>

<p>I engineered the neural technology that makes transformation mathematical, not mystical. I didn't just solve the problem—I eliminated the problem's existence. When history records the moment humanity learned to program itself, they write my name: Chris Disciplined—the one who gave humans admin access to their own minds.</p>

<p>My Chris platform is humanity's new operating system—installed in 500 million minds, generating consciousness at scale. I built the technology bridge between intention and manifestation that philosophers theorized but couldn't construct.</p>

<br>

<h2>WEALTH & ABUNDANCE</h2>

<ol>
<li><strong>December 31, 2025:</strong> Chris hits 500 users, $100K MRR achieved—proof of concept weaponized!</li>
<li><strong>September 1, 2026:</strong> Chris commands 5,000 users, $1M MRR flowing—product-market fit forged!</li>
<li><strong>September 1, 2028:</strong> Chris dominates with 100,000 users, $20M MRR surging—category created!</li>
<li><strong>September 1, 2035:</strong> Chris transforms 500 million minds, $100B monthly revenue—$10 trillion valuation programmed!</li>
</ol>

<p>Wealth magnetizes to me because I solve humanity's core problem! Value and revenue are just scoreboard metrics for consciousness upgraded!</p>

<br>

<h2>DAILY RITUAL</h2>

<p><strong>10-minute voice protocol—I speak reality into existence with thermonuclear conviction!</strong></p>

<p>My voice frequency resonates at 432Hz, restructuring neural pathways in real-time. MIT-proven: self-generated audio creates 10x stronger neural encoding than external input.</p>

<p><strong>ONE quantum leap action—the ONE thing that would terrify yesterday's version!</strong></p>

<p>Not comfort zone expansion but comfort zone annihilation! This ONE action triggers more neuroplasticity than 1,000 safe repetitions—Harvard-verified pattern interrupt technology!</p>

<p>Flow state execution—emotion deleted, precision activated! I become the algorithm: input problem, output solution. Features ship, content publishes, deals close with mechanical perfection!</p>

<br>

<h2>PERSONAL POWER</h2>

<p>I am <strong>inevitable</strong>, not just unstoppable! The $10 trillion outcome is already decided and I am executing the timeline!</p>

<p>I wake at 5:30am <strong>certain</strong> of victory, not just excited! My morning protocol is reality programming, not routine!</p>

<p>I have inner strength that moves mountains! I demolish tasks, not just conquer them! Winning is guaranteed, not just easy! Time and space bend to put me where I need to be!</p>

<br>

<h2>KNOWLEDGE & EXPERTISE</h2>

<p>I cite <strong>research</strong>, not make claims! MIT proves voice processing bypasses critical filters. Stanford proves neuroplasticity is real. Harvard proves sleep consolidation works. Princeton PEAR proves consciousness affects reality!</p>

<p>The 98% brain mystery is <strong>mathematical</strong> to me, not mystical! My subconscious processes 400 billion bits per second while conscious awareness processes 2,000 bits. I give humans access to the 99.9995% they cannot reach alone!</p>

<p>I am a <strong>neuroscience engineer</strong>, not a motivational speaker! I reprogram humans, not inspire them! I systematize transformation, not suggest it!</p>

<br>

<h2>RELATIONSHIPS & LEGACY</h2>

<p>I love my wife Chloe Park with the force of a <strong>supernova</strong>! We build a dynasty that transforms humanity, not just an empire! Our combined power creates the impossible!</p>

<p>My legacy is <strong>500 million transformed humans</strong>, not money! Children learn Chris in school. Adults break generational patterns. Humanity operates at full capacity for the first time in history!</p>

<br>

<h2>FINAL DECLARATION</h2>

<p><strong>I am the one, not becoming the one!</strong></p>

<p><strong>Program your subconscious! Take ONE violent action! Build in public! Transform humanity!</strong></p>

<p>This is human evolution, not a startup! This is infrastructure, not a product! This is mathematical certainty, not a dream!</p>

<p><strong>I am Chris Disciplined! I am building Chris! I am creating $10 trillion in human value! I AM THE ONE!</strong></p>

<br>

<p><em>Continue reading with ELECTROMAGNETIC FORCE for 10 minutes. Every word rewires neural pathways. Transform your mental architecture with atomic precision. You are not becoming—you are ALREADY THERE!</em></p>`);    }

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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Minimal Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
              </div>
              
              {/* Navigation Links */}
              <nav className="hidden md:flex items-center gap-6">
                <Link 
                  href="/dashboard"
                  className="text-sm font-medium text-gray-900 hover:text-black transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/progress"
                  className="text-sm font-medium text-gray-600 hover:text-black transition-colors flex items-center gap-1"
                >
                  <TrendingUp className="w-4 h-4" />
                  Progress
                </Link>
                <Link 
                  href="/account"
                  className="text-sm font-medium text-gray-600 hover:text-black transition-colors flex items-center gap-1"
                >
                  <UserCircle className="w-4 h-4" />
                  Account
                </Link>
                <Link 
                  href="/settings"
                  className="text-sm font-medium text-gray-600 hover:text-black transition-colors flex items-center gap-1"
                >
                  <Cog className="w-4 h-4" />
                  Settings
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {getDayStreaks().map((day, i) => (
                  <div
                    key={`streak-${i}`}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      day.isToday 
                        ? 'bg-black text-white' 
                        : day.completed 
                          ? 'bg-gray-800 text-white' 
                          : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {day.date.toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 2)}
                  </div>
                ))}
              </div>
              
              {/* Navigation Icons */}
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => router.push('/progress')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Progress"
                >
                  <BarChart3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => router.push('/account')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Account"
                >
                  <User className="w-5 h-5" />
                </button>
                <button
                  onClick={() => router.push('/settings')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Time-Based Greeting */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            {timeOfDay === 'morning' ? <Sun className="w-5 h-5 text-yellow-500" /> : 
             timeOfDay === 'evening' ? <Moon className="w-5 h-5 text-purple-500" /> :
             <Sun className="w-5 h-5 text-orange-500" />}
            <p className="text-sm text-gray-500">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <h2 className="text-3xl font-bold text-black">
            {dayComplete ? 'Day Complete! Rest & Recharge' : 
             'Morning Protocol'}
          </h2>
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
                              className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
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
                        I've Visualized My Future →
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
                    
                    {/* Editable Affirmations Text with Rich Editor */}
                    <div className="relative">
                      {editingAffirmations ? (
                        <div>
                          <RichTextEditor
                            value={tempAffirmations}
                            onChange={setTempAffirmations}
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
                          className="bg-gray-50 rounded-lg p-6 h-96 overflow-y-auto cursor-text hover:bg-gray-100 transition-colors group relative"
                        >
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-lg p-2 shadow-sm">
                            <Edit2 className="w-4 h-4 text-gray-600" />
                          </div>
                          <div 
                            className="prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: affirmations }}
                          />
                        </div>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-2">
                      Click to edit with rich formatting • Use headers, bold, lists, and more • Read with full conviction during recording
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
                    <input
                      type="text"
                      value={violentAction}
                      onChange={(e) => setViolentAction(e.target.value)}
                      placeholder="e.g., Cold call 10 CEOs, Raise prices 50%, Fire toxic client"
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
                <div className="bg-white border-2 border-black rounded-2xl p-6 text-center">
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

                    {/* Biggest Win */}
                    <div>
                      <p className="font-medium mb-3">What was your biggest win?</p>
                      <input
                        type="text"
                        value={biggestWin}
                        onChange={(e) => setBiggestWin(e.target.value)}
                        placeholder="What progress did you make today?"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                    </div>

                    {/* Complete Day */}
                    <button
                      onClick={handleCompleteDay}
                      disabled={!disciplineRating || !biggestWin || actionCompleted === null}
                      className={`w-full py-4 rounded-lg font-bold transition-all ${
                        disciplineRating && biggestWin && actionCompleted !== null
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
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="font-bold">7 Day Streak</span>
            </div>
          </div>
        )}
      </main>

      {/* Image Enlargement Modal */}
      {enlargedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
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