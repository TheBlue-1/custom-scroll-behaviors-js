import React from 'react';

import type { NextPage } from 'next'
const Home: NextPage = () => {
    React.useEffect(() => {import("custom-scroll-behaviors")}
    , [])
  return (  
    <div>
    <div >

    <div style={{backgroundColor: "black",width: "100vw",height: "100vh", position: "fixed"}}>

        <visibility-scroll-behavior start="0px" end="1000px" start-opacity="1" end-opacity="0">
        </visibility-scroll-behavior>
    </div>
    <div
        style={{backgroundColor: "black",width: "10vw",height: "10vw", position: "fixed",top: "calc(50vh - 5vw)",left:"45vw",borderRadius: "50%"}}>
        <visibility-scroll-behavior start="500px" end="1000px" start-opacity="0" end-opacity="1">
        </visibility-scroll-behavior>
    </div>
    <div
        style={{backgroundColor: "white",width: "10vw",height: "10vw", position: "fixed",top: "calc(50vh - 5vw)",left:"45vw",borderRadius: "50%"}}>
        <visibility-scroll-behavior start="0px" end="500px" start-opacity="1" end-opacity="0">
        </visibility-scroll-behavior>
    </div>
    <div style={{backgroundColor: "pink",width: "10vw",height: "10vh", position: "fixed",borderRadius: "50%"}}>
        <vertical-scroll-behavior start="0px" end="700px" start-pos="0vh" end-pos="90vh"></vertical-scroll-behavior>
        <horizontal-scroll-behavior start="300px" end="1000px" start-pos="0vw" end-pos="90vw">
        </horizontal-scroll-behavior>

    </div>
</div></div>
  )
}

export default Home
