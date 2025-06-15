import type { ProjectManagementSortOptionType, ProjectManagementTab } from "@/types/projectManagementTypes";
import { IconCalendar, IconChartArea, IconGrid4x4, IconList, IconTableSpark } from "@tabler/icons-react";

export const projectManagementTabs: ProjectManagementTab[] = [
    { id: 'grid', label: 'Grid', icon: <IconGrid4x4 /> },
    { id: 'list', label: 'List', icon: <IconList /> },
    { id: 'calendar', label: 'Calendar', icon: <IconCalendar /> },
    { id: 'chart', label: 'Chart', icon: <IconChartArea /> },
    { id: 'tasks', label: 'Tasks', icon: <IconTableSpark /> },
];


export const projectManagementsortOptions: ProjectManagementSortOptionType[] = [
    'Recent updated',
    'Oldest first',
    'Alphabetical',
    'Priority',
];
