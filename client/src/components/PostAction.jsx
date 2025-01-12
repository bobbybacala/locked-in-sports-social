// post action component is a button that is used to like and comment on a post

export default function PostAction({ icon, onClick, text }) {
    return (
        <button
            className='flex items-center hover:text-neutral-200'
            onClick={(e) => {
                e.stopPropagation() // prevent the click event from bubbling up to the parent element, because we dont want to navigate to post page on click of this button
                if (onClick) onClick(e)
            }}>
            <span className='mr-1'>{icon}</span>
            <span className='hidden sm:inline'>{text}</span>
        </button>
    )
}