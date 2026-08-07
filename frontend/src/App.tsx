import Router from "./routes/Router"
import { SearchProvider } from "./context/SearchContext"
import { Toaster } from "@/components/ui/sonner"

function App() {

  return (
    <SearchProvider>
      <Router />
      <Toaster
        position="bottom-right"
        richColors
        closeButton
      />
    </SearchProvider>
  )
}

export default App