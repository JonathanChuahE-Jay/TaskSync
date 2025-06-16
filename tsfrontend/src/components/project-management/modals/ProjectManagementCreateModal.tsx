import Modal from '@/components/reusable/Modal.tsx'
import { useDefaultAppForm } from '@/components/common/defaultForm/DefaultAppForm.tsx'

interface ProjectManagementCreateModalProps {
	isOpen: boolean
	onClose: () => void
}

const ProjectManagementCreateModal = ({ isOpen, onClose }: ProjectManagementCreateModalProps) => {
	const form = useDefaultAppForm({
		defaultValues: {

		}
	})
	return (
		<Modal isOpen={isOpen} onClose={onClose} title='Create a Project'>

		</Modal>
	)
}

export default ProjectManagementCreateModal
