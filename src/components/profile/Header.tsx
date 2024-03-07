import React from 'react'
import Avatar from './Avatar'
import "./Header.css"

interface Props {
    avatarName: string
    bgColour: Object
}

const Header = ({ avatarName, bgColour }: Props) => {
    return (
        <div className='profileHeader'>
            <span className='appName'>FLASH HUB</span>
            <div className="profileAvatar">
                <Avatar avatarName={avatarName} bgColour={bgColour}></Avatar>
            </div>
        </div>
    )
}

export default Header
