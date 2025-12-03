import React from 'react';
import type { Project } from '../types';

interface ProjectsDashboardProps {
  projects: Project[];
  onCreateNew: () => void;
  onOpenProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
}

export const ProjectsDashboard: React.FC<ProjectsDashboardProps> = ({
  projects,
  onCreateNew,
  onOpenProject,
  onDeleteProject
}) => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
             <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-2">
                My Projects
             </h2>
             <p className="text-indigo-200">Manage your meme coin websites and character collections.</p>
        </div>
        <button
            onClick={onCreateNew}
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl hover:from-indigo-500 hover:to-purple-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] focus:outline-none ring-offset-2 focus:ring-2"
        >
            <span className="mr-2 text-2xl">+</span> Create New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px] shadow-2xl">
            <div className="w-24 h-24 bg-indigo-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <span className="text-5xl">🚀</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No Projects Yet</h3>
            <p className="text-indigo-200 mb-8 max-w-md mx-auto">Start your journey to the moon by creating your first AI-generated meme character and website.</p>
            <button
                onClick={onCreateNew}
                className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold text-white transition-all"
            >
                Start Building
            </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {/* Create New Card - inline option */}
             <button 
                onClick={onCreateNew}
                className="group h-full min-h-[300px] bg-black/20 border-2 border-dashed border-white/20 rounded-3xl flex flex-col items-center justify-center hover:border-pink-500/50 hover:bg-black/40 transition-all duration-300"
             >
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-pink-500/20 group-hover:border-pink-500/50 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-pink-400"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </div>
                <span className="text-gray-400 font-bold group-hover:text-white">Create New</span>
             </button>

             {projects.map((project) => (
                 <div 
                    key={project.id}
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:-translate-y-2 transition-all duration-300 group relative flex flex-col"
                 >
                    {/* Thumbnail */}
                    <div className="h-48 w-full overflow-hidden relative bg-black/40">
                        <img 
                            src={project.thumbnail} 
                            alt={project.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
                        
                        {/* Action Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm gap-3">
                            <button 
                                onClick={() => onOpenProject(project)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-500 transform hover:scale-105 transition-all shadow-lg"
                            >
                                Open
                            </button>
                             <button 
                                onClick={(e) => { e.stopPropagation(); onDeleteProject(project.id); }}
                                className="px-3 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg font-bold hover:bg-red-500 hover:text-white transform hover:scale-105 transition-all"
                                title="Delete Project"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            </button>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-white truncate pr-2">{project.name}</h3>
                        </div>
                        <p className="text-xs text-gray-400 mb-4 font-mono">
                            Last edited: {new Date(project.updatedAt).toLocaleDateString()}
                        </p>
                        
                        <div className="mt-auto flex items-center gap-2">
                            <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded bg-white/10 text-indigo-300">
                                {project.generatedImages.length} Images
                            </span>
                             <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded bg-white/10 text-pink-300">
                                v1.0
                            </span>
                        </div>
                    </div>
                 </div>
             ))}
        </div>
      )}
    </div>
  );
};