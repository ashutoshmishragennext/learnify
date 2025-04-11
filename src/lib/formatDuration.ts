const formatDuration = (seconds: number, isSubModule: boolean = false): string => {
    if (isSubModule) {
      // Submodule: Show only minutes & seconds
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return remainingSeconds === 0
        ? `${minutes} min`
        : `${minutes} min ${remainingSeconds} sec`;
    } else {
      // Module: Show hours, minutes, and seconds
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;
      
      if (hours > 0) {
        return `${hours}h ${minutes}m ${remainingSeconds}s`;
      }
      return minutes > 0
        ? `${minutes}m ${remainingSeconds}s`
        : `${remainingSeconds}s`;
    }
  };

  export default formatDuration;