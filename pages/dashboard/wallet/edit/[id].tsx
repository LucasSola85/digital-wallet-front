import { GetServerSideProps, NextPage } from "next";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { walletApi } from "@/api";
import { FullScreenLoading } from "@/components/ui/FullScreenLoading";
import { useRouter } from "next/router";
import Link from "next/link";
import { IWallet } from "@/interfaces/wallet.interface";

const inter = Inter({ subsets: ["latin"] });

interface Props {
  currencyAndCoin: Array<any>;
  wallet: IWallet;
}

const EditWalletPage: NextPage<Props> = ({ currencyAndCoin, wallet }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const [walletInfo, setWalletInfo] = useState(wallet);
  const [currency, setCurrency] = useState("");
  const [{ name, exchange, coin: crypto }, setCoin] = useState<{
    name: string;
    exchange: string;
    coin: string;
  }>({} as { name: string; exchange: string; coin: string });
  const [loading, setLoading] = useState(false);

  const handleChangeDivisa = (event: SelectChangeEvent) => {
    setCurrency(event.target.value as string);

    // buscamos la moneda que se selecciono en el arreglo currencyAndCoin
    const coin = currencyAndCoin.find(
      (item) => item.currency === event.target.value
    );
    setCoin({
      name: coin.name,
      exchange: coin.exchange,
      coin: coin._id,
    });
  };

  const onHandlerSubmit = async (data: any) => {
    const payload = {
      coin: crypto,
      currency: data.currency,
    };

    console.log(payload)

    try {
      setLoading(true);
      const response = await walletApi.patch(
        `${process.env.NEXT_PUBLIC_URL_BASE_API}/api/wallet/${walletInfo._id}`,
        payload
      );
      if (response) {
        setLoading(false);
      }
      return router.push("/dashboard");
    } catch (error: any) {
      console.log(error);
      setLoading(false);
      alert(error.response.data.message);
    }
  };

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
      <main className={`${styles.main} ${inter.className}`}>
        <Typography variant="h4" component="h1" sx={{ textAlign: "center" }}>
          Editar wallet
        </Typography>

        {loading ? (
          <FullScreenLoading />
        ) : (
          <form onSubmit={handleSubmit(onHandlerSubmit)}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TextField
                label="Wallet ID"
                variant="filled"
                value={walletInfo._id}
                fullWidth
                sx={{ mb: 1, backgroundColor: "white", width: 300, mt: 2 }}
                InputProps={{ readOnly: true }}
                {...register("walletId", {
                  required: "Este campo es requerido",
                })}
                error={!!errors.walletId}
              />

              {/* DIVISA */}
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Divisa</InputLabel>
                <Select
                  labelId="currency"
                  id="currency"
                  value={currency}
                  defaultValue="USD"
                  label="currency"
                  sx={{ mb: 1, backgroundColor: "white", width: 300, mt: 2 }}
                  required
                  {...register("currency", {
                    required: "Este campo es requerido",
                  })}
                  error={!!errors.currency}
                  onChange={handleChangeDivisa}
                >
                  {currencyAndCoin.map((item) => {
                    if (Object.keys(item).includes("symbol")) {
                      return (
                        <MenuItem key={item._id} value={item._id}>
                          {item.currency}
                        </MenuItem>
                      );
                    }
                  })}
                </Select>
              </FormControl>

              {/* COIN = Actualmente hay una sola, por tanto la relacionamos */}
              <TextField
                label="Coin"
                variant="filled"
                fullWidth
                sx={{ mb: 1, backgroundColor: "white", width: 300, mt: 2 }}
                {...register("coin", {
                  required: "Este campo es requerido",
                })}
                value={name ? `Crypto: ` + name + ` - Ξ:` + exchange : ""}
                InputProps={{ readOnly: true }}
              />

              <Button
                type="submit"
                variant="contained"
                sx={{ width: 300, mt: 2, mb: 2 }}
              >
                Editar wallet
              </Button>
            </Box>
          </form>
        )}
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const currency = walletApi.get("/currency");
  const coin = walletApi.get("/coin");

  const wallet = req.cookies.wedit;

  if (!wallet) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  try {
    const response = await Promise.all([currency, coin]).then((values) => {
      return values.map((value) => {
        return value.data;
      });
    });

    const currencyAndCoin = response.flat();

    return {
      props: {
        currencyAndCoin,
        wallet: JSON.parse(wallet),
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {},
    };
  }
};

export default EditWalletPage;
