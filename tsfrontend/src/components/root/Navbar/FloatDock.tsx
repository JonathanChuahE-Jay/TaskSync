import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation } from '@tanstack/react-router';
import { navGroups } from '@/data/navItemsData';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useAuthStore } from '@/store/useAuthStore';

const FloatDock: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('/dashboard');
    const { user } = useAuthStore();
    
    useEffect(() => {
        setActiveTab(location.pathname);
    }, [location]);
    
    const quickAccessItems = navGroups.flatMap(group => group.items).slice(0, 4);
    
    const dockRef = useClickOutside<HTMLDivElement>(() => {
        setIsExpanded(false);
        setIsSettingsOpen(false);
    });

    return (
        <>
            <AnimatePresence>
                {(isExpanded || isSettingsOpen) && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 transition-colors duration-700"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => {
                            setIsExpanded(false);
                            setIsSettingsOpen(false);
                        }}
                    />
                )}
            </AnimatePresence>
            
            <div className="fixed bottom-3 left-0 right-0 flex justify-center z-50 px-4">
                <motion.div
                    ref={dockRef}
                    className={`bg-white/90 dark:bg-[#080a2e]/90 backdrop-blur-lg rounded-3xl w-full max-w-lg shadow-lg 
                               border border-white/20 dark:border-blush-800/30 transition-colors duration-700
                               ${isExpanded ? 'pb-4' : 'pb-2'}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Quick access dock */}
                    <div className="flex justify-around p-2">
                        {quickAccessItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.to}
                                className={`flex flex-col items-center p-2 rounded-xl transition duration-300
                                  ${activeTab === item.to 
                                    ? 'text-blush-600 dark:text-blush-400' 
                                    : 'text-gray-500 dark:text-gray-400 hover:text-blush-500 dark:hover:text-blush-300 hover:bg-blush-50/50 dark:hover:bg-blush-900/30'}`}
                                onClick={() => setActiveTab(item.to)}
                            >
                                <div className="flex items-center justify-center w-6 h-6 mb-1 relative">
                                    {item.icon}
                                    {activeTab === item.to && (
                                        <div className="absolute -bottom-1 w-1 h-1 bg-blush-500 dark:bg-blush-400 rounded-full transition-colors duration-700"></div>
                                    )}
                                </div>
                                <span className="text-xs font-medium truncate max-w-[64px]">{item.name}</span>
                            </Link>
                        ))}
                        
                        <button
                            className={`flex flex-col items-center p-2 rounded-xl transition-colors duration-700
                                      ${isExpanded 
                                        ? 'text-blush-600 dark:text-blush-400' 
                                        : 'text-gray-500 dark:text-gray-400 hover:text-blush-500 dark:hover:text-blush-300'}`}
                            onClick={() => {
                                setIsExpanded(!isExpanded);
                                setIsSettingsOpen(false);
                            }}
                        >
                            <div className="flex items-center justify-center w-6 h-6 mb-1">
                                <div className="relative w-5 h-5 flex items-center justify-center">
                                    <span className={`block w-5 h-0.5 transition duration-300 absolute
                                      ${isExpanded ? 'bg-transparent' : 'bg-current'}`}></span>
                                    <span className={`block w-5 h-0.5 bg-current transition duration-300 absolute
                                      ${isExpanded ? 'rotate-45' : '-translate-y-1.5'}`}></span>
                                    <span className={`block w-5 h-0.5 bg-current transition duration-300 absolute
                                      ${isExpanded ? '-rotate-45' : 'translate-y-1.5'}`}></span>
                                </div>
                            </div>
                            <span className="text-xs font-medium">Menu</span>
                        </button>
                    </div>
                    
                    {/* Expanded Menu */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                className="overflow-hidden"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="pt-2 px-1">
                                    {navGroups.map((group, groupIndex) => (
                                        <div key={groupIndex} className="mt-4 px-2">
                                            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-2 mb-2 tracking-wider transition-colors duration-700">
                                                {group.title}
                                            </h3>
                                            <div className="grid grid-cols-3 gap-2">
                                                {group.items.map((item, itemIndex) => (
                                                    <Link
                                                        key={itemIndex}
                                                        to={item.to}
                                                        className={`flex flex-col items-center p-3 rounded-xl group
                                                          transition duration-300 
                                                          ${activeTab === item.to 
                                                            ? 'bg-blush-50 dark:bg-blush-900/40 text-blush-600 dark:text-blush-300 border border-blush-100 dark:border-blush-700/50' 
                                                            : 'bg-white/60 dark:bg-[#080a2e]/60 text-gray-700 dark:text-gray-300 hover:bg-blush-50/70 dark:hover:bg-blush-900/30 border border-transparent dark:border-blush-950/50 hover:border-blush-100 dark:hover:border-blush-800/50'}`}
                                                        onClick={() => {
                                                            setActiveTab(item.to);
                                                            setIsExpanded(false);
                                                        }}
                                                    >
                                                        <div className="mb-2 transition-transform duration-300 group-hover:scale-110">{item.icon}</div>
                                                        <span className="text-xs font-medium text-center truncate w-full">
                                                            {item.name}
                                                        </span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    
                                    <div className="mt-6 px-2">
                                        <button
                                            className="flex items-center w-full rounded-xl bg-gray-50/80 dark:bg-blush-900/30 p-3 
                                                     transition duration-300 hover:scale-[1.01]
                                                     hover:bg-gray-100 dark:hover:bg-blush-800/30
                                                     border border-gray-100/80 dark:border-blush-800/30"
                                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-blush-500 flex-shrink-0 overflow-hidden">
                                                <img 
                                                    src={`https://ui-avatars.com/api/?name=${user?.first_name || 'User'}&background=4A6CF7&color=fff`} 
                                                    alt="Profile" 
                                                />
                                            </div>
                                            <div className="ml-3 text-left flex-1">
                                                <span className="block text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors duration-700">
                                                    {user?.first_name || 'Guest'} {user?.last_name || ''}
                                                </span>
                                                <span className="block text-xs text-gray-500 dark:text-gray-400 transition-colors duration-700">
                                                    {user?.email || 'Not signed in'}
                                                </span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </>
    );
};

export default FloatDock;