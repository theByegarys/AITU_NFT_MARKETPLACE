import Image from "next/image";
import Header from "./components/header/Header";
import styles from "./page.module.css";
import Footer from "./components/footer/Footer";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.hero}>
        <div>
          <h1 className={styles.heading}>
            Where Art Meets Innovation, Step into AITU NFT Marketplace!
          </h1>
          <p className={styles.description}>
            Welcome to the AITU NFT Marketplace where you can find exclusive NFT's with variety of choices.
            Explore the limitless NFT's in our website.
          </p>
          <div className={styles.btns}>
            <Link
              href="/marketplace"
              className={`${styles.btn} ${styles.buyBtn}`}
            >
              Buy Now!
            </Link>
            <Link href="/sellNFT" className={styles.btn}>
              List Now!
            </Link>
          </div>
        </div>
        <Image src="/pic1.png" alt="NFTs" width={1075} height={650} layout="responsive" />
      </div>
      <Footer />
    </div>
  );
}
