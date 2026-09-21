import Image from "next/image";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
type AvatarColor = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";

interface AvatarBaseProps {
  size?: AvatarSize;
  className?: string;
}

interface AvatarImageProps extends AvatarBaseProps {
  type: "image";
  src: string;
  alt?: string;
}

interface AvatarTextProps extends AvatarBaseProps {
  type: "text";
  initials: string;
  bg?: AvatarColor;
  textColor?: string; // ex: "text-white", "text-dark"
}

type AvatarProps = AvatarImageProps | AvatarTextProps;

/** Tailles rendues par les classes `avatar-*` du thème (px). */
const AVATAR_PX: Record<AvatarSize, number> = { xs: 20, sm: 24, md: 36, lg: 48, xl: 72, xxl: 84 };

export default function Avatar(props: AvatarProps) {
  const { size = "md", className = "" } = props;

  if (props.type === "image") {
    return (
      <div className={`avatar-item ${className}`.trim()}>
        <Image
          className={`img-fluid avatar-${size}`}
          src={props.src}
          width={AVATAR_PX[size]}
          height={AVATAR_PX[size]}
          alt={props.alt ?? "avatar image"}
        />
      </div>
    );
  }

  const { initials, bg = "primary", textColor = "text-white" } = props;

  return (
    <div
      className={`avatar-item avatar-${size} avatar-title ${textColor} bg-${bg} ${className}`.trim()}
    >
      {initials}
    </div>
  );
}