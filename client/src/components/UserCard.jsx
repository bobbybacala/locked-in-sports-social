import { Link } from "react-router-dom"


const UserCard = ({ user, isConnection }) => {
    return (
        <div className='bg-neutral-800 rounded-lg shadow p-4 flex flex-col items-center transition-all hover:shadow-sm hover:shadow-gray-700'>
            <Link to={`/profile/${user.username}`} className='flex flex-col items-center'>
                <img
                    src={user.profilePicUrl || "/avatar.png"}
                    alt={user.name}
                    className='w-24 h-24 rounded-full object-cover mb-4'
                />
                <h3 className='font-semibold text-lg text-center'>{user.name}</h3>
            </Link>
            <p className='text-neutral-500 text-center'>{user.headline}</p>
            <p className='text-sm text-neutral-500 mt-2'>{user.connections?.length} connections</p>
            <button className='mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors w-full'>
                {isConnection ? "Connected" : "Connect"}
            </button>
        </div>
    )
}

export default UserCard