import { useRef, useEffect } from 'react';

/**
 *
 * @param onClickOutside Callback function when user has clicked outside element
 * @param disable Disable the event listener when not needed
 * @returns ref that should be added to the component to watch for outside clicks
 */
const useClickOutside = (onClickOutside: () => any, disable?: boolean) => {
  const ref = useRef(null);

  useEffect(() => {
    if (disable) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current.contains(e.target)) {
        return;
      }
      onClickOutside();
    };
    document.addEventListener('mousedown', handleClick, false);
    return () => document.removeEventListener('mousedown', handleClick, false);
  }, [disable, onClickOutside]);

  return ref;
};

export default useClickOutside;
