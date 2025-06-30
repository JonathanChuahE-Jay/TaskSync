const SideBarExpander = ({handleSideBarExpand}:{handleSideBarExpand: ()=>void}) => {
	return (
		<button
			className="absolute bottom-0 -right-4 w-3 p-2 h-15 bg-black rounded-r-full flex flex-col items-center justify-center gap-[3px]"
			onClick={handleSideBarExpand}
		>
			<span className="w-[10px] h-[2px] bg-gray-200 rounded" />
			<span className="w-[10px] h-[2px] bg-gray-200 rounded" />
			<span className="w-[10px] h-[2px] bg-gray-200 rounded" />
		</button>
	)
}

export default SideBarExpander
