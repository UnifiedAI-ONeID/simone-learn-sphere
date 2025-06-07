
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Globe, Check, Bot, RefreshCw } from 'lucide-react';
import { useLocalization, SUPPORTED_LANGUAGES } from '@/contexts/LocalizationContext';
import { usePlatformDetection } from '@/hooks/usePlatformDetection';

export const LanguageSelector = () => {
  const { currentLanguage, setLanguage, forceRefresh, translationError } = useLocalization();
  const platform = usePlatformDetection();
  const isMobile = platform !== 'desktop';

  const handleLanguageChange = (language: any) => {
    console.log('Language selector: Changing language to', language.code);
    setLanguage(language);
  };

  const handleForceRefresh = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Language selector: Force refreshing translations');
    forceRefresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size={isMobile ? "default" : "sm"}
          className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800 w-full justify-start"
        >
          <Globe className="h-4 w-4" />
          <span>{currentLanguage.flag}</span>
          <span className={isMobile ? "block" : "hidden sm:inline"}>{currentLanguage.nativeName}</span>
          <Bot className="h-3 w-3 text-purple-600" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 max-h-80 overflow-y-auto">
        {/* Localization Info */}
        <div className="px-2 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
          AI-Powered Localization
        </div>
        <div className="px-2 py-1 text-xs text-gray-400 mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-3 w-3" />
              <span>Powered by ChatGPT</span>
              <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                Smart
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleForceRefresh}
              className="h-6 w-6 p-0"
              title="Refresh translations"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
          {translationError && (
            <div className="text-red-500 text-xs mt-1">
              {translationError}
            </div>
          )}
        </div>
        
        <DropdownMenuSeparator />
        
        {/* Language Selection */}
        <div className="px-2 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
          Languages
        </div>
        {SUPPORTED_LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">{language.flag}</span>
              <div>
                <div className="font-medium">{language.nativeName}</div>
                <div className="text-xs text-gray-500">{language.name}</div>
              </div>
            </div>
            {currentLanguage.code === language.code && (
              <Check className="h-4 w-4 text-green-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
