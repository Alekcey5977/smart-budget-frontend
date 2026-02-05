import { Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const SIZE_MAP = {
  sm: { avatar: 44, icon: 22 },
  md: { avatar: 64, icon: 32 },
  xl: { avatar: 96, icon: 48 },
};

export default function AppAvatar({ size = "md", children, sx, ...props }) {
  const cfg = SIZE_MAP[size] ?? SIZE_MAP.md;

  return (
    <Avatar
      sx={{
        width: cfg.avatar,
        height: cfg.avatar,
        bgcolor: "rgba(0,0,0,0.18)",
        ...sx,
      }}
      {...props}
    >
      {children ?? <PersonIcon sx={{ fontSize: cfg.icon }} />}
    </Avatar>
  );
}
