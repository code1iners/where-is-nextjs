import { motion } from "framer-motion";
import UserHorizontalItem, {
  UserHorizontalItemProps,
} from "@components/user-horizontal-item";

interface UserHorizontalItemWithAnimationProps extends UserHorizontalItemProps {
  index: number;
  delayValue?: number;
}

const UserHorizontalItemWithAnimation = ({
  user,
  index,
  delayValue = 0.125,
}: UserHorizontalItemWithAnimationProps) => {
  return (
    <motion.li
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
        transition: {
          delay: index * delayValue,
        },
      }}
    >
      <UserHorizontalItem user={user} />
    </motion.li>
  );
};

export default UserHorizontalItemWithAnimation;
