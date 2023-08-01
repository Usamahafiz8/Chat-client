import { IconButton, Typography } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";

interface HeaderProps {
  onRefreshClick?: () => void; // Define the function prop
}

const Header = ({ onRefreshClick }: HeaderProps) => {
  return (
    <div
      style={{
        height: "50px",
        borderBottom: "1px solid #E5E7EB",
        borderRadius: "8px 8px 0 0",
        backgroundColor: "#EC5C2A",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px",
        flexDirection: "row",
      }}
    >
      <Typography
        style={{ fontWeight: 600, color: "#ffffff", fontSize: "16px" }}
      >
        Chat with us{" "}
        <IconButton onClick={onRefreshClick}>
          <RefreshIcon style={{ color: "white" }} />
        </IconButton>
      </Typography>
      <div>
        <IconButton style={{ color: "#ffffff" }}>
          <RemoveOutlinedIcon />
        </IconButton>
        <IconButton style={{ color: "#ffffff" }}>
          <CloseOutlinedIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default Header;
