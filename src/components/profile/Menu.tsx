import React, { useState } from 'react'
import "./Menu.css"
import { CustomState, useCustomState } from '../utils';
import SelectAutoWidth from './SelectBtn';
import UserInfo from './UserInfo';

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
                    <button onClick={() => { handleClick(menuOption) }} style={menuOption.state.get() ? btnActiveStyling : {}} className={menuOption.text + 'btn'}> {menuOption.text} </button>
                )}
            </div>
            <UserInfo activeMenuOption={btnClicked[activeMenuOption.get()].text} />
        </>
    )
}


export default Menu