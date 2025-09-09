import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import SideMenu from './SideMenu';
import AccountSettings from './AccountSettings';
import SignLanguageDetector from './SignLanguageDetector';
import ConversationHistory from './ConversationHistory';
import SavedPhrases from './SavedPhrases';

interface Message {
  id: string;
  text: string;
  sender: 'sign' | 'speech';
  timestamp: Date;
}

const MainApp: React.FC = () => {
  const { user } = useAuth();
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [savedPhrases, setSavedPhrases] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [textSize, setTextSize] = useState(16);

  useEffect(() => {
    // Load saved data from localStorage
    const savedMessages = localStorage.getItem('gesturelink_messages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages).map((msg: { id: string; text: string; sender: 'sign' | 'speech'; timestamp: string }) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(parsedMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    }

    const savedPhrasesData = localStorage.getItem('gesturelink_phrases');
    if (savedPhrasesData) {
      try {
        setSavedPhrases(JSON.parse(savedPhrasesData));
      } catch (error) {
        console.error('Error loading phrases:', error);
      }
    } else {
      // Default phrases
      const defaultPhrases = [
        "Hello!",
        "Thank you.",
        "Please.",
        "Where is the restroom?",
        "I need help.",
        "How are you?",
        "Goodbye!"
      ];
      setSavedPhrases(defaultPhrases);
      localStorage.setItem('gesturelink_phrases', JSON.stringify(defaultPhrases));
    }

    // Load settings
    const settings = localStorage.getItem('gesturelink_settings');
    if (settings) {
      try {
        const parsedSettings = JSON.parse(settings);
        setDarkMode(parsedSettings.darkMode || false);
        setSpeechRate(parsedSettings.speechRate || 1.0);
        setTextSize(parsedSettings.textSize || 16);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Apply dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleTranslation = (text: string, sender: 'sign' | 'speech') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem('gesturelink_messages', JSON.stringify(updatedMessages));
  };

  const handleClearHistory = () => {
    setMessages([]);
    localStorage.removeItem('gesturelink_messages');
  };

  const handlePhraseAdd = (phrase: string) => {
    const updatedPhrases = [...savedPhrases, phrase];
    setSavedPhrases(updatedPhrases);
    localStorage.setItem('gesturelink_phrases', JSON.stringify(updatedPhrases));
  };

  const handlePhraseRemove = (index: number) => {
    const updatedPhrases = savedPhrases.filter((_, i) => i !== index);
    setSavedPhrases(updatedPhrases);
    localStorage.setItem('gesturelink_phrases', JSON.stringify(updatedPhrases));
  };

  const handlePhraseUse = (phrase: string) => {
    handleTranslation(phrase, 'sign');
  };

  const handleSettingsChange = (setting: string, value: string | number | boolean) => {
    const settings = { darkMode, speechRate, textSize };
    
    switch (setting) {
      case 'darkMode':
        setDarkMode(value);
        settings.darkMode = value;
        break;
      case 'speechRate':
        setSpeechRate(value);
        settings.speechRate = value;
        break;
      case 'textSize':
        setTextSize(value);
        settings.textSize = value;
        break;
    }

    localStorage.setItem('gesturelink_settings', JSON.stringify(settings));
  };

  if (showAccountSettings) {
    return <AccountSettings onBack={() => setShowAccountSettings(false)} />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <SideMenu
              onAccountClick={() => setShowAccountSettings(true)}
              onSettingsChange={handleSettingsChange}
              darkMode={darkMode}
              speechRate={speechRate}
              textSize={textSize}
              phrases={savedPhrases}
              onPhraseAdd={handlePhraseAdd}
              onPhraseRemove={handlePhraseRemove}
              onPhraseUse={handlePhraseUse}
              spokenLanguage="en-US"
            />
            <h1 className="text-xl font-bold">GestureLink</h1>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Main Content */}
        <div className="p-4 space-y-4">
          {/* Camera and Detection */}
          <SignLanguageDetector
            onTranslation={handleTranslation}
            speechRate={speechRate}
            textSize={textSize}
          />

          {/* Conversation History */}
          <ConversationHistory
            messages={messages}
            onClearHistory={handleClearHistory}
            textSize={textSize}
          />
        </div>
      </div>
    </div>
  );
};

export default MainApp;