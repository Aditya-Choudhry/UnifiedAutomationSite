import { useEffect } from "react";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { Icons } from "@/lib/icons";

interface PopupBarProps {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
}

export default function PopupBar({ isVisible, setIsVisible }: PopupBarProps) {
  // Get popup dismissed state from local storage
  const [popupDismissed, setPopupDismissed] = useLocalStorage<boolean>("popupDismissed", false);

  // Initialize visibility based on local storage
  useEffect(() => {
    setIsVisible(!popupDismissed);
  }, [popupDismissed, setIsVisible]);

  const handleDismiss = () => {
    setPopupDismissed(true);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="bg-[#F59E0B] text-white py-2 w-full z-50 top-0 fixed shadow-md flex justify-between items-center px-4 md:px-8 transition-transform ease-in-out duration-300"
    >
      <p className="text-sm md:text-base">
        🚀 New: Unified Automation Hub now supports over 200+ integrations! <a href="#" className="underline font-semibold">Learn more</a>
      </p>
      <button 
        onClick={handleDismiss}
        className="text-white hover:text-slate-100 ml-4"
        aria-label="Dismiss notification"
      >
        <Icons.close className="h-4 w-4" />
      </button>
    </div>
  );
}
