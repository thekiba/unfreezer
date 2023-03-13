import { styled } from "@mui/material";
import { Box } from "@mui/system";
import { CSSProperties } from "react";
import { theme } from "./theme";

export const StyledFlexRow = styled(Box)(
  ({
    justifyContent = "center",
    alignItems = "center",
    gap = 10,
  }: {
    justifyContent?: "flex-start" | "center" | "flex-end" | "space-between";
    alignItems?: "flex-start" | "center" | "flex-end" | "space-between";
    gap?: number;
  }) => ({
    display: "flex",
    alignItems: alignItems,
    justifyContent,
    gap,
    width: "100%",
  })
);
export const StyledFlexColumn = styled(Box)(
  ({
    justifyContent = "center",
    alignItems = "center",
    gap = 10,
  }: {
    justifyContent?: "flex-start" | "center" | "flex-end" | "space-between";
    alignItems?: "flex-start" | "center" | "flex-end" | "space-between";
    gap?: number;
  }) => ({
    display: "flex",
    alignItems,
    justifyContent,
    flexDirection: "column",
    width: "100%",
    gap,
  })
);

export const globalStyles = {
  body: {
    background: "#F8F9FB",
  },
  html: {
    scrollBehavior: "smooth" as const,
  },
  ".snackbar-success": {
    backgroundColor: `${theme.palette.primary.main}!important`,
  },
  ".MuiTooltip-arrow": {
    color: `#EEEEEE!important`,
  },
  ".MuiTooltip-tooltip": {
    background: `#EEEEEE!important`,
  },
};

export const textOverflow: CSSProperties = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

export const StyledGrid = styled(StyledFlexColumn)({
  gap: 0,
  width: "calc(100% - 30px)",
  maxWidth: 950,
  marginLeft: "auto",
  marginRight: "auto",
});
