import React from 'react';
import { Send, Image, Link2, Smile } from 'lucide-react';

const PostForm = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm mb-8">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg flex-shrink-0 border border-slate-200">
          U
        </div>
        <div className="flex-1">
          <textarea
            placeholder="What's happening in your college?"
            className="w-full bg-transparent border-none focus:ring-0 text-slate-900 text-lg placeholder-slate-400 resize-none h-24 pt-2"
          ></textarea>
          
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center space-x-4">
              <button className="text-slate-400 hover:text-blue-600 transition-colors p-2 hover:bg-slate-50 rounded-xl">
                <Image className="w-5 h-5" />
              </button>
              <button className="text-slate-400 hover:text-blue-600 transition-colors p-2 hover:bg-slate-50 rounded-xl">
                <Link2 className="w-5 h-5" />
              </button>
              <button className="text-slate-400 hover:text-blue-600 transition-colors p-2 hover:bg-slate-50 rounded-xl">
                <Smile className="w-5 h-5" />
              </button>
            </div>
            
            <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center">
              Post
              <Send className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostForm;
