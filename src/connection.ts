import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { isWalletInfoInjected, WalletInfoInjected } from "@tonconnect/sdk";
import {
  ChromeExtensionWalletProvider,
  TonhubProvider,
  TonWalletProvider,
} from "@ton-defi.org/ton-connection";
import { Address } from "ton";
import { isMobile } from "react-device-detect";
import { LOCAL_STORAGE_PROVIDER, TX_FEE } from "config";
import { WalletProvider, Provider } from "types";
import _ from "lodash";
import { useConnectionStore } from "store";

export const useWallets = () => {
  const connector = useConnectionStore().connectorTC;

  return useQuery(
    [],
    async () => {
      return connector.getWallets();
    },
    {
      staleTime: Infinity,
    }
  );
};

export const useRestoreConnection = () => {
  const connector = useConnectionStore().connectorTC;

  return () => connector.restoreConnection();
};

export const useConnectionEvenSubscription = () => {
  const { setAddress } = useConnectionStore();
  const connector = useConnectionStore().connectorTC;

  useEffect(() => {
    connector.onStatusChange((walletInfo) => {
      const address = walletInfo?.account.address;
      const friendlyAddress = address
        ? Address.parse(address).toFriendly()
        : "";
      setAddress(friendlyAddress);
    });
  }, []);
};

export const useEmbededWallet = () => {
  const wallets = useWallets().data;
  const connector = useConnectionStore().connectorTC;

  return () => {
    const embeddedWallet = wallets?.find(
      (wallet) => isWalletInfoInjected(wallet) && wallet.embedded
    ) as WalletInfoInjected;

    if (embeddedWallet) {
      connector.connect({ jsBridgeKey: embeddedWallet.jsBridgeKey });
    }
  };
};

export const useOnWalletSelected = () => {
  const [session, setSession] = useState("");
  const { setTonConnectionProvider, setAddress } = useConnectionStore();
  const [walletInfo, setWalletInfo] = useState<
    { name: string; icon: string } | undefined
  >();
  const [showQR, setShowQR] = useState(false);

  const reset = () => {
    setSession("");
    setWalletInfo(undefined);
  };

  const connector = useConnectionStore().connectorTC;

  const onSessionLinkReady = (link: string) => {
    if (isMobile) {
      (window as any).location = link;
    } else {
      setSession(link);
    }
  };

  const onShowQr = () => {
    if (!isMobile) {
      setShowQR(true);
    }
  };

  const selectWalletTC = (wallet: any) => {
    setWalletInfo({ name: wallet.name, icon: wallet.imageUrl });
    try {
      try {
        const walletConnectionSource = {
          jsBridgeKey: wallet.jsBridgeKey,
        };
        connector.connect(walletConnectionSource);
      } catch (error) {
        const walletConnectionSource = {
          universalLink: wallet.universalLink,
          bridgeUrl: wallet.bridgeUrl,
        };

        const _session = connector.connect(walletConnectionSource);
        onSessionLinkReady(_session);
        onShowQr();
      }
    } catch (error) {
      if (isMobile) {
        (window as any).location = wallet.aboutUrl;
      } else {
        window.open(wallet.aboutUrl);
      }
    }
  };

  const selectWallet = async (wallet: WalletProvider) => {
    let tonWalletProvider: TonWalletProvider | undefined;
    setWalletInfo({ name: wallet.title, icon: wallet.icon });

    if (wallet.type === Provider.EXTENSION) {
      tonWalletProvider = new ChromeExtensionWalletProvider();
    } else if (wallet.type === Provider.TONHUB) {
      tonWalletProvider = new TonhubProvider({
        onSessionLinkReady,
        persistenceProvider: window.localStorage,
      });

      onShowQr();
    }

    if (!tonWalletProvider) {
      return;
    }
    setTonConnectionProvider(tonWalletProvider);
    const _wallet = await tonWalletProvider.connect();
    setAddress(_wallet.address);
    localStorage.setItem(LOCAL_STORAGE_PROVIDER, wallet.type);
  };

  return {
    selectWalletTC,
    session,
    selectWallet,
    reset,
    walletInfo,
    showQR,
    hideQR: () => setShowQR(false),
  };
};

export const useResetConnection = () => {
  const reset = useConnectionStore().reset;
  const connection = useConnectionStore().connection;
  const connector = useConnectionStore().connectorTC;
  return () => {
    if (connection) connection.disconnect();
    localStorage.removeItem(LOCAL_STORAGE_PROVIDER);
    if (connector.connected) {
      connector.disconnect();
    }
    reset();
  };
};
