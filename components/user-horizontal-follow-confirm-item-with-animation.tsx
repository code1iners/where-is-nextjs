import { motion, AnimatePresence } from "framer-motion";

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
  delayValue = 0.1,
}: UserHorizontalFollowConfirmItemWithAnimationProps) => {
  return (
    <AnimatePresence>
      <motion.div
        key={user.id}
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            delay: index * delayValue,
          },
        }}
        exit={{
          opacity: 0,
          y: -20,
        }}
        transition={{
          duration: 0.15,
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
      </motion.div>
    </AnimatePresence>
  );
};

export default UserHorizontalFollowConfirmItemWithAnimation;
