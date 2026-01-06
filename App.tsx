
import React, { useState, useRef } from 'react';
import Snowfall from './components/Snowfall';
import GiftBox from './components/GiftBox';
import Fireworks from './components/Fireworks';
import { CHRISTMAS_CONTENTS } from './data/content';
import { ChristmasContent } from './types';
import { saveUserToFirebase, getRandomContent } from './services/firebaseService';

const App: React.FC = () => {
  const [step, setStep] = useState<'welcome' | 'box' | 'message'>('welcome');
  const [userName, setUserName] = useState('');
  const [isOpening, setIsOpening] = useState(false);
  const [content, setContent] = useState<ChristmasContent | null>(null);
  const [error, setError] = useState('');
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const giftSoundRef = useRef<HTMLAudioElement | null>(null);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim().length < 2) {
      setError('يرجى إدخال اسمك أولاً');
      return;
    }
    setError('');
    try {
      await saveUserToFirebase(userName);
      setStep('box');
      
      // تهيئة موسيقى الكريسماس (We Wish You a Merry Christmas)
      const bgMusic = new Audio('https://assets.mixkit.co/music/preview/mixkit-we-wish-you-a-merry-christmas-1175.mp3');
      bgMusic.loop = true;
      bgMusic.volume = 0.3; // خفض موسيقى الخلفية قليلاً لتوضيح الأصوات الأخرى
      bgMusicRef.current = bgMusic;
      
      // تشغيل الموسيقى بعد أول تفاعل للمستخدم
      bgMusic.play().catch(err => console.log("Auto-play blocked, will play on next interaction", err));

      // تهيئة صوت "فرقة احتفالية" (Fanfare) عند فتح الهدية
      giftSoundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء حفظ البيانات، حاول مجدداً');
    }
  };

  const handleOpenGift = () => {
    setIsOpening(true);
    
    // التأكد من عمل الموسيقى إذا تم حظرها سابقاً
    if (bgMusicRef.current && bgMusicRef.current.paused) {
      bgMusicRef.current.play();
    }

    // تشغيل صوت الفرقة الاحتفالية بأقصى وضوح وحجم
    if (giftSoundRef.current) {
      giftSoundRef.current.volume = 1.0; // رفع الصوت للحد الأقصى للتوضيح
      giftSoundRef.current.play().catch(e => console.log("Gift sound failed", e));
      
      // خفض موسيقى الخلفية مؤقتاً لبروز صوت الاحتفال
      if (bgMusicRef.current) bgMusicRef.current.volume = 0.1;
      setTimeout(() => {
        if (bgMusicRef.current) bgMusicRef.current.volume = 0.3;
      }, 4000);
    }

    // اختيار محتوى عشوائي
    const selectedContent = getRandomContent(CHRISTMAS_CONTENTS);
    setContent(selectedContent);
    
    // انتقال المرحلة بعد انتهاء حركة الصندوق
    setTimeout(() => {
      setStep('message');
    }, 1500);
  };

  return (
    <div className="min-h-screen relative text-white selection:bg-red-500 selection:text-white overflow-hidden bg-[#050510]">
      {/* Background Decor */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(40,20,20,1)_0%,rgba(5,5,16,1)_100%)] z-[-2]"></div>
      <Snowfall />
      
      {step === 'message' && <Fireworks />}

      {/* Main Content Container */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        
        {step === 'welcome' && (
          <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-[0_0_40px_rgba(255,0,0,0.1)] transform transition-all duration-700 animate-fadeIn">
            <div className="text-center mb-10">
              <div className="inline-block p-4 rounded-full bg-red-500/10 mb-4 animate-pulse">
                <span className="text-5xl">🎅</span>
              </div>
              <h1 className="text-4xl font-amiri font-bold text-red-500 mb-2 drop-shadow-md">عيد ميلاد مجيد</h1>
              <p className="text-gray-400">سجل اسمك للحصول على معايدة خاصة</p>
            </div>
            
            <form onSubmit={handleStart} className="space-y-6">
              <div className="space-y-2">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-center text-xl placeholder-gray-600"
                  placeholder="اكتب اسمك هنا..."
                />
              </div>
              {error && <p className="text-red-400 text-sm text-center animate-bounce">{error}</p>}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 via-red-500 to-red-700 text-white font-bold py-4 rounded-2xl shadow-[0_4px_20px_rgba(220,38,38,0.4)] transform active:scale-95 transition-all text-lg hover:shadow-red-500/50"
              >
                ابدأ رحلة الميلاد ✨
              </button>
            </form>
          </div>
        )}

        {step === 'box' && (
          <div className="flex flex-col items-center animate-fadeIn text-center">
            <div className="mb-12">
              <h2 className="text-4xl font-amiri font-bold text-yellow-400 mb-4 drop-shadow-lg">مرحباً {userName}!</h2>
              <p className="text-gray-300 text-xl max-w-xs mx-auto leading-relaxed">
                تنتظرك هدية سماوية خلف هذا الصندوق...
              </p>
            </div>
            <GiftBox onOpen={handleOpenGift} isOpen={isOpening} />
          </div>
        )}

        {step === 'message' && content && (
          <div className="w-full max-w-2xl animate-scaleIn text-center space-y-8 bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[3rem] shadow-[0_0_80px_rgba(255,215,0,0.1)] relative z-30">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-4">
              <span className="text-5xl animate-bounce" style={{ animationDelay: '0.1s' }}>🎺</span>
              <span className="text-6xl animate-bounce">🌟</span>
              <span className="text-5xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎁</span>
            </div>

            <div className="pt-6">
              <h2 className="text-5xl font-amiri font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-600 mb-8 drop-shadow-xl">
                ميلاد مجيد يا {userName}
              </h2>

              <div className="space-y-8">
                <p className="text-2xl leading-relaxed text-gray-100 font-medium">
                  {content.greeting}
                </p>
                
                <div className="flex items-center justify-center gap-4 opacity-50">
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-yellow-500"></div>
                  <span className="text-yellow-500">✥</span>
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-yellow-500"></div>
                </div>
                
                <div className="relative py-6 px-8 rounded-3xl bg-white/5 border-r-8 border-yellow-500/50">
                  <p className="text-2xl font-amiri mb-3 leading-loose text-yellow-100 italic">
                    " {content.verse} "
                  </p>
                  <p className="text-sm font-bold text-yellow-500/80 tracking-widest">— {content.reference}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setStep('box');
                setIsOpening(false);
              }}
              className="mt-10 px-8 py-3 rounded-full bg-white/5 hover:bg-white/10 text-sm text-gray-400 hover:text-white transition-all flex items-center justify-center gap-3 mx-auto border border-white/5"
            >
              <span>فتح هدية أخرى ممتلئة بالبركة</span>
              <span className="text-lg">🎁</span>
            </button>
          </div>
        )}
      </main>

      {/* Footer Decor with Enlarged English Developer Credit */}
      <footer className="fixed bottom-0 left-0 w-full p-6 flex flex-col items-center gap-2 text-white/30 uppercase tracking-[0.2em] font-light pointer-events-none z-0">
        <div className="flex justify-between w-full px-6 text-[12px] opacity-60">
          <span>Gloria in Excelsis Deo</span>
          <span>Hallelujah</span>
        </div>
        <div className="text-xl normal-case tracking-[0.05em] opacity-90 font-sans font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-400 to-yellow-600 drop-shadow-sm">
          Developed by Girges
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); filter: blur(10px); }
          to { opacity: 1; transform: scale(1); filter: blur(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .font-tajawal {
          font-family: 'Tajawal', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default App;
