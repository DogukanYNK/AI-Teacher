// LocalStorage service for managing user data and chat history

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  turkishLevel: string;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  targetLanguage: string;
  teacher: string;
  learningGoal: string;
  level: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
  translation?: string;
}

export interface UserPreferences {
  targetLanguage: string;
  selectedTeacher: string;
  learningGoal: string;
  level: string;
}

class StorageService {
  private USERS_KEY = 'konusturk_users';
  private CURRENT_USER_KEY = 'konusturk_current_user';
  private CHAT_SESSIONS_KEY = 'konusturk_chat_sessions';

  // User Management
  registerUser(email: string, password: string): User {
    const users = this.getUsers();
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      throw new Error('Bu e-posta adresi zaten kayıtlı');
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      password, // In production, this should be hashed!
      firstName: '',
      lastName: '',
      turkishLevel: '',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    return newUser;
  }

  loginUser(email: string, password: string): User {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('E-posta veya şifre hatalı');
    }

    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  updateUser(updates: Partial<User>): User {
    const currentUser = this.getCurrentUser();
    if (!currentUser) throw new Error('Kullanıcı bulunamadı');

    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) throw new Error('Kullanıcı bulunamadı');

    const updatedUser = { ...users[userIndex], ...updates };
    users[userIndex] = updatedUser;
    
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedUser));
    
    return updatedUser;
  }

  logoutUser(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  private getUsers(): User[] {
    const usersStr = localStorage.getItem(this.USERS_KEY);
    return usersStr ? JSON.parse(usersStr) : [];
  }

  // Chat Session Management
  createChatSession(preferences: UserPreferences): ChatSession {
    const currentUser = this.getCurrentUser();
    if (!currentUser) throw new Error('Kullanıcı oturumu bulunamadı');

    const session: ChatSession = {
      id: crypto.randomUUID(),
      userId: currentUser.id,
      title: 'Yeni Konuşma',
      targetLanguage: preferences.targetLanguage,
      teacher: preferences.selectedTeacher,
      learningGoal: preferences.learningGoal,
      level: preferences.level,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const sessions = this.getChatSessions();
    sessions.push(session);
    localStorage.setItem(this.CHAT_SESSIONS_KEY, JSON.stringify(sessions));
    
    return session;
  }

  getChatSessions(userId?: string): ChatSession[] {
    const currentUser = userId || this.getCurrentUser()?.id;
    if (!currentUser) return [];

    const sessionsStr = localStorage.getItem(this.CHAT_SESSIONS_KEY);
    const allSessions: ChatSession[] = sessionsStr ? JSON.parse(sessionsStr) : [];
    
    return allSessions
      .filter(s => s.userId === currentUser)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  getChatSession(sessionId: string): ChatSession | null {
    const sessions = this.getChatSessions();
    return sessions.find(s => s.id === sessionId) || null;
  }

  updateChatSession(sessionId: string, updates: Partial<ChatSession>): ChatSession {
    const allSessions = JSON.parse(localStorage.getItem(this.CHAT_SESSIONS_KEY) || '[]') as ChatSession[];
    const sessionIndex = allSessions.findIndex(s => s.id === sessionId);
    
    if (sessionIndex === -1) throw new Error('Konuşma bulunamadı');

    const updatedSession = {
      ...allSessions[sessionIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    allSessions[sessionIndex] = updatedSession;
    localStorage.setItem(this.CHAT_SESSIONS_KEY, JSON.stringify(allSessions));
    
    return updatedSession;
  }

  addMessageToSession(sessionId: string, message: ChatMessage): ChatSession {
    const session = this.getChatSession(sessionId);
    if (!session) throw new Error('Konuşma bulunamadı');

    session.messages.push(message);
    
    // Auto-generate title from first message
    if (session.messages.length === 2 && session.title === 'Yeni Konuşma') {
      const firstUserMessage = session.messages.find(m => m.sender === 'user');
      if (firstUserMessage) {
        session.title = firstUserMessage.text.substring(0, 30) + (firstUserMessage.text.length > 30 ? '...' : '');
      }
    }

    return this.updateChatSession(sessionId, { messages: session.messages, title: session.title });
  }

  deleteChatSession(sessionId: string): void {
    const allSessions = JSON.parse(localStorage.getItem(this.CHAT_SESSIONS_KEY) || '[]') as ChatSession[];
    const filtered = allSessions.filter(s => s.id !== sessionId);
    localStorage.setItem(this.CHAT_SESSIONS_KEY, JSON.stringify(filtered));
  }
}

export const storage = new StorageService();
