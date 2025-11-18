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
      <div className="hidden md:block relative mx-auto perspective-1000" style={{ maxWidth: '1400px', perspective: '2000px' }}>
        {/* Laptop screen with 3D effect */}
        <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
          {/* Screen bezel */}
          <div className="relative bg-gradient-to-b from-gray-800 via-gray-900 to-black rounded-t-3xl p-4 shadow-2xl border-t-2 border-x-2 border-gray-700">
            {/* Top bezel with camera and sensors */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black to-transparent rounded-t-3xl flex items-center justify-center">
              {/* Camera */}
              <div className="relative">
                <div className="w-2.5 h-2.5 bg-gray-900 rounded-full border border-gray-600"></div>
                <div className="absolute inset-0 w-1.5 h-1.5 m-auto bg-blue-900 rounded-full opacity-30"></div>
              </div>
              {/* Ambient light sensor */}
              <div className="w-1 h-1 bg-gray-800 rounded-full ml-4"></div>
            </div>
            
            {/* Screen content with realistic display */}
            <div className="relative bg-black rounded-2xl overflow-hidden shadow-inner" style={{ aspectRatio: '16/10' }}>
              {/* Screen glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none z-10"></div>
              {children}
            </div>
            
            {/* Bottom bezel */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black to-transparent rounded-b-xl flex items-center justify-center">
              {/* Brand name placeholder */}
              <div className="text-[8px] text-gray-600 font-semibold tracking-wider">MACBOOK PRO</div>
            </div>
          </div>
          
          {/* Laptop base/keyboard section */}
          <div className="relative">
            {/* Hinge */}
            <div className="h-2 bg-gradient-to-b from-gray-700 to-gray-800 shadow-inner"></div>
            
            {/* Keyboard deck */}
            <div className="relative bg-gradient-to-b from-gray-300 via-gray-200 to-gray-300 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 rounded-b-3xl px-8 py-6 shadow-2xl">
              {/* Keyboard area */}
              <div className="bg-gradient-to-b from-gray-400 to-gray-300 dark:from-gray-900 dark:to-gray-800 rounded-xl p-4 shadow-inner">
                {/* Keyboard keys representation */}
                <div className="grid grid-cols-12 gap-1 mb-2">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="h-6 bg-gray-200 dark:bg-gray-700 rounded shadow-sm"></div>
                  ))}
                </div>
                <div className="grid grid-cols-12 gap-1 mb-2">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="h-6 bg-gray-200 dark:bg-gray-700 rounded shadow-sm"></div>
                  ))}
                </div>
                <div className="grid grid-cols-12 gap-1">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="h-6 bg-gray-200 dark:bg-gray-700 rounded shadow-sm"></div>
                  ))}
                </div>
              </div>
              
              {/* Trackpad */}
              <div className="mt-4 mx-auto w-48 h-24 bg-gradient-to-b from-gray-300 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-inner border border-gray-400 dark:border-gray-600"></div>
            </div>
          </div>
          
          {/* Laptop bottom/stand */}
          <div className="relative h-3 flex items-end justify-center">
            <div className="w-2/3 h-2 bg-gradient-to-b from-gray-400 to-gray-500 dark:from-gray-700 dark:to-gray-800 rounded-b-2xl shadow-lg"></div>
          </div>
          
          {/* Shadow under laptop */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-8 bg-black/20 dark:bg-black/40 rounded-full blur-xl"></div>
        </div>
      </div>
    </>
  );
}
