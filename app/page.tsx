'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Play, Volume2, VolumeX, Mail, Youtube, Linkedin } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleApplyNow = () => {
    router.push('/qualification');
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Premium Container - Mobile Optimized */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-20">
        
        {/* Header - Mobile Optimized */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-black mb-4 sm:mb-6 leading-tight">
            Train Your Subconscious,
            <span className="block">Transform Your Reality</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-3 sm:mb-4 font-light px-4 sm:px-0">
            The Operating System for Human Subconscious
          </p>
          <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide">
            by Chris Disciplined
          </p>
        </div>
          
        {/* VSL Video Player - Mobile Optimized */}
        <div className="relative w-full max-w-4xl mx-auto mb-12 sm:mb-16">
          <div className="relative aspect-video bg-gray-100 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-premium-lg">
            <div 
              onClick={handleVideoPlay}
              className="absolute inset-0 flex items-center justify-center cursor-pointer bg-gradient-to-b from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-500"
            >
              {/* Video Placeholder - Mobile Optimized */}
              <div className="text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full bg-white shadow-lg sm:shadow-premium flex items-center justify-center mx-auto hover:scale-105 transition-transform duration-300">
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-black ml-1 sm:ml-2" fill="black" />
                </div>
                <p className="text-black text-xs sm:text-sm md:text-base mt-4 sm:mt-6 font-medium uppercase tracking-wide">
                  Watch The Presentation
                </p>
                <p className="text-gray-500 text-xs mt-1 sm:mt-2">10 minutes</p>
              </div>
              
              {/* Mute/Unmute Button - Mobile Optimized */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 md:bottom-6 md:right-6 p-2 sm:p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                ) : (
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                )}
              </button>
            </div>
          </div>
        </div>
          
        {/* CTA Button - Mobile Optimized */}
        <div className="text-center mb-16 sm:mb-20 px-4 sm:px-0">
          <button
            onClick={handleApplyNow}
            className="w-full sm:w-auto bg-black text-white px-8 sm:px-12 py-4 sm:py-5 text-base sm:text-lg font-medium rounded-lg hover:bg-gray-900 transition-all duration-300 inline-flex items-center justify-center gap-2 sm:gap-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
          >
            Get The Violent Morning Protocol
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <p className="text-gray-500 text-xs sm:text-sm mt-4 sm:mt-6">
            Free 7-day morning transformation blueprint
          </p>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            Already a member?{' '}
            <a 
              href="/signin" 
              onClick={(e) => {
                e.preventDefault();
                router.push('/signin');
              }}
              className="text-black underline hover:no-underline transition-all"
            >
              Sign in here
            </a>
          </p>
        </div>

        {/* Premium Quote Section - Mobile Optimized */}
        <div className="border-t border-gray-200 pt-12 sm:pt-16 mb-12 sm:mb-20">
          <blockquote className="text-center max-w-3xl mx-auto px-4 sm:px-6">
            <p className="text-xl sm:text-2xl md:text-3xl font-serif text-black mb-4 sm:mb-6 leading-relaxed">
              "It doesn't matter what is true—only what I believe is true. 
              With violent work, my beliefs become true."
            </p>
            <cite className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide">
              — Core Affirmation Protocol
            </cite>
          </blockquote>
        </div>
      </div>

      {/* Minimal Footer - Mobile Optimized */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col items-center gap-6">
            {/* Brand */}
            <p className="font-serif text-xl sm:text-2xl text-black">Chris Disciplined</p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="mailto:chris@chrisdisciplined.com"
                className="p-2 hover:bg-black hover:text-white rounded-full transition-all duration-200"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com/@chrisdisciplined"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-black hover:text-white rounded-full transition-all duration-200"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="https://tiktok.com/@chrisdisciplined"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-black hover:text-white rounded-full transition-all duration-200"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com/in/chrisdisciplined"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-black hover:text-white rounded-full transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            
            {/* Links and Copyright */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-xs sm:text-sm text-gray-600">
              <div className="flex gap-4 sm:gap-6">
                <a href="/terms" className="hover:text-black transition-colors">Terms</a>
                <a href="/privacy" className="hover:text-black transition-colors">Privacy</a>
              </div>
              <span className="hidden sm:inline">•</span>
              <p>© 2025 All rights reserved</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}