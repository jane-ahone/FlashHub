import React from 'react'
import SelectAutoWidth from './SelectBtn'
import './UserInfo.css'
import UserActivity from './UserActivity'
import { CustomState, useCustomState } from '../utils';


interface UserInfoProps {
    activeMenuOption: string
}
// Passing prop so it can be updated in SelectAutoWidth

const UserInfo = ({ activeMenuOption }: UserInfoProps) => {
    let selectOptionBtn = useCustomState<string>('Created')
    return (
        <div className='UserInfoMain'>
            <SelectAutoWidth selectOptionBtn={selectOptionBtn} />
            <UserActivity activeMenuOption={activeMenuOption} selectOptionBtn={selectOptionBtn} />
        </div>
    )
}

export default UserInfo
