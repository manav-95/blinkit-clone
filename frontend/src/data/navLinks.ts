import { FaMapLocationDot, FaQuestion } from "react-icons/fa6";
import { IoDocumentTextSharp } from "react-icons/io5";
import { MdPrivacyTip } from "react-icons/md";
import { BsFillPersonFill } from "react-icons/bs";

export const navLinks = [
  { name: 'My Addresses', path: 'addresses', icon: FaMapLocationDot },
  { name: 'my orders', path: 'my-orders', icon: IoDocumentTextSharp },
  { name: `FAQ's`, path: 'faq', icon: FaQuestion },
  { name: 'Account Privacy', path: 'account-privacy', icon: MdPrivacyTip },
  { name: 'Logout', path: 'logout', icon: BsFillPersonFill },
]