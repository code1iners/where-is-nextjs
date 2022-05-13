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
  delayValue = 0.1,
}: UserHorizontalItemWithAnimationProps) => {
  return (
    <motion.div
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
    </motion.div>
  );
};

export default UserHorizontalItemWithAnimation;
