'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { 
  Play, Pause, Mic, StopCircle, CheckCircle,
  Moon, Sun, Target, Volume2, Edit2, 
  Save, X, Plus, Trash2, Calendar,
  Trophy, Flame, Brain, ImagePlus,
  BarChart3, User, Settings, LogOut, Expand
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { defaultAffirmationsHTML } from '@/lib/affirmations-html';

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
    // Temporarily disabled auth for development
    // const mockUser = localStorage.getItem('mockUser');
    // if (!mockUser) {
    //   router.push('/signin');
    // } else {
    //   setUser(JSON.parse(mockUser));
    // }
    
    // Set default user for development
    setUser({ name: 'Chris', email: 'chris@disciplined.com' });

    // Load saved data
    const storedAffirmations = localStorage.getItem('generatedAffirmations');
    if (storedAffirmations) {
      setAffirmations(storedAffirmations);
    } else {
      // Use HTML formatted affirmations from Chris Affirmation.md
      setAffirmations(defaultAffirmationsHTML);
    }

    // Load vision images
    const storedImages = localStorage.getItem('visionBoardImages');
    if (storedImages) {
      setVisionImages(JSON.parse(storedImages));
    } else {
      // Use local optimized images from Example folder
      setVisionImages([
        '/Example/11.png',
        '/Example/12.png',
        '/Example/13.png',
        '/Example/14.png',
        '/Example/15.png',
        '/Example/16.png',
        '/Example/17.png'
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
                          <Image 
                            src={img} 
                            alt={`Vision ${i + 1}`} 
                            width={400}
                            height={300}
                            className="w-full h-full object-cover cursor-pointer" 
                            onClick={() => !editingVision && setEnlargedImage(img)}
                            loading="lazy"
                            quality={85}
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
          <Image 
            src={enlargedImage} 
            alt="Enlarged vision" 
            width={1200}
            height={900}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
            quality={90}
          />
        </div>
      )}
    </div>
  );
}