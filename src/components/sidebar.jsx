import { Button } from "./ui/button"
import { PinIcon, PinOffIcon } from "lucide-react"
import { useState, useEffect } from "react"

const presetPrompts = [
  "Tell me a joke",
  "Explain quantum computing",
  "Write a haiku about coding",
  "Describe the taste of an apple",
]

export function Sidebar() {
  const [isHovered, setIsHovered] = useState(false)
  const [isPinned, setIsPinned] = useState(false)

  useEffect(() => {
    if (isPinned) return

    const handleMouseMove = (e) => {
      if (e.clientX < 20) {
        setIsHovered(true)
      } else if (e.clientX > 300) {
        setIsHovered(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isPinned])

  const shouldShow = isPinned || isHovered

  return (
    <aside
      className={`
        ${isPinned ? 'relative w-64 shrink-0' : 'fixed left-0 top-0 w-64'} 
        h-screen bg-white border-r shadow-lg 
        transform transition-all duration-300 ease-in-out 
        ${shouldShow ? 'translate-x-0' : '-translate-x-[calc(100%-8px)]'}
        z-50
      `}
      onMouseLeave={() => !isPinned && setIsHovered(false)}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold">AI Chat</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsPinned(!isPinned)}
          title={isPinned ? "Enable hover mode" : "Pin sidebar"}
        >
          {isPinned ? <PinIcon className="h-4 w-4" /> : <PinOffIcon className="h-4 w-4" />}
        </Button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold mb-2">History</h3>
        <ul className="mb-4">
          <li className="text-sm text-gray-600 mb-1">Previous chat 1</li>
          <li className="text-sm text-gray-600 mb-1">Previous chat 2</li>
        </ul>
        <h3 className="font-semibold mb-2">Preset Prompts</h3>
        <ul>
          {presetPrompts.map((prompt, index) => (
            <li
              key={index}
              className="text-sm text-blue-600 cursor-pointer hover:underline mb-1"
            >
              {prompt}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

