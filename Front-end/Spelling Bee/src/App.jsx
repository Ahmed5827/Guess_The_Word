
import Home from './Comp/Home/Home'
import { ConfirmProvider } from "material-ui-confirm";
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {

  return (
    <>
      <ConfirmProvider>
        <Home />
      </ConfirmProvider>
    </>
  )
}

export default App
