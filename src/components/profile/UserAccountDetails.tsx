import "./UserAccountDetails.css"

interface Props {
    AccountDetailName: string;
}


const UserAccountDetails = ({ AccountDetailName }: Props) => {
    return (
        <div className='userAccountDetailsFlashcards'>
            <span className="userAccountDetailsNum">0</span>
            <span className="userAccountDetailsTitle">{AccountDetailName} </span>
        </div>
    )
}

export default UserAccountDetails
