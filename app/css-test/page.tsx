export default function CSSTestPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">CSS Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
          <h2 className="text-xl font-semibold mb-2">Basic Tailwind Test</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>This text should be in a white box (dark in dark mode)</li>
            <li>The box should have rounded corners</li>
            <li>This list should have bullets</li>
            <li>This text should be <span className="text-green-500">green</span></li>
          </ul>
        </div>
        
        <div className="p-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-md text-white">
          <h2 className="text-xl font-semibold mb-2">Gradient Test</h2>
          <p>This box should have a purple-to-blue gradient background</p>
          <button className="mt-4 px-4 py-2 bg-white text-purple-700 rounded hover:bg-gray-100 transition-colors">
            Button with hover effect
          </button>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Custom Component Classes</h2>
        <div className="blockchain-card mt-4">
          <p>If you see a card with shadow and border, the blockchain-card class is working</p>
        </div>
        
        <div className="mt-4">
          <h3 className="blockchain-heading text-2xl mb-2">Blockchain Heading</h3>
          <p>The heading above should have a gradient text effect if custom classes are working</p>
        </div>

        <div className="pulse-glow mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg inline-block">
          This box should have a pulsing glow animation
        </div>
      </div>
    </div>
  )
}

