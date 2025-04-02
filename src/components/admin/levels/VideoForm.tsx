'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, PlayCircle, XCircle } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface VideoFormProps {
  form: UseFormReturn<any>;
  index: number;
  onRemove: () => void;
}

// Function to validate video URLs
const isValidVideoUrl = (url: string): boolean => {
  try {
    const videoUrl = new URL(url);
    // Basic check for common video platforms
    return (
      videoUrl.hostname.includes('youtube.com') ||
      videoUrl.hostname.includes('youtu.be') ||
      videoUrl.hostname.includes('vimeo.com') ||
      videoUrl.hostname.includes('dailymotion.com') ||
      videoUrl.hostname.includes('wistia.com') ||
      videoUrl.pathname.match(/\.(mp4|webm|ogg)$/) !== null
    );
  } catch (e) {
    return false;
  }
};

// Function to extract YouTube video ID from URL
const getYoutubeVideoId = (url: string): string | null => {
  try {
    const videoUrl = new URL(url);
    if (videoUrl.hostname.includes('youtube.com')) {
      return videoUrl.searchParams.get('v');
    } else if (videoUrl.hostname.includes('youtu.be')) {
      return videoUrl.pathname.slice(1);
    }
    return null;
  } catch (e) {
    return null;
  }
};

const VideoForm = ({ form, index, onRemove }: VideoFormProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const videoUrl = form.watch(`videoContent.${index}.url`);
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [youtubeId, setYoutubeId] = useState<string | null>(null);
  
  // Validate URL and extract YouTube ID when URL changes
  useEffect(() => {
    if (videoUrl) {
      const valid = isValidVideoUrl(videoUrl);
      setIsValidUrl(valid);
      
      if (valid) {
        const id = getYoutubeVideoId(videoUrl);
        setYoutubeId(id);
      } else {
        setYoutubeId(null);
      }
    } else {
      setIsValidUrl(false);
      setYoutubeId(null);
    }
  }, [videoUrl]);
  
  return (
    <Card className="relative">
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
        <h4 className="text-sm font-medium">Видео {index + 1}</h4>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0" 
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        <FormField
          control={form.control}
          name={`videoContent.${index}.title`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Название</FormLabel>
              <FormControl>
                <Input placeholder="Введите название видео" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name={`videoContent.${index}.url`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/video" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                Поддерживаются: YouTube, Vimeo, Dailymotion, прямые ссылки на mp4/webm
              </FormDescription>
              <FormMessage />
              {field.value && !isValidUrl && (
                <Alert variant="destructive" className="py-2 mt-2">
                  <AlertDescription className="text-xs">
                    URL не распознан как допустимая ссылка на видео
                  </AlertDescription>
                </Alert>
              )}
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name={`videoContent.${index}.duration`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Длительность (минуты)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min={1}
                  step="0.1"
                  placeholder="Длительность видео" 
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {videoUrl && isValidUrl && youtubeId && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <FormLabel className="text-xs">Предпросмотр</FormLabel>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowPreview(!showPreview)}
                className="h-8 px-2 text-xs"
              >
                {showPreview ? (
                  <>
                    <XCircle className="h-3 w-3 mr-1" />
                    Скрыть
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-3 w-3 mr-1" />
                    Показать
                  </>
                )}
              </Button>
            </div>
            
            {showPreview && (
              <div className="aspect-video bg-muted rounded-md overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoForm; 