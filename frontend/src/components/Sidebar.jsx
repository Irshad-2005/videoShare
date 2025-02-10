import { MdMenu } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { SiYoutubeshorts } from "react-icons/si";
import { MdPlaylistAdd } from "react-icons/md";
import { FaHistory } from "react-icons/fa";
import { BiSolidLike } from "react-icons/bi";
import { MdOutlineSubscriptions } from "react-icons/md";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { Link } from "react-router-dom";
const Sidebar = () => {
    const navIcons = [
        {
            title: "home",
            icon: <FaHome />,
        },
        {
            title: "shorts",
            icon: <SiYoutubeshorts />,
        },
        {
            title: "history",
            icon: <FaHistory />,
        },
        {
            title: "playlist",
            icon: <MdPlaylistAdd />,
        },
        {
            title: "liked",
            icon: <BiSolidLike />,
        },
        {
            title: "your video",
            icon: <MdOutlineOndemandVideo />,
        },
        {
            title: "subscribers",
            icon: <MdOutlineSubscriptions />,
        },
    ];
    return (
        <div className="w-full h-full">
            <div className="flex items-center justify-center gap-4">
                <MdMenu className="text-2xl" />
                <h3 className="m-2 p-2 text-xl ">YOUTUBE</h3>
            </div>
            <div className="w-full h-full">
                <div className="px-8 w-full h-full">
                    {navIcons.map((navItems, navIndex) => (
                        <div
                            className="flex items-center justify-start gap-6 py-2"
                            key={navIndex}
                        >
                            <span className="inline-block text-2xl">
                                {navItems.icon}
                            </span>
                            <Link
                                className="text-xl "
                                to={`/${navItems.title}`}
                            >
                                {navItems.title}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
