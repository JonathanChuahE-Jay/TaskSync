import { create } from 'zustand'

interface StepperState {
	currentStep: number
	totalSteps: number
	setCurrentStep: (step: number) => void
	nextStep: () => void
	prevStep: () => void
	goToStep: (step: number) => void
	setTotalSteps: (count: number) => void
}

export const useStepperStore = create<StepperState>((set) => ({
	currentStep: 1,
	totalSteps: 1,
	setCurrentStep: (step) => set({ currentStep: step }),
	nextStep: () =>
		set((state) => ({
			currentStep:
				state.currentStep < state.totalSteps
					? state.currentStep + 1
					: state.currentStep,
		})),
	prevStep: () =>
		set((state) => ({
			currentStep:
				state.currentStep > 1 ? state.currentStep - 1 : state.currentStep,
		})),
	goToStep: (step) => set({ currentStep: step }),
	setTotalSteps: (count) => set({ totalSteps: count }),
}))
