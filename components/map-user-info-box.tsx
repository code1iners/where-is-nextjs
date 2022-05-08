import Link from "next/link";
import { User } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import usePrisma from "@libs/clients/usePrisma";

interface MapUserInfoBoxProps {
  isVisible: boolean;
  user?: User;
  onCloseClick: () => void;
}

const MapUserInfoBox = ({
  isVisible,
  user,
  onCloseClick,
}: MapUserInfoBoxProps) => {
  const { convertDate } = usePrisma();

  return (
    <AnimatePresence>
      {isVisible && user ? (
        <motion.div
          initial={{ scale: 0, rotate: 90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          exit={{ scale: 0, rotate: 90 }}
          className="absolute left-2 top-2 rounded-md py-1 px-2 bg-white border border-black cursor-default shadow-md"
        >
          <div className="flex justify-between items-center text-gray-600">
            <Link
              href={{
                pathname: `/users/${user.id}`,
                query: { name: user.name },
              }}
            >
              <a>
                <div className="flex justify-start items-center space-x-1 cursor-pointer hover:text-purple-500 hover:scale-105 transition-transform">
                  <span className="">{user.name}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </a>
            </Link>
            <svg
              onClick={onCloseClick}
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 cursor-pointer hover:text-purple-500 hover:scale-110 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="text-xs space-x-1 text-gray-500">
            <span>Last access</span>
            <span>:</span>
            <span className="">{convertDate(user.updatedAt)}</span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default MapUserInfoBox;
