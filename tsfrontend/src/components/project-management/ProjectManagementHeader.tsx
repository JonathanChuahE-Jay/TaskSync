import { IconChevronDown, IconFilter, IconPlus, IconSearch } from "@tabler/icons-react";
import { Button } from "../common/Button";
import Input from "../reusable/Input";
import type { Dispatch, SetStateAction } from "react";

interface ProjectManagementHeaderProps {
	searchContent: string;
	setSearchContent: Dispatch<SetStateAction<string>>;
}

const ProjectManagementHeader: React.FC<ProjectManagementHeaderProps> = ({
	searchContent,
	setSearchContent,
}) => {
	return (
		<div className="shadow-md p-4 rounded-lg flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white">
			<div>
				<h1 className="text-lg font-bold">Projects</h1>
				<h2 className="text-gray-500 text-sm">Manage all your team's work in one place</h2>
			</div>

			<div className="flex gap-2">
				<div className="flex-1 lg:flex-initial lg:w-64">
					<Input
						value={searchContent}
						onChange={(e) => setSearchContent(e.target.value)}
						type="text"
						placeholder="Search projects..."
						icon={<IconSearch className="size-4" />}
						className="py-1.5 m-0 rounded-lg"
						showClearButton={true}
					/>
				</div>

				<Button className="shrink-0 lg:w-auto bg-indigo-600 text-white" aria-label="New Project">
					<IconPlus />
					<span className="hidden lg:inline ">New Project</span>
				</Button>

				<Button className="shrink-0 lg:w-auto flex items-center gap-2" aria-label="Filter">
					<IconFilter className="size-6" />
					<span className="hidden lg:inline">Filter</span>
					<IconChevronDown className="size-4" />
				</Button>
			</div>
		</div>
	);
};

export default ProjectManagementHeader;