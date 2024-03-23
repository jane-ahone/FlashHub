import React from 'react'
// import Avatar from './Avatar'
import Follow from './Follow'
import UserAccountDetails from './UserAccountDetails'
import "./UserAccount.css"
import { LoginState, CustomState } from '../utils'

interface Props {
    usersname: string
    loginState: CustomState<LoginState>
}




const UserAccount = ({ loginState, usersname }: Props) => {
    return (
        <div className='userInfoMain'>
            <img src={loginState.get().profilePicUrl} alt={loginState.get().name} className='usersAvatar' />
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

export default UserAccount
