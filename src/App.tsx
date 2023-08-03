import { ThemeProvider } from "@emotion/react"
import CustomerChatBox from "./components"
import customTheme from "./components/theme"

function App() {

  // const url = 'asd'
  // const auth_token = 'asd'
  const url = 'http://localhost:5000/api/get-data'
  const auth_token = '5a9162c6-191f-4dae-babc-2e9e5ee73211'
  return (
  <>
  <ThemeProvider theme={customTheme}>
  <CustomerChatBox url={url} authToken={auth_token} />
  </ThemeProvider>
  </>
  )
}

export default App
