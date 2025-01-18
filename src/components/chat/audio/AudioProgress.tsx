interface AudioProgressProps {
  currentTime: number;
  duration: number;
  onSeek?: (time: number) => void;
}

export const AudioProgress = ({ currentTime, duration, onSeek }: AudioProgressProps) => {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    onSeek(newTime);
  };

  return (
    <div 
      className="relative w-full h-1 bg-gray-200 rounded cursor-pointer"
      onClick={handleClick}
    >
      <div 
        className="absolute h-full bg-primary rounded"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};