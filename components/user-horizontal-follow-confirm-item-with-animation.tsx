import { motion } from "framer-motion";

import UserHorizontalFollowConfirmItem, {
  UserHorizontalFollowConfirmItemProps,
} from "@components/user-horizontal-follow-confirm-item";

interface UserHorizontalFollowConfirmItemWithAnimationProps
  extends UserHorizontalFollowConfirmItemProps {
  index: number;
  delayValue?: number;
}

const UserHorizontalFollowConfirmItemWithAnimation = ({
  user,
  onUserClick,
  onAgreeClick,
  onDisagreeClick,
  isLoading,
  enableAgreeButton,
  enableDisagreeButton,
  index,
  delayValue = 0.125,
}: UserHorizontalFollowConfirmItemWithAnimationProps) => {
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
      <UserHorizontalFollowConfirmItem
        user={user}
        onUserClick={onUserClick}
        onAgreeClick={onAgreeClick}
        onDisagreeClick={onDisagreeClick}
        isLoading={isLoading}
        enableAgreeButton={enableAgreeButton}
        enableDisagreeButton={enableDisagreeButton}
      />
    </motion.li>
  );
};

export default UserHorizontalFollowConfirmItemWithAnimation;
