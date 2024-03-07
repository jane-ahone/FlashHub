import React from 'react'
import Avatar from './Avatar'
import Follow from './Follow'
import UserAccountDetails from './UserAccountDetails'
import "./UserInfo.css"

interface Props {
    avatarName: string
    bgColour: Object
    usersname: string
}

const UserInfo = ({ avatarName, bgColour, usersname }: Props) => {
    return (
        <div className='userInfoMain'>
            <Avatar avatarName={avatarName} bgColour={bgColour} />
            <p className='userName'>{usersname}
                <Follow />
            </p>
            <p className='userBio'>Lorem ipsum dolor sit amet consectetur <br /> adipisicing elit</p>

            <div className="profileUserAccountDetails">
                <UserAccountDetails AccountDetailName="Flashcards Created" />
                <UserAccountDetails AccountDetailName="Posts" />
                <UserAccountDetails AccountDetailName="Friends" />
            </div>


        </div>
    )
}

export default UserInfo
