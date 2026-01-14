'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Volume2, LogOut, Menu, Trash2, Play, X } from 'lucide-react';
import { storage, ChatSession, ChatMessage } from '@/lib/storage';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showWizard, setShowWizard] = useState(true);
  const [wizardStep, setWizardStep] = useState(1);
  const [targetLanguage, setTargetLanguage] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [learningGoal, setLearningGoal] = useState('');
  const [level, setLevel] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const languages = [
    { id: 'turkish', name: 'Türkçe', flag: '🇹🇷' },
    { id: 'english', name: 'İngilizce', flag: '🇬🇧' },
    { id: 'german', name: 'Almanca', flag: '🇩🇪' },
    { id: 'french', name: 'Fransızca', flag: '🇫🇷' },
    { id: 'spanish', name: 'İspanyolca', flag: '🇪🇸' },
    { id: 'italian', name: 'İtalyanca', flag: '🇮🇹' },
  ];

  const teachers = [
    { id: 'ayse', name: 'Ayşe', gender: 'Kadın', avatar: '👩', sample: 'Merhaba, ben Ayşe. Seninle Türkçe öğrenmek için çok heyecanlıyım!' },
    { id: 'mehmet', name: 'Mehmet', gender: 'Erkek', avatar: '👨', sample: 'Selam, ben Mehmet. Birlikte harika bir öğrenme yolculuğuna çıkacağız!' },
    { id: 'zeynep', name: 'Zeynep', gender: 'Kadın', avatar: '👩‍🏫', sample: 'Merhaba, ben Zeynep. Konuşarak öğrenmek çok eğlenceli olacak!' },
    { id: 'ahmet', name: 'Ahmet', gender: 'Erkek', avatar: '👨‍🏫', sample: 'Merhaba, ben Ahmet. Sakin ve etkili bir şekilde öğreteceğim.' },
  ];

  const learningGoals = [
    { id: 'travel', name: 'Seyahat', icon: '✈️', desc: 'Türkiye\'de tatil yapmak istiyorum' },
    { id: 'work', name: 'İş', icon: '💼', desc: 'Türkiye\'de çalışmak istiyorum' },
    { id: 'study', name: 'Eğitim', icon: '🎓', desc: 'Türkiye\'de okumak istiyorum' },
    { id: 'culture', name: 'Kültür', icon: '🎭', desc: 'Türk kültürünü öğrenmek istiyorum' },
    { id: 'family', name: 'Aile', icon: '👨‍👩‍👧', desc: 'Ailemle konuşmak istiyorum' },
    { id: 'general', name: 'Genel', icon: '🌍', desc: 'Genel olarak Türkçe bilmek istiyorum' },
  ];

  const levels = [
    { id: 'beginner', name: 'Başlangıç', icon: '🌱', desc: 'Hiç Türkçe bilmiyorum' },
    { id: 'elementary', name: 'Temel', icon: '📚', desc: 'Basit cümleler kurabiliyorum' },
    { id: 'intermediate', name: 'Orta', icon: '💬', desc: 'Günlük konuşmalar yapabiliyorum' },
    { id: 'advanced', name: 'İleri', icon: '🎓', desc: 'Akıcı konuşabiliyorum' },
  ];

  useEffect(() => {
    const user = storage.getCurrentUser();
    if (!user) {
      window.location.href = '/';
      return;
    }
    setCurrentUser(user);
    
    const sessions = storage.getChatSessions();
    setChatSessions(sessions);
    
    if (user.turkishLevel && sessions.length > 0) {
      setShowWizard(false);
      loadSession(sessions[0].id);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadSession = (sessionId: string) => {
    const session = storage.getChatSession(sessionId);
    if (session) {
      setCurrentSession(session);
      setMessages(session.messages);
      setTargetLanguage(session.targetLanguage);
      setSelectedTeacher(session.teacher);
      setLearningGoal(session.learningGoal);
      setLevel(session.level);
    }
  };

  const playVoiceSample = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'tr-TR';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startConversation = () => {
    setShowWizard(false);
    
    const session = storage.createChatSession({
      targetLanguage,
      selectedTeacher,
      learningGoal,
      level
    });
    
    setCurrentSession(session);
    
    const teacher = teachers.find(t => t.id === selectedTeacher);
    const lang = languages.find(l => l.id === targetLanguage);
    const welcomeMessage: ChatMessage = {
      id: 1,
      text: `Merhaba ${currentUser?.firstName}! Ben ${teacher?.name}, senin ${lang?.name} öğretmeninim. 🎤 Mikrofona basarak konuşmaya başla!`,
      sender: 'ai',
      timestamp: new Date().toISOString(),
    };
    
    const updatedSession = storage.addMessageToSession(session.id, welcomeMessage);
    setMessages(updatedSession.messages);
    setChatSessions([updatedSession, ...chatSessions]);
    
    setTimeout(() => playVoiceSample(welcomeMessage.text), 500);
  };

  const handleSendMessage = () => {
    if (!inputText.trim() || !currentSession) return;

    const newMessage: ChatMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    const updatedSession = storage.addMessageToSession(currentSession.id, newMessage);
    setMessages(updatedSession.messages);
    setInputText('');

    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: messages.length + 2,
        text: `"${inputText}" - Harika! Telaffuzun çok iyi. Devam edelim! (Gerçek AI için API_GUIDE.md'ye bakın)`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        translation: 'Great! Your pronunciation is very good. Let\'s continue!',
      };
      const finalSession = storage.addMessageToSession(currentSession.id, aiResponse);
      setMessages(finalSession.messages);
      setChatSessions(prev => prev.map(s => s.id === currentSession.id ? finalSession : s));
      playVoiceSample(aiResponse.text);
    }, 1000);
  };

  const toggleRecording = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Tarayıcınız ses tanımayı desteklemiyor. Chrome veya Edge kullanın.');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'tr-TR';
      recognition.continuous = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript && currentSession) {
          const voiceMessage: ChatMessage = {
            id: messages.length + 1,
            text: transcript,
            sender: 'user',
            timestamp: new Date().toISOString(),
          };
          const updatedSession = storage.addMessageToSession(currentSession.id, voiceMessage);
          setMessages(updatedSession.messages);
          
          setTimeout(() => {
            const aiResponse: ChatMessage = {
              id: messages.length + 2,
              text: `"${transcript}" - Mükemmel! Telaffuzun çok iyi. Devam edelim!`,
              sender: 'ai',
              timestamp: new Date().toISOString(),
            };
            const finalSession = storage.addMessageToSession(currentSession.id, aiResponse);
            setMessages(finalSession.messages);
            playVoiceSample(aiResponse.text);
          }, 1000);
        }
      };

      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
    }
  };

  const handleLogout = () => {
    storage.logoutUser();
    window.location.href = '/';
  };

  const deleteSession = (sessionId: string) => {
    if (confirm('Bu konuşmayı silmek istediğinden emin misin?')) {
      storage.deleteChatSession(sessionId);
      setChatSessions(prev => prev.filter(s => s.id !== sessionId));
      
      if (currentSession?.id === sessionId) {
        const remaining = chatSessions.filter(s => s.id !== sessionId);
        if (remaining.length > 0) {
          loadSession(remaining[0].id);
        } else {
          setMessages([]);
          setCurrentSession(null);
          setShowWizard(true);
        }
      }
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative">
      {/* Wizard */}
      {showWizard && (
        <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-6">
          <div className="max-w-4xl w-full">
            {/* Step 1: Dil Seçimi */}
            {wizardStep === 1 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                <h2 className="text-5xl font-bold mb-4">Hangi dili öğrenmek istiyorsun?</h2>
                <p className="text-gray-400 mb-12 text-xl">Konuşarak öğrenmeye hazır mısın?</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {languages.map((lang) => (
                    <motion.button
                      key={lang.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setTargetLanguage(lang.id);
                        setWizardStep(2);
                      }}
                      className="p-6 rounded-2xl border-2 border-white/10 bg-white/5 hover:border-purple-500 hover:bg-purple-500/10 transition-all"
                    >
                      <div className="text-5xl mb-3">{lang.flag}</div>
                      <div className="font-bold text-lg">{lang.name}</div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Öğretmen Seçimi */}
            {wizardStep === 2 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                <h2 className="text-5xl font-bold mb-4">Öğretmenini seç 🎭</h2>
                <p className="text-gray-400 mb-12 text-xl">Sesinle konuşacağın öğretmeni seç</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {teachers.map((teacher) => (
                    <motion.div key={teacher.id} className="relative">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedTeacher(teacher.id);
                          setWizardStep(3);
                        }}
                        className="w-full p-6 rounded-2xl border-2 border-white/10 bg-white/5 hover:border-purple-500 hover:bg-purple-500/10 transition-all"
                      >
                        <div className="text-6xl mb-3">{teacher.avatar}</div>
                        <div className="font-bold text-lg mb-1">{teacher.name}</div>
                        <div className="text-sm text-gray-400">{teacher.gender}</div>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => playVoiceSample(teacher.sample)}
                        className="absolute top-2 right-2 p-2 bg-purple-500/20 hover:bg-purple-500/40 rounded-full transition-colors"
                      >
                        <Play className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Öğrenme Amacı */}
            {wizardStep === 3 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                <h2 className="text-5xl font-bold mb-4">Neden öğrenmek istiyorsun?</h2>
                <p className="text-gray-400 mb-12 text-xl">Sana en uygun içerikleri hazırlayalım</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {learningGoals.map((goal) => (
                    <motion.button
                      key={goal.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setLearningGoal(goal.id);
                        setWizardStep(4);
                      }}
                      className="p-6 rounded-2xl border-2 border-white/10 bg-white/5 hover:border-purple-500 hover:bg-purple-500/10 transition-all text-left"
                    >
                      <div className="text-4xl mb-3">{goal.icon}</div>
                      <div className="font-bold text-lg mb-2">{goal.name}</div>
                      <div className="text-sm text-gray-400">{goal.desc}</div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4: Seviye Seçimi */}
            {wizardStep === 4 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                <h2 className="text-5xl font-bold mb-4">Seviyeni belirle</h2>
                <p className="text-gray-400 mb-12 text-xl">Sana uygun zorlukta dersler vereceğiz</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                  {levels.map((lvl) => (
                    <motion.button
                      key={lvl.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setLevel(lvl.id);
                        setWizardStep(5);
                      }}
                      className="p-6 rounded-2xl border-2 border-white/10 bg-white/5 hover:border-purple-500 hover:bg-purple-500/10 transition-all text-left"
                    >
                      <div className="text-5xl mb-3">{lvl.icon}</div>
                      <div className="font-bold text-xl mb-2">{lvl.name}</div>
                      <div className="text-sm text-gray-400">{lvl.desc}</div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 5: Özet */}
            {wizardStep === 5 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                <h2 className="text-5xl font-bold mb-4">Harika! Hazırız! 🎉</h2>
                <p className="text-gray-400 mb-8 text-xl">Konuşarak dil öğrenmeye başlayalım</p>
                <div className="max-w-md mx-auto mb-12 p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/20">
                  <div className="text-sm text-gray-300 space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Dil:</span>
                      <span className="font-semibold">{languages.find(l => l.id === targetLanguage)?.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Öğretmen:</span>
                      <span className="font-semibold">{teachers.find(t => t.id === selectedTeacher)?.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Amaç:</span>
                      <span className="font-semibold">{learningGoals.find(g => g.id === learningGoal)?.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Seviye:</span>
                      <span className="font-semibold">{levels.find(l => l.id === level)?.name}</span>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startConversation}
                  className="px-12 py-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full font-bold text-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all"
                >
                  Konuşmaya Başla 🎤
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-md bg-black/50 p-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <Menu className="w-6 h-6" />
            </motion.button>
            <h1 className="text-xl font-bold">KonuşTürk</h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLogout}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </motion.button>
        </div>
      </header>

      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSidebar(false)}
              className="fixed inset-0 bg-black/60 z-40"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-gray-900 border-r border-white/10 z-50 p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Geçmiş Konuşmalar</h2>
                <button onClick={() => setShowSidebar(false)} className="p-2 hover:bg-white/10 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2">
                {chatSessions.map((session) => (
                  <div key={session.id} className="group relative">
                    <button
                      onClick={() => {
                        loadSession(session.id);
                        setShowSidebar(false);
                      }}
                      className={`w-full p-4 rounded-xl text-left transition-colors ${
                        currentSession?.id === session.id
                          ? 'bg-purple-500/20 border border-purple-500/50'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="font-semibold truncate">{session.title}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(session.updatedAt).toLocaleDateString('tr-TR')} • {session.messages.length} mesaj
                      </div>
                    </button>
                    <button
                      onClick={() => deleteSession(session.id)}
                      className="absolute top-2 right-2 p-2 opacity-0 group-hover:opacity-100 bg-red-500/20 hover:bg-red-500/40 rounded-full transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-4 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600'
                    : 'bg-white/10'
                }`}
              >
                <p className="text-lg">{message.text}</p>
                {message.translation && (
                  <p className="text-sm text-gray-300 mt-2 italic">📖 {message.translation}</p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">
                    {new Date(message.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {message.sender === 'ai' && (
                    <button
                      onClick={() => playVoiceSample(message.text)}
                      className="p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input - Konuşma Odaklı */}
      {!showWizard && (
        <div className="border-t border-white/10 bg-black/50 backdrop-blur-md p-6">
          <div className="max-w-3xl mx-auto">
            {/* Ana Mikrofon Butonu */}
            <div className="flex items-center justify-center mb-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleRecording}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                  isRecording
                    ? 'bg-red-500 shadow-2xl shadow-red-500/50 animate-pulse'
                    : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:shadow-2xl hover:shadow-purple-500/50'
                }`}
              >
                <Mic className="w-12 h-12" />
              </motion.button>
            </div>
            
            <div className="text-center mb-4">
              <p className="text-sm text-gray-400">
                {isRecording ? '🎙️ Dinliyorum... Konuş!' : '🎤 Mikrofona bas ve konuşmaya başla'}
              </p>
            </div>

            {/* İkincil: Yazı Girişi */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Veya buraya yaz..."
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-sm"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                className="p-3 bg-purple-500 hover:bg-purple-600 rounded-xl transition-colors"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
