import Router from "./routes/Router"
import { SearchProvider } from "./context/SearchContext"

function App() {

  return (
    <SearchProvider>
      <Router />
    </ SearchProvider>  
  )
}

export default App
