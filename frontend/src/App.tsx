import Router from "./routes/Router"
import { SearchProvider } from "./context/SearchContext"
import { AuthProvider } from "./context/AuthContext"
import { Toaster } from "@/components/ui/sonner"

function App() {

  return (
    <AuthProvider>
      <SearchProvider>
        <Router />
        <Toaster
          position="bottom-right"
          richColors
          closeButton
        />
      </SearchProvider>
    </AuthProvider>
  )
}

export default App