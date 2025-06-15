import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconArrowDown } from '@tabler/icons-react';

export interface TabItem<T extends string = string> {
    id: T;
    label: string;
    icon?: React.ReactNode;
}

export interface SortOption<S = string> {
    value: S;
    label: string;
}

export interface TabsWithSortingProps<TabID extends string = string, SortValue = string> {
    tabs: TabItem<TabID>[];
    sortOptions: SortOption<SortValue>[];
    activeTab: TabID;
    onTabChange: (tabId: TabID) => void;
    currentSortOption: SortValue;
    onSortChange: (option: SortValue) => void;
    className?: string;
    tabsClassName?: string;
    sortClassName?: string;
}

export function useTabUnderline<T extends HTMLElement = HTMLButtonElement>(
    activeTabIndex: number
) {
    const tabsRef = useRef<(T | null)[]>([]);
    const [underlineStyle, setUnderlineStyle] = useState({
        width: 0,
        left: 0
    });

    useEffect(() => {
        const updateUnderlinePosition = () => {
            if (tabsRef.current[activeTabIndex]) {
                const tab = tabsRef.current[activeTabIndex];
                const tabRect = tab?.getBoundingClientRect();
                const containerRect = tab?.parentElement?.getBoundingClientRect();

                if (tabRect && containerRect) {
                    setUnderlineStyle({
                        width: tabRect.width,
                        left: tabRect.left - containerRect.left
                    });
                }
            }
        };

        updateUnderlinePosition();
        window.addEventListener('resize', updateUnderlinePosition);
        return () => window.removeEventListener('resize', updateUnderlinePosition);
    }, [activeTabIndex]);

    return { tabsRef, underlineStyle };
}
export function TabsWithSorting<TabID extends string = string, SortValue = string>({
    tabs,
    sortOptions,
    activeTab,
    onTabChange,
    currentSortOption,
    onSortChange,
    className = "shadow-md p-4 mt-5 bg-white rounded-lg flex flex-col gap-4",
    tabsClassName = "flex flex-wrap gap-2 relative",
    sortClassName = "relative"
}: TabsWithSortingProps<TabID, SortValue>) {
    const [showSortOptions, setShowSortOptions] = useState(false);
    const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab);
    const { tabsRef, underlineStyle } = useTabUnderline(activeTabIndex);

    const handleSortChange = (option: SortValue) => {
        onSortChange(option);
        setShowSortOptions(false);
    };

    const currentSortLabel = sortOptions.find(opt => opt.value === currentSortOption)?.label ||
        String(currentSortOption);

    return (
        <div className={className}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                <div className={tabsClassName}>
                    {tabs.map((tab, index) => (
                        <button
                            key={tab.id}
                            ref={el => {
                                if (tabsRef.current) tabsRef.current[index] = el;
                            }}
                            className={`px-4 py-2 flex items-center gap-2 rounded-md transition-colors relative ${activeTab === tab.id
                                    ? 'bg-indigo-100 text-indigo-800'
                                    : 'hover:bg-gray-100 text-gray-600'
                                }`}
                            onClick={() => onTabChange(tab.id)}
                        >
                            {tab.icon && (
                                <span className={activeTab === tab.id ? 'text-indigo-700' : ''}>
                                    {tab.icon}
                                </span>
                            )}
                            <span className="hidden md:inline-block">{tab.label}</span>
                        </button>
                    ))}

                    <motion.div
                        className="absolute bottom-0 h-0.5 bg-indigo-600"
                        layoutId="tab-underline"
                        style={{
                            width: `${underlineStyle.width}px`,
                            left: `${underlineStyle.left}px`
                        }}
                    />
                </div>

                <div className={sortClassName}>
                    <button
                        onClick={() => setShowSortOptions(!showSortOptions)}
                        className="px-4 py-2 flex items-center gap-2 border border-gray-200 rounded-md hover:bg-gray-50"
                    >
                        <span>Sort by: {currentSortLabel}</span>
                        <IconArrowDown
                            className={`transition-transform ${showSortOptions ? 'rotate-180' : ''}`}
                            size={16}
                        />
                    </button>

                    <AnimatePresence>
                        {showSortOptions && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                            >
                                {sortOptions.map((option) => (
                                    <button
                                        key={String(option.value)}
                                        onClick={() => handleSortChange(option.value)}
                                        className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${option.value === currentSortOption ? 'bg-indigo-50 text-indigo-700' : ''
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}