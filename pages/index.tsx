import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
      
          <h1 className={styles.title}>Digital Wallet</h1>
          <p className={styles.description}>
            Digital Wallet is a web application that allows you to manage your
            money and transactions.
          </p>

          <div className={styles.grid}>
            <Link href="#" className={styles.card}>
              <h3>Login &rarr;</h3>
              <p>Soon</p>
            </Link>

            <Link href="#" className={styles.card}>
              <h3>Register &rarr;</h3>
              <p>Soon</p>
            </Link>

            <Link href="/dashboard" className={styles.card}>
              <h3>Dashboard &rarr;</h3>
              <p>View your wallets</p>
            </Link>
          </div>
        
      </main>
    </>
  );
}
