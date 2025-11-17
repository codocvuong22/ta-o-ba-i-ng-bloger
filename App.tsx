import React, { useState, useCallback } from 'react';
import { generateBlogPost, BlogPost } from './services/geminiService';

const CopyIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2V10a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const SparklesIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m11-13v4m-2-2h4m2 11h-4m2 2v-4M12 2v2m-2-2h4m2 18v-2m-2 2h4m-11-6.09V14a2 2 0 002 2h2a2 2 0 002-2v-1.09A6.006 6.006 0 0012 3c-2.092 0-3.945 1.06-5 2.71V9a2 2 0 002 2h2a2 2 0 002-2V5.71A6.006 6.006 0 0012 3z" />
    </svg>
);

const DownloadIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const Header: React.FC = () => (
    <header className="text-center p-6 bg-white dark:bg-gray-800 shadow-md">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
            Trình tạo bài đăng Blog AI
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
            Tạo nội dung và hình ảnh cho Blogspot của bạn với sức mạnh của Gemini
        </p>
    </header>
);

const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Sao chép"
        >
            {copied ? <CheckIcon className="w-5 h-5 text-green-500" /> : <CopyIcon className="w-5 h-5" />}
        </button>
    );
};

const DownloadButton: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
    return (
        <a
            href={imageUrl}
            download="anh-minh-hoa.png"
            className="absolute top-2 right-2 p-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Tải ảnh"
        >
            <DownloadIcon className="w-5 h-5" />
        </a>
    );
};


const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError("Vui lòng nhập một chủ đề.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setBlogPost(null);

    try {
      const result = await generateBlogPost(topic);
      setBlogPost(result);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi không mong muốn.");
    } finally {
      setIsLoading(false);
    }
  }, [topic]);

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 dark:text-gray-200">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit}>
            <label htmlFor="topic-input" className="block text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">
              Chủ đề bài viết
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                id="topic-input"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ví dụ: Lợi ích của việc đọc sách mỗi ngày"
                className="flex-grow p-4 text-base bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center p-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    Tạo bài đăng
                  </>
                )}
              </button>
            </div>
          </form>
          
          {error && <div className="mt-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg">{error}</div>}
        </div>

        {blogPost && (
            <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl mt-8 p-6 md:p-8 border border-gray-200 dark:border-gray-700 animate-fade-in">
                <div className="relative mb-6">
                    <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Tiêu đề</h2>
                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-lg font-semibold text-gray-900 dark:text-white">
                        {blogPost.title}
                    </div>
                    <CopyButton textToCopy={blogPost.title} />
                </div>
                <div className="relative mb-6">
                    <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Ảnh minh họa</h2>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                        <img src={blogPost.imageUrl} alt={`Ảnh minh họa cho bài viết: ${blogPost.title}`} className="w-full h-auto object-cover" />
                    </div>
                    <DownloadButton imageUrl={blogPost.imageUrl} />
                </div>
                <div className="relative">
                    <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Nội dung</h2>
                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg prose dark:prose-invert max-w-none whitespace-pre-wrap text-base leading-relaxed">
                        {blogPost.content}
                    </div>
                    <CopyButton textToCopy={blogPost.content} />
                </div>
            </div>
        )}
      </main>
      <footer className="text-center p-4 text-gray-500 dark:text-gray-400 text-sm">
        Được tạo bởi Gemini API & React.
      </footer>
       <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
        }
       `}</style>
    </div>
  );
};

export default App;
