'use client';

import { motion } from 'framer-motion';
import { Sparkles, Globe, MessageCircle, Trophy, Volume2, Check } from 'lucide-react';
import { useState } from 'react';
import { storage } from '@/lib/storage';

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState<'account-check' | 'login' | 'register'>('account-check');
  const [footerModal, setFooterModal] = useState<{title: string; content: string} | null>(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Header with CTA */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/50 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <Sparkles className="w-8 h-8 text-purple-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              KonuşTürk
            </span>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            Ücretsiz Dene
          </motion.button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                Yapay Zeka ile
              </span>
              <br />
              <span className="text-white">Türkçe Öğren</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto"
          >
            Gerçek konuşmalar yaparak, yapay zeka destekli kişisel öğretmeninizle
            Türkçe öğrenin. Hızlı, etkili ve eğlenceli.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all"
            >
              Hemen Başla
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-white/20 rounded-full font-bold text-lg hover:bg-white/5 transition-all"
            >
              Nasıl Çalışır?
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl font-bold text-center mb-16"
          >
            Neden <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">KonuşTürk?</span>
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Globe className="w-12 h-12" />,
                title: 'Doğal Türkçe',
                description: 'Günlük hayatta kullanılan gerçek Türkçe ile öğrenin',
                color: 'purple'
              },
              {
                icon: <MessageCircle className="w-12 h-12" />,
                title: 'Konuşarak Öğren',
                description: 'Yapay zeka öğretmeninizle Türkçe pratiği yapın',
                color: 'pink'
              },
              {
                icon: <Trophy className="w-12 h-12" />,
                title: 'Kişisel İlerleme',
                description: 'Seviyenize özel Türkçe içerik ve anında geri bildirim',
                color: 'red'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all"
              >
                <div className={`text-${feature.color}-500 mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl font-bold text-center mb-24"
          >
            Nasıl Çalışır?
          </motion.h2>

          <div className="space-y-32">
            {[
              {
                step: '01',
                title: 'Kaydol ve Başla',
                description: 'Sadece birkaç saniye içinde hesap oluşturun ve Türkçe öğrenmeye başlayın.'
              },
              {
                step: '02',
                title: 'AI Öğretmeninizle Tanışın',
                description: 'Kişisel Türkçe öğretmeniniz sizi karşılayacak ve Türkçe seviyenizi belirleyecek.'
              },
              {
                step: '03',
                title: 'Konuşarak Türkçe Öğren',
                description: 'Gerçek hayat senaryolarında Türkçe konuşma pratiği yapın ve anında geri bildirim alın.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-col md:flex-row items-center gap-12"
              >
                <div className={`flex-1 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <div className="text-8xl font-bold text-white/5 mb-4">{item.step}</div>
                  <h3 className="text-4xl font-bold mb-4">{item.title}</h3>
                  <p className="text-xl text-gray-400 leading-relaxed">{item.description}</p>
                </div>
                <div className={`flex-1 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                  <div className="relative aspect-square rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 overflow-hidden flex items-center justify-center p-8">
                    {index === 0 && (
                      <div className="text-center space-y-4">
                        <div className="text-6xl">📝</div>
                        <div className="space-y-2">
                          <div className="h-3 bg-white/20 rounded-full w-3/4 mx-auto" />
                          <div className="h-3 bg-white/20 rounded-full w-full" />
                          <div className="h-3 bg-white/20 rounded-full w-5/6 mx-auto" />
                        </div>
                        <div className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full text-sm font-bold">
                          Kayıt Ol
                        </div>
                      </div>
                    )}
                    {index === 1 && (
                      <div className="text-center space-y-6">
                        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                          <Sparkles className="w-12 h-12" />
                        </div>
                        <div className="space-y-2">
                          <div className="px-4 py-2 bg-white/10 rounded-lg text-sm">
                            Merhaba! Ben Ayşe 👋
                          </div>
                          <div className="px-4 py-2 bg-white/10 rounded-lg text-sm">
                            Seviyeni belirleyelim
                          </div>
                        </div>
                      </div>
                    )}
                    {index === 2 && (
                      <div className="w-full space-y-4">
                        <div className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-xl p-4 border border-white/20">
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-2xl font-bold">Merhaba</div>
                            <Volume2 className="w-5 h-5 text-purple-400" />
                          </div>
                          <div className="text-sm text-gray-300 mb-2">mer-ha-ba</div>
                          <div className="text-xs text-gray-400">Seslendirme: Hello (greeting)</div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white/10 rounded-lg p-3 text-center">
                            <div className="text-xl mb-1">🍎</div>
                            <div className="text-sm font-semibold">Elma</div>
                          </div>
                          <div className="bg-white/10 rounded-lg p-3 text-center">
                            <div className="text-xl mb-1">📖</div>
                            <div className="text-sm font-semibold">Kitap</div>
                          </div>
                        </div>
                        <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 flex items-center gap-2">
                          <Check className="w-5 h-5 text-green-400" />
                          <span className="text-sm">Harika telaffuz! +10 puan</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Hazır mısınız?
          </h2>
          <p className="text-2xl text-gray-400 mb-12">
            Türkçe öğrenmeye bugün başlayın
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="px-12 py-5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full font-bold text-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all"
          >
            Ücretsiz Başla
          </motion.button>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '10K+', label: 'Öğrenci' },
              { number: '500K+', label: 'Konuşma' },
              { number: '4.9/5', label: 'Puan' },
              { number: '95%', label: 'Başarı Oranı' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-purple-500" />
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                  KonuşTürk
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Yapay zeka ile Türkçe öğrenmenin en kolay yolu.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-white transition-colors">Ana Sayfa</button></li>
                <li><button onClick={() => setFooterModal({title: 'Hakkımızda', content: 'KonuşTürk, yapay zeka teknolojisi kullanarak Türkçe öğretimi sunan yenilikçi bir platformdur. Amacımız, her seviyeden öğrencinin Türkçeyi etkili ve eğlenceli bir şekilde öğrenmesini sağlamaktır.'})} className="hover:text-white transition-colors">Hakkımızda</button></li>
                <li><button onClick={() => setFooterModal({title: 'Fiyatlandırma', content: '🎉 Şu anda tüm özelliklere ücretsiz erişimle beta aşamasındayız! Erken katılımcılarımız için özel indirimler yakında duyurulacak.'})} className="hover:text-white transition-colors">Fiyatlandırma</button></li>
                <li><button onClick={() => setFooterModal({title: 'Blog', content: 'Türkçe öğrenme ipuçları, yapay zeka haberleri ve kullanıcı başarı hikayeleri için blogumuz çok yakında yayında!'})} className="hover:text-white transition-colors">Blog</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Destek</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => setFooterModal({title: 'Yardım Merkezi', content: 'Sorularınız mı var? E-posta: destek@konusturk.com\nTelefon: +90 (212) 123 45 67\nMesai Saatleri: Hafta içi 09:00 - 18:00'})} className="hover:text-white transition-colors">Yardım Merkezi</button></li>
                <li><button onClick={() => setFooterModal({title: 'İletişim', content: 'Bizimle iletişime geçin:\n\nE-posta: info@konusturk.com\nAdres: İstanbul, Türkiye\nSosyal Medya: @konusturk'})} className="hover:text-white transition-colors">İletişim</button></li>
                <li><button onClick={() => setFooterModal({title: 'Sıkça Sorulan Sorular', content: 'S: KonuşTürk nasıl çalışır?\nC: Yapay zeka öğretmeninizle gerçek konuşmalar yaparak Türkçe öğrenirsiniz.\n\nS: Ücretsiz mi?\nC: Evet, şu anda beta sürümümüz tamamen ücretsizdir!\n\nS: Hangi seviyelere uygun?\nC: Başlangıçtan ileri seviyeye kadar herkese uygun içeriklerimiz var.'})} className="hover:text-white transition-colors">SSS</button></li>
                <li><button onClick={() => setFooterModal({title: 'Gizlilik Politikası', content: 'Kişisel verileriniz KVKK kapsamında korunmaktadır. Bilgileriniz sadece eğitim amaçlı kullanılır ve üçüncü şahıslarla paylaşılmaz. Detaylı bilgi için gizlilik politikamızı inceleyebilirsiniz.'})} className="hover:text-white transition-colors">Gizlilik</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Bizi Takip Edin</h4>
              <div className="flex gap-4">
                {['Twitter', 'Instagram', 'YouTube'].map((social) => (
                  <motion.a
                    key={social}
                    href="#"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  >
                    <span className="text-xs">{social[0]}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-center text-sm text-gray-400">
            <p>© 2026 KonuşTürk. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>

      {/* Footer Modal */}
      {footerModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          onClick={() => setFooterModal(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-3xl p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto"
          >
            <h3 className="text-3xl font-bold mb-6">{footerModal.title}</h3>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line mb-6">
              {footerModal.content}
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFooterModal(null)}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              Kapat
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      {/* Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          onClick={() => {
            setShowModal(false);
            setModalStep('account-check');
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-3xl p-8 max-w-md w-full"
          >
            {modalStep === 'account-check' && (
              <>
                <h3 className="text-3xl font-bold mb-6">Hoş Geldiniz! 🎉</h3>
                <p className="text-gray-400 mb-8">
                  Türkçe öğrenme yolculuğunuza başlayalım!
                </p>
                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setModalStep('register')}
                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                  >
                    Yeni Hesap Oluştur
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setModalStep('login')}
                    className="w-full px-6 py-4 border-2 border-white/20 rounded-xl font-bold hover:bg-white/5 transition-all"
                  >
                    Zaten Hesabım Var
                  </motion.button>
                </div>
              </>
            )}

            {modalStep === 'login' && (
              <>
                <h3 className="text-3xl font-bold mb-6">Giriş Yap</h3>
                <p className="text-gray-400 mb-8">
                  Hoş geldin! Türkçe pratik yapmaya devam et.
                </p>
                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm">
                    {error}
                  </div>
                )}
                <form className="space-y-4" onSubmit={(e) => {
                  e.preventDefault();
                  try {
                    setError('');
                    storage.loginUser(loginData.email, loginData.password);
                    window.location.href = '/chat';
                  } catch (err: any) {
                    setError(err.message);
                  }
                }}>
                  <input
                    type="email"
                    placeholder="E-posta"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Şifre"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                    required
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                  >
                    Giriş Yap
                  </motion.button>
                  <button
                    type="button"
                    onClick={() => {
                      setModalStep('account-check');
                      setError('');
                    }}
                    className="w-full text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    ← Geri Dön
                  </button>
                </form>
              </>
            )}

            {modalStep === 'register' && (
              <>
                <h3 className="text-3xl font-bold mb-6">Hesap Oluştur</h3>
                <p className="text-gray-400 mb-8">
                  KonuşTürk ile Türkçe öğrenme yolculuğunuza başlayın!
                </p>
                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm">
                    {error}
                  </div>
                )}
                <form className="space-y-4" onSubmit={(e) => {
                  e.preventDefault();
                  try {
                    setError('');
                    storage.registerUser(registerData.email, registerData.password);
                    storage.loginUser(registerData.email, registerData.password);
                    window.location.href = '/onboarding';
                  } catch (err: any) {
                    setError(err.message);
                  }
                }}>
                  <input
                    type="email"
                    placeholder="E-posta"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Şifre (en az 6 karakter)"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                    minLength={6}
                    required
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                  >
                    Devam Et
                  </motion.button>
                  <button
                    type="button"
                    onClick={() => {
                      setModalStep('account-check');
                      setError('');
                    }}
                    className="w-full text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    ← Geri Dön
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
