'use client';

interface AddFactFormProps {
  fact: string;
  onFactChange: (fact: string) => void;
}

export default function AddFactForm({ fact, onFactChange }: AddFactFormProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <label htmlFor="fact" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          <span className="flex items-center space-x-2">
            <span className="text-lg">📝</span>
            <span>Share Your Cat Knowledge</span>
          </span>
        </label>
        <div className="relative">
          <textarea
            id="fact"
            value={fact}
            onChange={(e) => onFactChange(e.target.value)}
            placeholder="Enter an interesting cat fact... Did you know that cats have a special scent organ called the Jacobson's organ?"
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:bg-gray-800/50 dark:text-white resize-none transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500 text-base leading-relaxed"
            rows={4}
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-400 dark:text-gray-500 font-medium">
            {fact.length} characters
          </div>
        </div>
      </div>
    </div>
  );
}
