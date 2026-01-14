'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Check } from 'lucide-react';
import { storage } from '@/lib/storage';

const turkishLevels = [
  { code: 'beginner', name: 'Başlangıç', icon: '🌱', description: 'Hiç Türkçe bilmiyorum' },
  { code: 'elementary', name: 'Temel', icon: '📚', description: 'Basit cümleler kurabiliyorum' },
  { code: 'intermediate', name: 'Orta', icon: '💬', description: 'Günlük konuşmalar yapabiliyorum' },
  { code: 'advanced', name: 'İleri', icon: '🎓', description: 'Akıcı konuşabiliyorum' },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    turkishLevel: '',
  });

  useEffect(() => {
    // Check if user is logged in
    const user = storage.getCurrentUser();
    if (!user) {
      window.location.href = '/';
    }
  }, []);

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      // Save user data
      try {
        storage.updateUser({
          firstName: formData.firstName,
          lastName: formData.lastName,
          turkishLevel: formData.turkishLevel,
        });
        window.location.href = '/chat';
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  };

  const handleLevelSelect = (code: string) => {
    setFormData({ ...formData, turkishLevel: code });
  };

  const isStepValid = () => {
    if (step === 1) return formData.firstName && formData.lastName;
    if (step === 2) return formData.turkishLevel;
    return false;
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {[1, 2].map((num) => (
              <motion.div
                key={num}
                initial={false}
                animate={{
                  scale: step >= num ? 1 : 0.8,
                  opacity: step >= num ? 1 : 0.5,
                }}
                className="flex items-center"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= num
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600'
                      : 'bg-white/10'
                  }`}
                >
                  {step > num ? <Check className="w-5 h-5" /> : num}
                </div>
                {num < 2 && (
                  <div
                    className={`w-32 h-1 mx-2 rounded ${
                      step > num ? 'bg-gradient-to-r from-purple-500 to-pink-600' : 'bg-white/10'
                    }`}
                  />
                )}
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>Bilgiler</span>
            <span>Seviye</span>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-8 md:p-12"
          >
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="w-8 h-8 text-purple-500" />
                  <h2 className="text-4xl font-bold">Seni Tanıyalım</h2>
                </div>
                <p className="text-gray-400 mb-8 text-lg">
                  Kişiselleştirilmiş bir öğrenme deneyimi için adını ve soyadını öğrenmek istiyoruz.
                </p>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Adın
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-lg"
                      placeholder="Örn: Ahmet"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Soyadın
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-lg"
                      placeholder="Örn: Yılmaz"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Turkish Level Selection */}
            {step === 2 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="w-8 h-8 text-purple-500" />
                  <h2 className="text-4xl font-bold">Türkçe Seviyeni Seç</h2>
                </div>
                <p className="text-gray-400 mb-8 text-lg">
                  Mevcut Türkçe seviyeni seç, sana uygun içerikler hazırlayalım!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {turkishLevels.map((level) => (
                    <motion.button
                      key={level.code}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleLevelSelect(level.code)}
                      className={`p-6 rounded-xl border-2 transition-all text-left ${
                        formData.turkishLevel === level.code
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="text-5xl mb-3">{level.icon}</div>
                      <div className="font-bold text-xl mb-2">{level.name}</div>
                      <div className="text-sm text-gray-400">{level.description}</div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-12">
              {step > 1 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep(step - 1)}
                  className="px-8 py-3 border-2 border-white/20 rounded-full font-semibold hover:bg-white/5 transition-all"
                >
                  Geri
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-all ml-auto ${
                  isStepValid()
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50'
                    : 'bg-white/10 cursor-not-allowed opacity-50'
                }`}
              >
                {step === 3 ? 'Başla' : 'Devam Et'}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
