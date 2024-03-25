import React from 'react'
// import Avatar from './Avatar'
import Follow from './Follow'
import UserAccountDetails from './UserAccountDetails'
import "./UserAccount.css"
import { LoginState, CustomState } from '../utils'

interface Props {
    loginState: CustomState<LoginState>
}




const UserAccount = ({ loginState }: Props) => {
    return (
        <div className='userInfoMain'>
            <img src={loginState.get().profile_url} alt={loginState.get().username} className='usersAvatar' />
            <p className='userName'>{loginState.get().getFullName()}
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
