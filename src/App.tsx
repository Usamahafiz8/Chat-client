import { ThemeProvider } from "@emotion/react"
import CustomerChatBox from "./components"
import customTheme from "./components/theme"

function App() {

  // const url = 'asd'
  // const auth_token = 'asd'
  const url = ''
  const auth_token = ''
  return (
  <>
  <ThemeProvider theme={customTheme}>
  <CustomerChatBox url={url} authToken={auth_token} />
  </ThemeProvider>
  </>
  )
}

export default App
