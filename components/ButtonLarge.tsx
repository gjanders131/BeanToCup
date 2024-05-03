type ButtonProps = {
    label: string
    onClick: () => void
}

const ButtonLarge = ({ label, onClick }: ButtonProps) => {
    return (
        <div className=''>
            <button onClick={onClick}>{label}</button>
        </div>
    )
}

export default ButtonLarge
