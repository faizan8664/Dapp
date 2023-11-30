import { useState, useEffect } from "react";
import { ethers } from "ethers";
import QRCode from "qrcode.react";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState([]);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    try {
      const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
      handleAccount(accounts);

      // once the wallet is set, we can get a reference to our deployed contract
      getATMContract();
    } catch (error) {
      console.error("Error connecting account:", error);
    }
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      const currentBalance = await atm.getBalance();
      setBalance(currentBalance.toNumber());
    }
  };

  const deposit = async () => {
    if (atm) {
      try {
        const tx = await atm.deposit(1);
        await tx.wait();
        getBalance();
        generateTransactionHistory("Deposit", "Success");
      } catch (error) {
        console.error("Error depositing:", error);
      }
    }
  };

  const withdraw = async () => {
    if (atm) {
      try {
        const tx = await atm.withdraw(1);
        await tx.wait();
        getBalance();
        generateTransactionHistory("Withdraw", "Success");
      } catch (error) {
        console.error("Error withdrawing:", error);
      }
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleHistoryModal = () => {
    setShowHistoryModal(!showHistoryModal);
  };

  const generateTransactionHistory = (type, status) => {
    const newTransaction = {
      id: transactionHistory.length + 1,
      type,
      status,
      amount: 1,
      timestamp: new Date().toLocaleString(),
    };

    setTransactionHistory((prevHistory) => [...prevHistory, newTransaction]);
  };

  const getContainerStyle = () => {
    return {
      textAlign: "center",
      backgroundColor: isDarkMode ? "#333" : "#fff",
      color: isDarkMode ? "#fff" : "#333",
    };
  };

  const initUser = () => {
    // Check to see if the user has MetaMask
    if (!ethWallet) {
      return <p>Please install MetaMask to use this ATM.</p>;
    }

    // Check to see if the user is connected. If not, connect to their account
    if (!account) {
      return (
        <div>
          <p>Your Account: Not Connected</p>
          <button onClick={connectAccount}>Connect Metamask Wallet</button>
        </div>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div style={getContainerStyle()}>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <button onClick={deposit}>Deposit 1 ETH</button>
        <button onClick={withdraw}>Withdraw 1 ETH</button>
        <button onClick={toggleHistoryModal}>View Transaction History</button>
      </div>
    );
  };

  const TransactionHistoryModal = () => {
    return (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={toggleHistoryModal}>
            &times;
          </span>
          <h2>Transaction History</h2>
          {transactionHistory.map((transaction) => (
            <div key={transaction.id} className="transaction-item">
              <p>Serial: {transaction.id}</p>
              <p>Type: {transaction.type}</p>
              <p>Status: {transaction.status}</p>
              <p>Amount: {transaction.amount} ETH</p>
              <p>Timestamp: {transaction.timestamp}</p>
              <div className="qr-code-section">
                <p>You can also scan the QR code to see details.</p>
                <QRCode value={JSON.stringify(transaction)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container" style={getContainerStyle()}>
      <header>
        <h1>Digital ATM!</h1>
      </header>
      {initUser()}
      <button onClick={toggleDarkMode}>Toggle {isDarkMode ? "Light" : "Dark"} Mode</button>
      {showHistoryModal && <TransactionHistoryModal />}
      <style jsx>{`
        // ... (existing styles)

        .qr-code-section {
          margin-top: 10px;
        }

        .modal {
          display: ${showHistoryModal ? "block" : "none"};
          position: fixed;
          z-index: 1;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
          background-color: rgba(0, 0, 0, 0.4);
        }

        .modal-content {
          background-color: #fefefe;
          margin: 15% auto;
          padding: 20px;
          border: 1px solid #888;
          width: 80%;
          max-width: 600px;
        }

        .close {
          color: #aaa;
          float: right;
          font-size: 28px;
          font-weight: bold;
        }

        .close:hover,
        .close:focus {
          color: black;
          text-decoration: none;
          cursor: pointer;
        }

        .transaction-item {
          margin-bottom: 20px;
          border: 1px solid #ddd;
          padding: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      `}</style>
    </main>
  );
}
