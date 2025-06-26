import { useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";

const LoginWindow = () => {
    const modalRef = useRef<HTMLDivElement | null>(null);
    const { setLoginBox } = useAuth();

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                setLoginBox(false)
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setLoginBox])
    return (
        <>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div ref={modalRef} className="bg-white">
                    sa
                </div>
            </div>
        </>
    )
}

export default LoginWindow
