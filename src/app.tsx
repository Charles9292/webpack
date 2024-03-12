import React from 'react'
import { hot } from 'react-hot-loader/root'
// import Home from './pages/home'

function App() {
  return (
    <>
      <div>App1</div>
      {
        import(/* webpackChunkName: "home" */'./pages/home').then(module => {
          const Home = module.default
          return <Home />
        })
      }
      
      {/* <Home /> */}
    </>
  )
}

export default hot(App)
