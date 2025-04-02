import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VideoContent } from '@/types';
import { CheckSquare, Play, PauseCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface VideoSectionProps {
  videos: VideoContent[];
  watchedVideoIds: string[];
  onVideoWatch: (videoId: string) => void;
  isMarkingWatched?: boolean;
}

export const VideoSection: React.FC<VideoSectionProps> = ({
  videos,
  watchedVideoIds,
  onVideoWatch,
  isMarkingWatched = false
}) => {
  // State to track which video is currently expanded for playing
  const [expandedVideoId, setExpandedVideoId] = useState<string | null>(null);
  
  // Helper function to check if video is watched
  const isVideoWatched = (videoId: string) => watchedVideoIds.includes(videoId);
  
  // Handle video completion (called when video ends)
  const handleVideoEnded = (videoId: string) => {
    if (!isVideoWatched(videoId)) {
      onVideoWatch(videoId);
      toast.success('Видео отмечено как просмотренное');
    }
  };
  
  // Handle video play/toggle
  const toggleVideoExpand = (videoId: string) => {
    setExpandedVideoId(expandedVideoId === videoId ? null : videoId);
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-3">Обучающие видео</h2>
      {videos.map((video) => {
        const watched = isVideoWatched(video.id);
        const isExpanded = expandedVideoId === video.id;
        
        return (
          <Card 
            key={video.id} 
            className={cn(
              "transition-all duration-300 hover:shadow-md",
              watched && "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20"
            )}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                {watched && <CheckSquare className="h-4 w-4 text-green-600 mr-2" />}
                {video.title}
              </CardTitle>
              <CardDescription>
                Продолжительность: {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-3">
                {!isExpanded ? (
                  <div 
                    className="bg-slate-100 dark:bg-slate-800 rounded-md h-40 flex flex-col items-center justify-center cursor-pointer"
                    onClick={() => toggleVideoExpand(video.id)}
                  >
                    <Play className="h-12 w-12 text-slate-400 mb-2" />
                    <p className="text-muted-foreground text-sm">
                      Нажмите, чтобы просмотреть видео
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md overflow-hidden bg-black aspect-video">
                    <iframe 
                      className="w-full h-full" 
                      src={video.url.includes('youtube.com') ? 
                        video.url.replace('watch?v=', 'embed/') + '?autoplay=1' : 
                        video.url
                      } 
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                      onEnded={() => handleVideoEnded(video.id)}
                    ></iframe>
                  </div>
                )}
              </div>
              <div className="flex justify-between">
                {isExpanded && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => toggleVideoExpand(video.id)}
                    className="flex items-center gap-2"
                  >
                    <PauseCircle className="h-4 w-4" />
                    Свернуть видео
                  </Button>
                )}
                <div className={isExpanded ? "ml-auto" : ""}>
                  <Button 
                    variant={watched ? "outline" : "default"} 
                    size="sm" 
                    disabled={watched || isMarkingWatched}
                    onClick={() => onVideoWatch(video.id)}
                  >
                    {watched ? "Просмотрено" : "Отметить как просмотренное"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}; 