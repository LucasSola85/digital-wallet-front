import { walletApi } from "@/api";
import { IWallet } from "@/interfaces/wallet.interface";
import { AppBar, Box, Button, Card, CardActionArea } from "@mui/material";
import { GetServerSideProps, NextPage } from "next";
import styles from "@/styles/Home.module.css";
import { Inter } from "next/font/google";
import { WalletCard } from "@/components/CardComponents";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Cookies from "js-cookie";

const inter = Inter({ subsets: ["latin"] });

interface IDashboardPageProps {
  userWallets: IWallet[];
}

const DashboardPage: NextPage<IDashboardPageProps> = ({ userWallets }) => {

  const route = useRouter()

  const handleNewWallet = ()=>{
    route.push('/dashboard/new-wallet')
  }

  useEffect(() => {
    Cookies.set('owner', userWallets[0].owner._id)
  }, [userWallets])

  return (
    <>
      <main className={`${styles.main} ${inter.className}`}>
        <AppBar
          position="static"
          color="transparent"
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem",
          }}
        >
          <h1>Bienvenido</h1>
          <Box>
            <p>
              <strong>Email:</strong> {userWallets[0].owner.email}
            </p>
            <p>
              <strong>Nombre:</strong> {userWallets[0].owner.name} {userWallets[0].owner.lastname}
            </p>
          </Box>
        </AppBar>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem",
          }}
        >
          <span>
            Hola <strong>{userWallets[0].owner.name} {userWallets[0].owner.lastname}</strong> estas son tus
            Wallets actuales:
          </span>
        </Box>

        {/* agregar wallets */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem",
          }}
        >
         <Button variant="contained" color="primary" onClick={handleNewWallet}>
          Agregar Wallet
        </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "3rem",
          }}
        >
          {userWallets.map((wallet, i) => (
            <WalletCard key={i} {...wallet} />
          ))}
        </Box>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  
  const user = await walletApi.get("/wallet/all/65953994b831b369e27e9171");

  if (!user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      userWallets: user.data,
    },
  };
};

export default DashboardPage;
