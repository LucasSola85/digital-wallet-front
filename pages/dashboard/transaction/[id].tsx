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
import { AxiosError } from "axios";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

interface Props {
  wallet: string;
}

const NewTransactionPage: NextPage<Props> = ({ wallet }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const [credito, setCredito] = useState(true);

  const [loading, setLoading] = useState(false);

  const handleChangeOperacion = (event: SelectChangeEvent) => {
    setCredito(event.target.value === "credito" ? true : false);
  };

  const onHandlerSubmit = async (data: any) => {
    const payload = {
      walletId: wallet,
      amount: Number(data.monto),
      isCredit: credito,
    };

    setLoading(true);

    try {
      const response = await walletApi.post(
        `${process.env.NEXT_PUBLIC_URL_BASE_API}/api/transaction`,
        payload
      );
      if (response) setLoading(false);
      return router.push("/dashboard");
    } catch (error: any) {
      alert(error.response.data.message);
      setLoading(false);
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
          Crear nueva transacción
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
                value={wallet}
                fullWidth
                sx={{ mb: 1, backgroundColor: "white", width: 300, mt: 2 }}
                {...register("walletId", {
                  required: "Este campo es requerido",
                  minLength: { value: 2, message: "Mínimo 2 caracteres" },
                })}
                InputProps={{ readOnly: true }}
              />

              {/* DIVISA */}
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Divisa</InputLabel>
                <Select
                  labelId="operacion"
                  id="operacion"
                  value={credito ? "credito" : "debito"}
                  // defaultValue="USD"
                  label="Operacion"
                  sx={{ mb: 1, backgroundColor: "white", width: 300, mt: 2 }}
                  required
                  {...register("operacion", {
                    required: "Este campo es requerido",
                  })}
                  error={!!errors.divisa}
                  onChange={handleChangeOperacion}
                >
                  <MenuItem value="credito">Credito</MenuItem>
                  <MenuItem value="debito">Debito</MenuItem>
                </Select>
              </FormControl>

              {/* COIN = Actualmente hay una sola, por tanto la relacionamos */}
              <TextField
                label="Monto"
                variant="filled"
                fullWidth
                type="number"
                InputProps={{ inputProps: { min: 1, max: 2000 } }}
                sx={{ mb: 1, backgroundColor: "white", width: 300, mt: 2 }}
                {...register("monto", {
                  required: "Este campo es requerido",
                })}
              />

              <Button
                type="submit"
                variant="contained"
                sx={{ width: 300, mt: 2, mb: 2 }}
              >
                Crear transacción
              </Button>
            </Box>
          </form>
        )}
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const wallet = req.cookies.wtransaction;
  return {
    props: {
      wallet,
    },
  };
};

export default NewTransactionPage;
