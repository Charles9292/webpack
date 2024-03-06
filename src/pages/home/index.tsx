import React from 'react'
import './index.less'

const baseClass = 'home'

export default function index() {
  const sum = (a, b) => a + b
  return (
    <div className={baseClass}>home{sum(1, 2)}</div>
  )
}
