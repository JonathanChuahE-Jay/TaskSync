import { projectManagementsortOptions, projectManagementTabs } from '@/data/projectManagementData';
import { TabsWithSorting } from '../reusable/TabsWithSorting';
import type { ProjectManagementToolProps } from '@/types/projectManagementTypes';

const ProjectManagementTool: React.FC<ProjectManagementToolProps> = ({
    sortOption,
    setSortOption,
    activeTab,
    setActiveTab
}) => {

    const formattedSortOptions = projectManagementsortOptions.map(option => ({
        value: option,
        label: option
    }));
    return (
        <TabsWithSorting
            tabs={projectManagementTabs}
            sortOptions={formattedSortOptions}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            currentSortOption={sortOption}
            onSortChange={setSortOption}
        />
    );
};

export default ProjectManagementTool;
