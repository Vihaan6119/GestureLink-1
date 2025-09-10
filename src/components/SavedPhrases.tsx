import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Plus, Trash2, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

interface SavedPhrasesProps {
  phrases: string[];
  onPhraseAdd: (phrase: string) => void;
  onPhraseRemove: (index: number) => void;
  onPhraseUse: (phrase: string) => void;
  speechRate: number;
  spokenLanguage: string;
  textSize: number;
}

const SavedPhrases: React.FC<SavedPhrasesProps> = ({
  phrases,
  onPhraseAdd,
  onPhraseRemove,
  onPhraseUse,
  speechRate,
  spokenLanguage,
  textSize
}) => {
  const [newPhrase, setNewPhrase] = useState('');

  const handleAddPhrase = () => {
    if (newPhrase.trim()) {
      onPhraseAdd(newPhrase.trim());
      setNewPhrase('');
      toast.success('Phrase added successfully');
    }
  };

  const handleUsePhrase = (phrase: string) => {
    onPhraseUse(phrase);
    
    // Speak the phrase
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.rate = speechRate;
      utterance.lang = spokenLanguage;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <Card className="h-96">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Saved Phrases
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new phrase */}
        <div className="flex gap-2">
          <Input
            placeholder="Add a new phrase..."
            value={newPhrase}
            onChange={(e) => setNewPhrase(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddPhrase()}
          />
          <Button onClick={handleAddPhrase} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Phrases list */}
        <div className="max-h-64 overflow-y-auto space-y-2">
          {phrases.length === 0 ? (
            <p className="text-center text-gray-500">No saved phrases yet</p>
          ) : (
            phrases.map((phrase, index) => (
              <div
                key={index}
                className="group flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <p 
                  className="flex-1 cursor-pointer"
                  style={{ fontSize: `${textSize}px` }}
                  onClick={() => handleUsePhrase(phrase)}
                >
                  {phrase}
                </p>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUsePhrase(phrase)}
                    className="h-8 w-8 p-0"
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onPhraseRemove(index)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedPhrases;