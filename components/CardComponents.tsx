import { IWallet } from "@/interfaces/wallet.interface";
import { FC, useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import { Box } from "@mui/material";
import Cookies from "js-cookie";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import moment from "moment";
import { useRouter } from "next/router";

export const WalletCard: FC<IWallet> = (wallet) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // verificamos si existe la cookie
    if (Cookies.get("favorites")) {
      // si existe la cookie, la obtenemos
      const favorites = Cookies.get("favorites");

      if (!favorites) Cookies.set("favorites", JSON.stringify([]));

      // la parseamos a un array
      const favoritesArray = JSON.parse(favorites!);

      // verificamos si la wallet existe en el array
      const walletExists = favoritesArray.find(
        (favorite: string) => favorite === wallet._id
      );

      // si existe la wallet en el array, la marcamos como favorita
      if (walletExists) {
        setIsFavorite(true);
      }
    }
  }, [ wallet._id ]);

  useEffect(() => {
    // recorremos el transactions y obtenemos el created_at de cada uno
    const transactions = wallet.transactions.map((transaction) => {
      return transaction.createdAt;
    });

    // ordenamos el array de menor a mayor
    transactions.sort((a, b) => {
      return moment(a).diff(moment(b));
    });

    // obtenemos la ultima fecha
    const lastDate = transactions[transactions.length - 1];

    // obtenemos la fecha actual
    const currentDate = moment();

    // obtenemos la diferencia entre las dos fechas
    const difference = currentDate.diff(lastDate, "years");


    // si la diferencia es mayor a 1, deshabilitamos la wallet
    if (difference === 1) {
      setIsDisabled(true);
    }
  }, [ wallet.transactions ]);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);

    // verificamos si existe la cookie
    if (Cookies.get("favorites")) {
      // si existe la cookie, la obtenemos
      const favorites = Cookies.get("favorites");

      // la parseamos a un array
      const favoritesArray = JSON.parse(favorites!);

      // verificamos si la wallet existe en el array
      const walletExists = favoritesArray.find(
        (favorite: string) => favorite === wallet._id
      );

      // si existe la wallet en el array, la eliminamos
      if (walletExists) {
        const newFavoritesArray = favoritesArray.filter(
          (favorite: string) => favorite !== wallet._id
        );

        Cookies.set("favorites", JSON.stringify(newFavoritesArray));
      } else {
        // si no existe la wallet en el array, la agregamos
        favoritesArray.push(wallet._id);

        Cookies.set("favorites", JSON.stringify(favoritesArray));
      }
    } else {
      // si no existe la cookie, la creamos
      Cookies.set("favorites", JSON.stringify([wallet._id]));
    }
  };

  const handlerTransactions = () => {
    if (isDisabled) return;

    Cookies.set("wtransaction", wallet._id);
    router.push(`/dashboard/transaction/${wallet._id}`);
  };

  const handlerEdit = () => {
    Cookies.set("wedit", JSON.stringify(wallet));
    router.push(`/dashboard/wallet/edit/${wallet._id}`);
  }

  return (
    <>
      <Card
        sx={{
          maxWidth: 345,
          margin: "1rem",
          boxShadow: "0 0 10px rgba(0,0,0,0.5)",
          opacity: isDisabled ? 0.5 : 1,
        }}
      >
        <CardMedia
          component="img"
          height="160"
          image="images/wallet_img.png"
          alt="card image"
        />

        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          m: 2,
        
        }}>
          <ModeEditIcon
            sx={{cursor: !isDisabled ? 'pointer' : 'not-allowed'}}
            onClick={ handlerEdit }
          />
        </Box>

        <CardContent>
          {/* nombre de la billetera */}
          <Typography variant="h5" component="div">
            {wallet.number_wallet.toUpperCase()}
          </Typography>
          <Typography gutterBottom variant="body1" component="div">
            {wallet.currency.currency}: {wallet.balance}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {wallet.coin.name}: {wallet.balance_crypto}
          </Typography>

          {/* identificacdor de la wallet */}
          <Typography variant="body2" color="text.secondary">
            Identificador: {wallet._id}
          </Typography>
        </CardContent>
        <CardActions>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Link href={isDisabled ? `#` : `/dashboard/wallet/${wallet._id}`}>
              <Button disabled={isDisabled} size="small">
                {isDisabled ? "Vencida" : "Ver más"}
              </Button>
            </Link>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <AccountBalanceWalletIcon
                sx={{
                  color: "primary.main",
                  fontSize: 30,
                  cursor: "pointer",
                }}
                onClick={handlerTransactions}
              />
              <Typography variant="caption" color="text.secondary">
                Transacción
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "row" }}>
              {/* si es favorito una estrella sino es la otra */}
              {isFavorite ? (
                <StarIcon onClick={handleFavorite} />
              ) : (
                <StarBorderIcon onClick={handleFavorite} />
              )}
            </Box>
          </Box>
        </CardActions>
      </Card>
    </>
  );
};
