import React, { useState } from 'react'
import "./Menu.css"
import Questions from "./Questions-amico (1).png";
import { CustomState, useCustomState } from '../utils';

interface MenuOption {
    state: CustomState<Boolean>,
    index: number,
    text: string
}


const Menu = () => {
    const btnMenuOptions: string[] = ["Flashcards", "Files", "Posts", "Saved"]


    const btnClicked: MenuOption[] = [
        { state: useCustomState<Boolean>(false), index: 0, text: "Flashcards" },
        { state: useCustomState<Boolean>(false), index: 1, text: "Files" },
        { state: useCustomState<Boolean>(true), index: 2, text: "Posts" },
        { state: useCustomState<Boolean>(false), index: 3, text: "Saved" }
    ]

    const activeMenuOption = useCustomState<number>(2)


    const btnActiveStyling = {
        backgroundColor: "rgba(23, 68, 83, 1)",
        color: "white",
        opacity: "1"
    }


    const handleClick = (menuOption: MenuOption) => {
        btnClicked[activeMenuOption.get()].state.set(false)
        activeMenuOption.set(menuOption.index)
        menuOption.state.set(true)



    };
    return (
        <>
            <div className="menuMain">

                {btnClicked.map((menuOption) =>
                    <button onClick={() => { handleClick(menuOption) }} style={menuOption.state.get() ? btnActiveStyling : {}} > {menuOption.text} </button>
                )}
                {/* <button onClick={handleClick} style={isClicked ? btnActiveStyling : {}} >Flashcards</button>
                <button>Files</button>
                <button>Posts</button>
                <button>Saved</button> */}
            </div>
            <button className='menuCreatedBtn'>Created <i className="bi bi-chevron-down"></i></button>
            <img src={Questions} width="10%" />
            <button className='menuCreateFlashcard'>Create Flashcards <i className="bi bi-chevron-down"></i></button>



        </>
    )
}


export default Menu