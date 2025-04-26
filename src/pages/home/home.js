import React, { useState } from 'react'

const Home = ({setUIColor}) => {
  const [data, setData] = useState()

  const setInputValue = (e) => {
    const { value } = e.target
    setData(value)
    setUIColor(value)
  }
  return (
    <div>
      <input value={data} onChange={(e)=>setInputValue(e)}></input>
    </div>
  )
}

export default Home