import { useEffect, useRef } from 'react'

type PopUpProps = {
    children: React.ReactNode
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
}

const PopUp = ({ children, isOpen, setIsOpen }: PopUpProps) => {
    const overlayRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        overlayRef.current?.addEventListener('click', (e) => {
            if (e.currentTarget === e.target) {
                setIsOpen(false)
            }
        })
    })

    return isOpen ? (
        <div className='fixed h-screen w-screen bg-opacity-50 bg-black top-0 left-0'>
            <div
                ref={overlayRef}
                className='flex h-screen w-screen justify-center items-center'
            >
                <div className='bg-slate-500 rounded-sm w-3/4 h-3/4 min-w-[256px] min-h-[256px] p-4 overflow-y-scroll'>
                    {children}
                </div>
            </div>
        </div>
    ) : null
}

export default PopUp
