import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import SavedPhrasesMenu from './SavedPhrasesMenu';
import { 
  Menu, 
  Settings, 
  Volume2, 
  Palette, 
  User, 
  LogOut,
  Moon,
  Sun,
  Mic,
  Languages
} from 'lucide-react';

interface SideMenuProps {
  onAccountClick: () => void;
  onSettingsChange: (setting: string, value: string | number | boolean) => void;
  darkMode: boolean;
  speechRate: number;
  textSize: number;
  phrases: string[];
  onPhraseAdd: (phrase: string) => void;
  onPhraseRemove: (index: number) => void;
  onPhraseUse: (phrase: string) => void;
  spokenLanguage: string;
}

const SideMenu: React.FC<SideMenuProps> = ({ 
  onAccountClick, 
  onSettingsChange, 
  darkMode, 
  speechRate, 
  textSize,
  phrases,
  onPhraseAdd,
  onPhraseRemove,
  onPhraseUse,
  spokenLanguage
}) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="p-2">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 bg-gradient-to-b from-purple-50 to-blue-50">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
          </div>

          <Separator className="mb-6" />

          <div className="space-y-4 flex-1">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-left"
              onClick={onAccountClick}
            >
              <User className="h-5 w-5" />
              Account Settings
            </Button>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                App Settings
              </h3>
              
              <div className="ml-6 space-y-3">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3"
                  onClick={() => onSettingsChange('darkMode', !darkMode)}
                >
                  {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </Button>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    Speech Rate: {speechRate}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={speechRate}
                    onChange={(e) => onSettingsChange('speechRate', parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Text Size: {textSize}px
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="24"
                    value={textSize}
                    onChange={(e) => onSettingsChange('textSize', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <Button variant="ghost" className="w-full justify-start gap-3">
                  <Languages className="h-4 w-4" />
                  Language Settings
                </Button>

                <Button variant="ghost" className="w-full justify-start gap-3">
                  <Mic className="h-4 w-4" />
                  Audio Settings
                </Button>
              </div>
            </div>

            <Separator className="my-4" />

            <SavedPhrasesMenu
              phrases={phrases}
              onPhraseAdd={onPhraseAdd}
              onPhraseRemove={onPhraseRemove}
              onPhraseUse={onPhraseUse}
              speechRate={speechRate}
              spokenLanguage={spokenLanguage}
              textSize={textSize}
            />
          </div>

          <Separator className="my-4" />

          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SideMenu;