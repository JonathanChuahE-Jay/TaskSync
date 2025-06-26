import React, { useEffect, useState } from 'react'
import { cn } from '@/utils/utils.ts'

interface PaginationProps {
	currentPage: number
	totalPages: number
	onPageChange: (page: number) => void
	itemsPerPage: number
	totalItems: number
	onItemsPerPageChange?: (size: number) => void
	pageSizeOptions?: Array<number>
	className?: string
}

const Pagination: React.FC<PaginationProps> = ({
	currentPage,
	totalPages,
	onPageChange,
	itemsPerPage,
	totalItems,
	onItemsPerPageChange,
	pageSizeOptions = [9, 18, 36, 72],
	className = '',
}) => {
	const [pageInput, setPageInput] = useState(currentPage.toString())

	useEffect(() => {
		setPageInput(currentPage.toString())
	}, [currentPage])

	const getPageNumbers = () => {
		const pageNumbers = []

		if (totalPages <= 5) {
			for (let i = 1; i <= totalPages; i++) {
				pageNumbers.push(i)
			}
		} else {
			pageNumbers.push(1)

			if (currentPage <= 3) {
				pageNumbers.push(2, 3, '...', totalPages)
			} else if (currentPage >= totalPages - 2) {
				pageNumbers.push('...', totalPages - 2, totalPages - 1, totalPages)
			} else {
				pageNumbers.push(
					'...',
					currentPage - 1,
					currentPage,
					currentPage + 1,
					'...',
					totalPages,
				)
			}
		}

		return pageNumbers
	}

	const handlePrevious = () => {
		if (currentPage > 1) {
			onPageChange(currentPage - 1)
		}
	}

	const handleNext = () => {
		if (currentPage < totalPages) {
			onPageChange(currentPage + 1)
		}
	}

	const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPageInput(e.target.value)
	}

	const handlePageInputKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
	) => {
		if (e.key === 'Enter') {
			let page = parseInt(pageInput)
			if (!isNaN(page)) {
				page = Math.min(Math.max(1, page), totalPages)
				onPageChange(page)
			}
			setPageInput(currentPage.toString())
		}
	}

	const handlePageInputBlur = () => {
		let page = parseInt(pageInput)
		if (!isNaN(page)) {
			page = Math.min(Math.max(1, page), totalPages)
			onPageChange(page)
		}
		setPageInput(currentPage.toString())
	}

	const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)
	const endItem = Math.min(currentPage * itemsPerPage, totalItems)

	return (
		<div
			className={cn(
				`flex mt-auto flex-wrap items-center justify-between`,
				className,
			)}
		>
			<div className="flex items-center space-x-4 mb-3 md:mb-0">
				<div className="text-sm text-gray-600">
					Showing <span className="font-medium">{startItem}</span> to{' '}
					<span className="font-medium">{endItem}</span> of{' '}
					<span className="font-medium">{totalItems}</span> items
				</div>

				{onItemsPerPageChange && (
					<div className="flex items-center space-x-2">
						<label htmlFor="pageSize" className="text-sm text-gray-600">
							Show:
						</label>
						<select
							id="pageSize"
							value={itemsPerPage}
							onChange={(e) =>
								onItemsPerPageChange(Number(e.target.value))
							}
							className="border border-gray-300 rounded-md py-1 pl-2 pr-8 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						>
							{pageSizeOptions.map((size) => (
								<option key={size} value={size}>
									{size}
								</option>
							))}
						</select>
					</div>
				)}
			</div>

			<div className="flex items-center space-x-4">
				<nav
					className="relative z-0 inline-flex rounded-md shadow-md -space-x-px"
					aria-label="Pagination"
				>
					<button
						onClick={handlePrevious}
						disabled={currentPage === 1}
						className={`relative inline-flex items-center px-3 py-2 rounded-l-md border text-sm font-medium ${
							currentPage === 1
								? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
								: 'bg-white border-gray-300 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors'
						}`}
					>
						<span className="sr-only">Previous</span>
						<svg
							className="h-5 w-5"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fillRule="evenodd"
								d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
								clipRule="evenodd"
							/>
						</svg>
					</button>

					{getPageNumbers().map((page, index) => (
						<React.Fragment key={index}>
							{page === '...' ? (
								<span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
									...
								</span>
							) : (
								<button
									onClick={() =>
										typeof page === 'number' && onPageChange(page)
									}
									className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
										currentPage === page
											? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
											: 'bg-white border-gray-300 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors'
									}`}
								>
									{page}
								</button>
							)}
						</React.Fragment>
					))}

					<button
						onClick={handleNext}
						disabled={currentPage === totalPages}
						className={`relative inline-flex items-center px-3 py-2 rounded-r-md border text-sm font-medium ${
							currentPage === totalPages
								? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
								: 'bg-white border-gray-300 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors'
						}`}
					>
						<span className="sr-only">Next</span>
						<svg
							className="h-5 w-5"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fillRule="evenodd"
								d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
				</nav>

				<div className="flex items-center space-x-2">
					<label htmlFor="go-to-page" className="text-sm text-gray-600">
						Go to:
					</label>
					<input
						id="go-to-page"
						type="text"
						value={pageInput}
						onChange={handlePageInputChange}
						onKeyDown={handlePageInputKeyDown}
						onBlur={handlePageInputBlur}
						className="w-14 border border-gray-300 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						aria-label="Go to page"
					/>
					<span className="text-sm text-gray-600">of {totalPages}</span>
				</div>
			</div>
		</div>
	)
}

export default Pagination
