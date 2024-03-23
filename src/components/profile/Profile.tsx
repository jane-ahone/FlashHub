import React from 'react'
import Avatar from "./Avatar"
import UserAccount from "./UserAccount"
import Menu from "./Menu"
import "./Profile.css"
import { activePage, LoginData, CustomState, LoginState } from '../utils';



interface ProfileProps {
    avatarName: string,
    usersname: string
    loginState: CustomState<LoginData>
}



const Profile = (props: ProfileProps) => {
    return (
        <div>
            <div className="profileMainRest">
                <UserAccount loginState={props.loginState} usersname={props.usersname} />
                <Menu />
            </div>

        </div>
    )
}

export default Profile
