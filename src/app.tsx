import React from 'react'
import { hot } from 'react-hot-loader/root'
import { useRequest } from 'ahooks'
// import Home from './pages/home'

function App() {
  const getList = () => new Promise(resolve => {
    setTimeout(() => resolve([{label: 'test'}]), 1000)
  })

  const { data } = useRequest(getList)
  // console.log([1].includes(1))

  return (
    <>
      <div>App1</div>
      { data && <div>{data[0].label}</div> }
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
