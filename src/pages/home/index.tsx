import React from 'react'
import './index.less'

const baseClass = 'home'

export default function index() {
  const sum = () => {
    console.log("%c Line:9 🥤", "color:#3f7cff");
  }
  return (
    <div className={baseClass}>home</div>
  )
}
