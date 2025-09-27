import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { icons } from "./iconTypes";
import type { IconName } from "./iconTypes";

interface IconProps {
  className?: string;
  onClick?: () => void;
}

export const EditIcon = ({ className, onClick }: IconProps) => (
  <FontAwesomeIcon
    icon={faPenToSquare}
    className={className}
    onClick={onClick}
  />
);

// Generic icon component
export const Icon = ({
  name,
  className,
  onClick,
}: IconProps & { name: IconName }) => (
  <FontAwesomeIcon icon={icons[name]} className={className} onClick={onClick} />
);

export const DeleteIcon = ({ className, onClick }: IconProps) => (
  <FontAwesomeIcon icon={faXmark} className={className} onClick={onClick} />
);
