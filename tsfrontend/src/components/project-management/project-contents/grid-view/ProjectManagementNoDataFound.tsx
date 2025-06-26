const ProjectManagementNoDataFound = () => {
	return (
		<div className="text-center flex-1 flex flex-col items-center justify-center rounded-md">
			<svg
				className="mx-auto h-12 w-12 text-gray-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.5}
					d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
				/>
			</svg>
			<h3 className="mt-2 text-lg font-medium text-gray-900">
				No projects found
			</h3>
			<p className="mt-1 text-sm text-gray-500">
				Get started by creating a new project.
			</p>
		</div>
	)
}

export default ProjectManagementNoDataFound
