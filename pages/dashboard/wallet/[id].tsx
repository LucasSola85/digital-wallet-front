import { walletApi } from "@/api";
import { IWallet } from "@/interfaces/wallet.interface";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import { GetServerSideProps, NextPage } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

interface IWalletPageProps {
  walletInfo: IWallet;
}

function createData(
  ID: string,
  Monto: number,
  Credito: boolean,
  Saldo_Previo: number,
  Saldo_Nuevo: number
) {
  return { ID, Monto, Credito, Saldo_Previo, Saldo_Nuevo };
}
const WalletPage: NextPage<IWalletPageProps> = ({ walletInfo }) => {
  const rows = walletInfo.transactions.map((transaction) => {
    return createData(
      transaction._id,
      transaction.amount,
      transaction.isCredit,
      transaction.prev_balance,
      transaction.new_balance
    );
  });

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          m: "1rem",
        }}
      >
        <Link href={`/dashboard`}>
          <Button size="small">Regresar</Button>
        </Link>
      </Box>
      <main className={`${inter.className}`}>
        <Typography variant="h5" component="div" sx={{ padding: "3rem" }}>
          {walletInfo.number_wallet.toUpperCase()} - Transacciones
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            m: "1rem",
          }}
        >
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align="right">Monto</TableCell>
                  <TableCell align="right">Credito</TableCell>
                  <TableCell align="right">Saldo Previo</TableCell>
                  <TableCell align="right">Saldo Nuevo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.ID}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.ID}
                    </TableCell>
                    <TableCell align="right">{row.Monto}</TableCell>
                    <TableCell align="right">
                      {row.Credito ? "Si" : "No"}
                    </TableCell>
                    <TableCell align="right">{row.Saldo_Previo}</TableCell>
                    <TableCell align="right">{row.Saldo_Nuevo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Typography variant="h5" component="div" sx={{ padding: "3rem" }}>
          Otros Datos
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            m: "1rem",
          }}
        >
          <Card sx={{ mr: 3, width: 300 }}>
            <CardContent>
              <Typography variant="h4" component="div">
                Propietario
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="h6" component="div">
                {walletInfo.owner.name} {walletInfo.owner.lastname}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {walletInfo.owner.email}
              </Typography>
            </CardContent>
          </Card>
          <Card
            sx={{
              mr: 3,
              width: 300,
            }}
          >
            <CardContent>
              <Typography variant="h4" component="div">
                Moneda
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="h6" component="div">
                Tipo: {walletInfo.currency.currency}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Simbolo: {walletInfo.currency.symbol}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Monto: {walletInfo.balance}
                </Typography>
              </Box>
            </CardContent>
          </Card>
          <Card
            sx={{
              width: 400,
            }}
          >
            <CardContent>
              <Typography variant="h4" component="div">
                Crypto Moneda
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="h6" component="div">
                Tipo: {walletInfo.coin.name}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Tipo Cambio: {walletInfo.coin.exchange}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Monto en Crypto: {walletInfo.balance_crypto}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { id } = query;

  const { data: walletInfo } = await walletApi.get<IWallet>(`/wallet/${id}`);

  if (!walletInfo) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      walletInfo,
    },
  };
};

export default WalletPage;
