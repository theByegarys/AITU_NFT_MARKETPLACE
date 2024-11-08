"use client";
import { WalletContext } from "@/context/wallet";
import { useContext, useEffect, useState } from "react";
import { ethers, formatUnits } from "ethers"; // Updated import for ethers@6
import MarketplaceJson from "../marketplace.json";
import styles from "./profile.module.css";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import axios from "axios";
import NFTTile from "../components/nftCard/NFTCard";

export default function Profile() {
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState("0");
  const [balance, setBalance] = useState(null); // State for balance
  const { isConnected, userAddress, signer } = useContext(WalletContext);

  async function getNFTitems() {
    let sumPrice = 0;
    const itemsArray = [];
    if (!signer) return;
    const contract = new ethers.Contract(
      MarketplaceJson.address,
      MarketplaceJson.abi,
      signer
    );

    const transaction = await contract.getMyNFTs();

    for (const i of transaction) {
      const tokenId = parseInt(i.tokenId);
      const tokenURI = await contract.tokenURI(tokenId);
      const meta = (await axios.get(tokenURI)).data;
      const price = formatUnits(i.price, "ether"); // Format to readable ETH

      const item = {
        price,
        tokenId,
        seller: i.seller,
        owner: i.owner,
        image: meta.image,
        name: meta.name,
        description: meta.description,
      };

      itemsArray.push(item);
      sumPrice += Number(price);
    }
    return { itemsArray, sumPrice };
  }

// Fetch Sepolia balance
async function getWalletBalance() {
  if (!userAddress || !signer?.provider) return;
  try {
    const balanceBigNumber = await signer.provider.getBalance(userAddress);
    const balanceInSepolia = formatUnits(balanceBigNumber, "ether");
    const formattedBalance = Number(balanceInSepolia).toFixed(6); // Limit to 6 digits
    setBalance(formattedBalance); // Set formatted Sepolia ETH balance
  } catch (error) {
    console.error("Error fetching Sepolia balance:", error);
  }
}
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { itemsArray, sumPrice } = await getNFTitems();
        setItems(itemsArray);
        setTotalPrice(sumPrice);
      } catch (error) {
        console.error("Error fetching NFT items:", error);
      }
    };

    if (isConnected) {
      fetchData();
      getWalletBalance(); // Fetch wallet balance when connected
    }
  }, [isConnected]);

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.innerContainer}>
        <div className={styles.content}>
          {isConnected ? (
            <>
              <div className={styles.userInfo}>
                <span className={styles.label}>Wallet Address:</span>
                <span className={styles.address}>{userAddress}</span>
              </div>
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.label}>Number of NFTs:</span>
                  <span className={styles.value}>{items?.length}</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.label}>Total Value:</span>
                  <span className={styles.value}>{totalPrice} ETH</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.label}>Your Balance:</span>
                  <span className={styles.value}>{balance} ETH</span> {/* Display balance */}
                </div>
              </div>
              <div className={styles.nftSection}>
                <h2 className={styles.heading}>Your NFTs</h2>
                {items?.length > 0 ? (
                  <div className={styles.nftGrid}>
                    {items?.map((value, index) => (
                      <NFTTile item={value} key={index} />
                    ))}
                  </div>
                ) : (
                  <div className={styles.noNFT}>You don't have any NFT...</div>
                )}
              </div>
            </>
          ) : (
            <div className={styles.notConnected}>You are not connected...</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
