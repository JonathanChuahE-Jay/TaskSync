import { useAtom } from 'jotai'
import Modal from '@/components/reusable/Modal.tsx'
import { isOpenSettingsProjectModalAtom } from '@/jotai/projectManagementAtom.ts'

const ProjectManagementSettings = () => {
	const [isOpenModal, setIsOpenModal] = useAtom(isOpenSettingsProjectModalAtom)
	return (
		<Modal title='Settings' isOpen={isOpenModal} onClose={()=>setIsOpenModal(false)}>
			this is the settings
		</Modal>
	)
}

export default ProjectManagementSettings