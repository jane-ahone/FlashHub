import React from 'react'
import Avatar from "./Avatar"
import UserAccount from "./UserAccount"
import Menu from "./Menu"
import "./Profile.css"
import { activePage, LoginData, CustomState, LoginState } from '../utils';



interface ProfileProps {
    avatarName: string,
    loginState: CustomState<LoginState>
}



const Profile = (props: ProfileProps) => {
    return (
        <div>
            <div className="profileMainRest">
                <UserAccount loginState={props.loginState} />
                <Menu />
            </div>

        </div>
    )
}

export default Profile
