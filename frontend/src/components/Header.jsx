import { BsSearchHeart } from "react-icons/bs";
import Sidebar from "./Sidebar";

const Header = () => {
    return (
        <div className="flex h-full w-full ">
            <div className=" py-3 w-[15%]">
                <Sidebar />
            </div>
            <div className="h-full w-[85%] flex flex-col ">
                <div className="w-full h-[10vh] overflow-hidden px-10">
                    <div className=" flex items-center justify-center w-full h-full relative ">
                        <div className="flex items-center relative overflow-hidden w-[60%]">
                            <input
                                className=" rounded-tl-full w-[70%] rounded-bl-full pl-5 py-[6px] bg-transparent outline border-[1px] border-white/20 focus:border-blue-700 outline-none placeholder:text-white"
                                type="text"
                                placeholder="Search"
                            />

                            <BsSearchHeart className=" p-[10px] text-[2.3em] pr-3 bg-black/85  rounded-br-full rounded-tr-full" />
                        </div>

                        <ul className="absolute top-0 right-0  gap-15 flex items-center h-full justify-between">
                            <li className="mx-2 p-2">Upload</li>
                            <li className="mx-2 p-2">Profile</li>
                            <li className="mx-2 p-2">Login</li>
                        </ul>
                    </div>
                </div>
                <div className="bg-black h-[90vh] w-full"></div>
            </div>
        </div>
    );
};

export default Header;
