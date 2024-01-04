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

const inter = Inter({ subsets: ["latin"] });

interface Props {
  currencyAndCoin: Array<any>;
  owner: string;
}

const NewWalletPage: NextPage<Props> = ({ currencyAndCoin, owner }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();

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
      number_wallet: data.walletId,
      owner: data.owner,
      currency: data.divisa,
      coin: crypto,
    };

    try {
      setLoading(true);
      const response = await walletApi.post(
        `${process.env.NEXT_PUBLIC_URL_BASE_API}/api/wallet`,
        payload
      );
      if (response) {
        setLoading(false);
      }
      return router.push("/dashboard");
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert("La wallet ya existe, o hubo un error al crearla");
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
          Crear nueva wallet
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
                fullWidth
                sx={{ mb: 1, backgroundColor: "white", width: 300, mt: 2 }}
                {...register("walletId", {
                  required: "Este campo es requerido",
                  minLength: { value: 2, message: "Mínimo 2 caracteres" },
                })}
                error={!!errors.walletId}
                helperText={
                  errors.walletId?.message
                    ? errors.walletId.message.toString()
                    : ""
                }
              />

              {/* DIVISA */}
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Divisa</InputLabel>
                <Select
                  labelId="divisa"
                  id="divisa"
                  value={currency}
                  defaultValue="USD"
                  label="Divisa"
                  sx={{ mb: 1, backgroundColor: "white", width: 300, mt: 2 }}
                  required
                  {...register("divisa", {
                    required: "Este campo es requerido",
                  })}
                  error={!!errors.divisa}
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

              <TextField
                label="owner"
                variant="filled"
                value={owner}
                fullWidth
                sx={{ mb: 1, backgroundColor: "white", width: 300, mt: 2 }}
                {...register("owner", {
                  required: "Este campo es requerido",
                })}
                InputProps={{ readOnly: true }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ width: 300, mt: 2, mb: 2 }}
              >
                Crear wallet
              </Button>
            </Box>
          </form>
        )}
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const currency = walletApi.get("/currency");
  const coin = walletApi.get("/coin");

  const owner = req.cookies.owner;

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
        owner,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {},
    };
  }
};

export default NewWalletPage;
