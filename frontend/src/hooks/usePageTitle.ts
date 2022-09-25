import { useEffect } from 'react';

const usePageTitle = (title?: string) => {
  useEffect(() => {
    const previousTitle = document.title;
    if (title) {
      document.title = `Paymate - ${title}`;
    } else {
      document.title = 'Paymate - Send money instantly through a link';
    }
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
};

export default usePageTitle;
