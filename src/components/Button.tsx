import { CircularProgress, Fade, styled } from "@mui/material";
import { Box } from "@mui/system";
import React, { CSSProperties } from "react";
import { ReactNode } from "react";
import { StyledFlexRow } from "../styles";

interface Props {
  children: ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
  transparent?: boolean;
}

function Button({
  children,
  disabled = false,
  isLoading,
  className = "",
  onClick,
  style = {},
  transparent,
}: Props) {
  return (
    <StyledContainer
      style={style}
      onClick={onClick}
      disabled={disabled || !!isLoading}
      className={className}
      transparent={transparent}
    >
      <Fade in={isLoading}>
        <StyledLoader>
          <CircularProgress
            className="loader"
            style={{ width: 30, height: 30 }}
          />
        </StyledLoader>
      </Fade>
      <Fade in={!isLoading}>
        <StyledChildren className="children">{children}</StyledChildren>
      </Fade>
    </StyledContainer>
  );
}

export { Button };

const StyledLoader = styled(Box)({
  position: "absolute",
  left: "50%",
  top: "55%",
  transform: "translate(-50%, -50%)",
});

const StyledChildren = styled(StyledFlexRow)({
  gap: 5,
});

const StyledContainer = styled("button")<{
  disabled: boolean;
  transparent?: boolean;
}>(({ theme, disabled, transparent }) => ({
  width: "fit-content",
  height: transparent ? "unset" : 44,
  borderRadius: 40,
  opacity: disabled ? 0.7 : 1,
  pointerEvents: disabled ? "none" : "all",
  background: transparent ? "transparent" : theme.palette.primary.main,
  border: "unset",
  cursor: "pointer",
  position: "relative",
  padding: transparent ? 0 : "0px 16px",
  transition: "0.3s all",
  "*": {
    color: transparent ? theme.palette.primary.main : "white",
    fontSize: 16,
    fontWeight: 700,
    fontFamily: theme.typography.fontFamily,
  },
}));
