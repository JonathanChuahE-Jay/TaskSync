import { cn } from "@/utils/utils"

export const Button =
    (
        {
            children,
            className

        } : {
            children: React.ReactNode
            className?:string
        }
    ) => {
        return (
            <button className={cn("flex items-center gap-1 border px-3 py-1.5 rounded-md",className)}>
                {children}
            </button>
        )
    }
