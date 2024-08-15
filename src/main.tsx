import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.scss'
import { Provider } from 'react-redux'
import { store } from './store.ts'
import { apiSlice } from './api.ts'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
)

store.dispatch(apiSlice.endpoints.getRows.initiate())
