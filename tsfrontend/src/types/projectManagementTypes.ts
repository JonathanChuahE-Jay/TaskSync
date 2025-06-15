import type { Dispatch, SetStateAction } from "react";

export interface ProjectManagementTab {
    id: projectManagementTabsIDType;
    label: string;
    icon: React.ReactNode;
}

export interface ProjectManagementToolProps {
    sortOption: ProjectManagementSortOptionType;
    setSortOption: Dispatch<SetStateAction<ProjectManagementSortOptionType>>;
    activeTab: projectManagementTabsIDType;
    setActiveTab: Dispatch<SetStateAction<projectManagementTabsIDType>>;
}

export type ProjectManagementSortOptionType =
    | 'Recent updated'
    | 'Oldest first'
    | 'Alphabetical'
    | 'Priority';

export type projectManagementTabsIDType =
    | 'list'
    | 'calendar'
    | 'chart'
    | 'tasks'
    | 'grid';