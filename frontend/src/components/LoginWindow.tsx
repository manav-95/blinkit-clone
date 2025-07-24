import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoCheckmark, IoWarningOutline } from "react-icons/io5";
import axios from "axios";

const LoginWindow = () => {
    const modalRef = useRef<HTMLDivElement | null>(null);
    const { setLoginBox, setLoggedIn } = useAuth();

    const [buttonActive, setButtonActive] = useState<boolean>(false)
    const [otpWindowOpen, setOtpWidowOpen] = useState<boolean>(false)
    const [input, setInput] = useState<string>("")
    const [otp, setOtp] = useState<string>("")
    const [message, setMessage] = useState<string>("")
    const [isError, setIsError] = useState<boolean | null>(null);

    const formattedNumber = '+91' + input;

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

    useEffect(() => {
        if (input.length === 10) {
            setButtonActive(true)
        } else {
            setButtonActive(false)
        }
    }, [input])


    const generateOTP = async () => {
        try {
            const res = await axios.post(
                `${baseUrl}/users/send-otp`,
                { phone: formattedNumber },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },

                }
            );

            if (res?.status === 201) {
                alert('OTP sent Successfully');
            }
        } catch (error) {
            console.error("Error sending OTP: ", error);
            alert('Failed to send OTP');
        }
    };


    useEffect(() => {

        if (otp.length === 6) {
            const verifyAndLogin = async () => {
                try {
                    const res = await axios.post(
                        `${baseUrl}/users/login`,
                        { phone: formattedNumber, otp: otp },
                        {
                            headers: {
                                "Content-Type": "application/json",
                            },
                            withCredentials: true,
                        }
                    );


                    if (res.status === 201) {
                        setIsError(false)
                        setMessage('Verification Successful')
                        localStorage.setItem('accessToken', res.data.user.accessToken)
                        alert(res.data.message)
                        setLoggedIn(true)
                        setOtpWidowOpen(false)
                        setLoginBox(false)
                        // setOtp("")

                        // console.log("Login Successful: ", res.data)
                    } else {
                        setIsError(true);
                        setMessage("Verification Failed");
                        alert("OTP Verification Failed")
                        setLoggedIn(false);
                        setOtp("")
                    }

                } catch (error) {
                    setIsError(true)
                    setMessage('Verification Failed')
                    alert("OTP Verification Failed")
                    console.log("Error Verifying OTP: ", error)
                    setLoggedIn(false)
                    setOtp("");
                }
            }

            verifyAndLogin();
        } else if (otp.length > 0) {
            setIsError(null)
        }
    }, [otp])





    return (
        <>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {otpWindowOpen
                    ? (
                        <>
                            <div ref={modalRef} className="bg-white flex flex-col items-center justify-start min-w-[560px] min-h-44 rounded-2xl">
                                <div className="flex justify-between items-center w-full px-6 py-3 shadow text-gray-800">
                                    <button onClick={() => setOtpWidowOpen(false)} className="">
                                        <FaArrowLeftLong className="h-4 w-4 flex-shrink-0" />
                                    </button>
                                    <h1 className="w-full text-center font-poppins">OTP Verification</h1>
                                </div>
                                <div className="px-4 py-8">
                                    <div className="flex flex-col items-center font-poppins text-gray-800 space-y-1">
                                        <p className="text-xs text-gray-600">We have sent a verification code to</p>
                                        <p>+91-{input || '0000000000'}</p>
                                    </div>
                                    <div className="my-4">
                                        <input
                                            type="tel"
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            autoFocus={true}
                                            className="w-full text-center font-poppins tracking-wide font-medium border border-red-500 rounded-lg outline-none px-4 py-2"
                                        />
                                    </div>
                                    <div className="flex justify-center items-center">
                                        <span className="font-poppins text-darkGreen text-sm">Resend Code</span>
                                    </div>
                                </div>

                                {isError !== null && (
                                    <div className={`${isError ? 'bg-red-50 text-red-500' : 'bg-green-50 text-darkGreen'} flex justify-center items-center space-x-1 w-full py-4 rounded-b-2xl`}>
                                        {isError ? (
                                            <>
                                                <IoWarningOutline className="h-3.5 w-3.5 flex-shrink-0" />
                                                <span className="text-xs font-poppins">{message}</span>
                                            </>
                                        ) : (
                                            <>
                                                <IoCheckmark className="h-3.5 w-3.5 flex-shrink-0" />
                                                <span className="text-xs font-poppins">{message}</span>
                                            </>
                                        )}
                                    </div>
                                )}


                            </div>
                        </>
                    ) : (
                        <>
                            <div ref={modalRef} className="relative bg-white flex flex-col items-center justify-center min-w-[560px] py-2 rounded-2xl">
                                <button onClick={() => setLoginBox(false)} className="absolute top-6 left-7">
                                    <FaArrowLeftLong className="h-4 w-4 flex-shrink-0" />
                                </button>
                                <div className="my-4">
                                    <img src="https://cdn.grofers.com/layout-engine/2023-11/app_logo.svg" alt="logo" />
                                </div>
                                <div className="flex flex-col items-center mb-4">
                                    <h1 className="text-2xl font-poppins font-semibold text-gray-800">India's last minute app</h1>
                                    <p className="font-poppins text-sm">Log in or Sign up</p>
                                </div>
                                <div className="mb-4 min-w-[18.5rem] space-y-4">
                                    <div className="flex items-center border-[1px] py-0.5 border-gray-400 rounded-[0.60rem] text-sm px-2.5 space-x-3.5 font-semibold font-poppins">
                                        <p>+91</p>
                                        <input
                                            type="tel"
                                            maxLength={10}
                                            autoFocus={true}
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(event) => {
                                                if (input.length == 10 && event.key === "Enter") {
                                                    setOtpWidowOpen(true)
                                                    generateOTP();
                                                }
                                            }}
                                            placeholder="Enter Your Number"
                                            className="w-full py-3 placeholder:font-medium placeholder:tracking-normal tracking-wide outline-none rounded-[0.60rem]"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <button
                                            disabled={!buttonActive}
                                            onClick={() => { setOtpWidowOpen(true); generateOTP() }}
                                            className={`${buttonActive ? 'bg-darkGreen' : 'bg-stone-400'} w-full cursor-pointer text-white font-poppins py-3 rounded-[0.60rem]`}
                                        >
                                            Continue
                                        </button>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <span className="text-xs font-poppins text-gray-600">By continuing, you agree to our Terms of service & Privacy policy</span>
                                </div>
                            </div >
                        </>
                    )
                }
            </div >
        </>
    )
}

export default LoginWindow
