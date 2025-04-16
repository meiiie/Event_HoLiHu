export default function CSSTestPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">CSS Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
          <h2 className="text-xl font-semibold mb-2">Tailwind is working if:</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>This text is in a white box (dark in dark mode)</li>
            <li>The box has rounded corners</li>
            <li>This list has bullets</li>
            <li>The text below is <span className="text-green-500">green</span></li>
          </ul>
        </div>
        
        <div className="p-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-md text-white">
          <h2 className="text-xl font-semibold mb-2">Tailwind gradients test</h2>
          <p>This box should have a purple-to-blue gradient background</p>
          <button className="mt-4 px-4 py-2 bg-white text-purple-700 rounded hover:bg-gray-100 transition-colors">
            Button with hover effect
          </button>
        </div>
      </div>
      
      <div className="mt-8 p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h2 className="blockchain-heading text-2xl mb-4">Custom CSS Classes Test</h2>
        <div className="blockchain-card mb-4">
          <p>This should use the blockchain-card custom class</p>
        </div>
        <div className="animate-fadeIn mt-4 p-4 bg-yellow-100 dark:bg-yellow-900 rounded">
          <p>This box should fade in if animations are working</p>
        </div>
      </div>
    </div>
  )
}
