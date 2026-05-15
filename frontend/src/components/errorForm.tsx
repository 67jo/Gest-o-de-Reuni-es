import { AlertCircle } from "lucide-react"



export const ErrorFormAlert = (errorMessage:any) =>{
    return(
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-sm text-red-700 font-medium">{errorMessage}</span>
        </div>
    )
}