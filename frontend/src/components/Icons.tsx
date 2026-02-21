import { HiOutlineChatAlt2, HiOutlineChartBar, HiOutlineViewGrid, HiOutlineDocumentText, HiOutlinePaperAirplane, HiOutlineLightningBolt, HiOutlineLockClosed, HiOutlineGlobe, HiOutlineLink, HiOutlineMenu, HiOutlineDownload, HiOutlineSearch } from "react-icons/hi";

export const Icons = {
  Chat: () => <HiOutlineChatAlt2 className="w-5 h-5" />,
  Simulate: () => <HiOutlineChartBar className="w-5 h-5" />,
  Dashboard: () => <HiOutlineViewGrid className="w-5 h-5" />,
  Docs: ({ className }: { className?: string }) => <HiOutlineDocumentText className={className || "w-5 h-5"} />,
  Send: () => <HiOutlinePaperAirplane className="w-[18px] h-[18px] rotate-90" />,
  Bolt: () => <HiOutlineLightningBolt className="w-4 h-4" />,
  Lock: ({ className }: { className?: string }) => <HiOutlineLockClosed className={`w-3.5 h-3.5 ${className || ""}`} />,
  Globe: () => <HiOutlineGlobe className="w-4 h-4" />,
  Source: () => <HiOutlineLink className="w-3 h-3" />,
  Menu: () => <HiOutlineMenu className="w-5 h-5" />,
  Download: () => <HiOutlineDownload className="w-4 h-4 text-hydro-accent" />,
  Search: ({ className }: { className?: string }) => <HiOutlineSearch className={`w-4 h-4 ${className || ""}`} />,
  H2: () => (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="14" stroke="#00E676" strokeWidth="1.5" fill="none"/>
      <text x="16" y="21" textAnchor="middle" fill="#00E676" fontSize="13" fontFamily="Space Mono" fontWeight="700">H₂</text>
    </svg>
  ),
};
