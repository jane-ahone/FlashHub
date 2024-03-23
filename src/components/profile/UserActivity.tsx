import React from 'react'
import { CustomState, useCustomState } from '../utils';
import Questions from "./Questions-amico (1).png";
import './UserActivity.css'

interface UserActivityProps {
    activeMenuOption: string
    selectOptionBtn: CustomState<string>
}

const UserActivity = (props: UserActivityProps) => {
    const optionText = (() => {
        switch (props.selectOptionBtn.get()) {
            case "Created":
                return <span>Create </span>;
            default:
                return <span>Study </span>;
        }
    })();
    return (
        <div className='userActivityMain'>
            <img src={Questions} width="10%" />
            <p>No {props.activeMenuOption} {props.selectOptionBtn.get()} </p>
            <button className='userActivityMenuCreate'>
                {optionText}
                {props.activeMenuOption}
            </button>

        </div>
    )
}

export default UserActivity
