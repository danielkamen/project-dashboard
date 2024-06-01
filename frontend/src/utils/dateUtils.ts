export const formatDate = (isoString: string): string => {
    try {
      const date = new Date(isoString);
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      };
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      console.error('Invalid date format:', error);
      return isoString;
    }
  };