/**
 * DeviceFrame component that wraps content in a device mockup
 * Shows laptop frame on desktop and mobile frame on mobile viewports
 */
export default function DeviceFrame({ children }) {
  return (
    <>
      {/* Mobile Frame - visible on small screens */}
      <div className="block md:hidden relative mx-auto" style={{ maxWidth: '375px' }}>
        {/* Mobile device frame */}
        <div className="relative bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-gray-900 rounded-b-3xl z-10"></div>
          
          {/* Screen */}
          <div className="relative bg-white dark:bg-gray-800 rounded-[2.5rem] overflow-hidden" style={{ aspectRatio: '9/19.5' }}>
            {children}
          </div>
          
          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-700 rounded-full"></div>
        </div>
      </div>

      {/* Laptop Frame - visible on medium and larger screens */}
      <div className="hidden md:block relative mx-auto" style={{ maxWidth: '1200px' }}>
        {/* Laptop screen */}
        <div className="relative bg-gray-900 rounded-t-2xl p-3 shadow-2xl">
          {/* Camera */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-700 rounded-full z-10"></div>
          
          {/* Screen content */}
          <div className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden" style={{ aspectRatio: '16/10' }}>
            {children}
          </div>
        </div>
        
        {/* Laptop base */}
        <div className="relative h-6 bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-2xl shadow-lg">
          {/* Keyboard notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-700 rounded-b"></div>
        </div>
        
        {/* Laptop stand */}
        <div className="relative h-2">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-48 h-2 bg-gradient-to-b from-gray-900 to-gray-800 rounded-b-lg shadow-md"></div>
        </div>
      </div>
    </>
  );
}
