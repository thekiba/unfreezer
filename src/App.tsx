import { styled } from "@mui/material";
import { Navbar } from "components/Navbar";
import {
  useConnectionEvenSubscription,
  useEmbededWallet,
  useRestoreConnection,
} from "connection";
import { useEffect } from "react";
import { useGetClientsOnLoad } from "store";
import { StyledGrid } from "styles";
import { Unfreeze } from "Unfreeze";

function App() {
  const restoreConnection = useRestoreConnection();
  const getClients = useGetClientsOnLoad();
  const handleEmbededWallet = useEmbededWallet();
  useConnectionEvenSubscription();

  useEffect(() => {
    restoreConnection();
    getClients();
    handleEmbededWallet();
  }, []);
  return (
    <div>
      <Navbar />
      <StyledApp>
        <Unfreeze />
      </StyledApp>
    </div>
  );
}

export default App;

const StyledApp = styled(StyledGrid)({
  paddingTop: 100,
});
