import { ethers } from "ethers";
import abi from './abi.json'
import { networks } from "./network";
import{useState, useEffect} from 'react'



const Main = () => {
    
  const [currentAccount, setCurrentAccount] = useState('');
  const [network, setNetwork] = useState('');
  const blockAddress = '0x477F7518688fE2D3A21Fc20a1DEA15FCD64FfEbf'
 

  const cashout = async() =>{
    try{
      const {ethereum} = window

      if(window.ethereum){
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner()
          const contract = new ethers.Contract(blockAddress, abi.abi, signer)

        const getWinner = await contract.cashout()
        
      }

    }
    catch(error) {
    	console.log(error);
  	}


  }

   const enterComp = async () => {
    const price = '0.05';
    try {
      const {ethereum} = window;
      if(window.ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(blockAddress,abi.abi,signer)

      console.log("abot to enter lotter")
      let tx = await contract.enter({value: ethers.utils.parseEther(price)})
      const receipt = await tx.wait()

      if (receipt.status === 1){
        alert("You have successfully entered the matrix! Winner would be announced at 2300 GMT ")
      }else {
				alert("Transaction failed! Please try again");
			}
      }
    }catch(error) {
    	console.log(error);
  	}
  }

  const viewPlayers = async () =>{
    const {ethereum} = window;
    try{
      if(window.ethereum){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(blockAddress,abi.abi, signer)

        const players = await contract.getPlayers()
        console.log(players)
        const playerList = players.map(player => <p>player</p>
        )
      }else{
        console.log("Ethereum object doesn't exist!")
      }
    }catch(error){
      console.log(error);
    }
  }
  const connectWallet = async () => {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				alert("Get MetaMask -> https://metamask.io/");
				return;
			}

			// Fancy method to request access to account.
			const accounts = await ethereum.request({ method: "eth_requestAccounts" });
		
			// Boom! This should print out public address once we authorize Metamask.
			console.log("Connected", accounts[0]);
			setCurrentAccount(accounts[0]);
		} catch (error) {
			console.log(error)
		}
	}

  const switchNetwork = async () => {
	if (window.ethereum) {
		try {
			// Try to switch to the Mumbai testnet
			await window.ethereum.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: '0x4' }], // Check networks.js for hexadecimal network ids
			});
		} catch (error) {
			// This error code means that the chain we want has not been added to MetaMask
			// In this case we ask the user to add it to their MetaMask
			if (error.code === 4902) {
				try {
					await window.ethereum.request({
						method: 'wallet_addEthereumChain',
						params: [
							{	
								chainId: '0x4',
								chainName: 'ETH',
								rpcUrls: ['https://rinkeby.infura.io/v3/'],
								nativeCurrency: {
										name: "Rinkeby Ether",
										symbol: "ETH",
										decimals: 18
								},
								blockExplorerUrls: ["https://rinkeby.ethersca.io/"]
							},
						],
					});
				} catch (error) {
					console.log(error);
				}
			}
			console.log(error);
		}
	} else {
		// If window.ethereum is not found then MetaMask is not installed
		alert('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
	} 
}
  
	const checkIfWalletIsConnected = async () => {
		const { ethereum } = window;

		if (!ethereum) {
			console.log('Make sure you have metamask!');
			return;
		} else {
			console.log('We have the ethereum object', ethereum);
		}
		
		const accounts = await ethereum.request({ method: 'eth_accounts' });

		if (accounts.length !== 0) {
			const account = accounts[0];
			console.log('Found an authorized account:', account);
			setCurrentAccount(account);
		} else {
			console.log('No authorized account found');
		}
		
		// This is the new part, we check the user's network chain ID
		const chainId = await ethereum.request({ method: 'eth_chainId' });
		setNetwork(networks[chainId]);

		ethereum.on('chainChanged', handleChainChanged);
		
		// Reload the page when they change networks
		function handleChainChanged(_chainId) {
			window.location.reload();
		}
	};
  useEffect(() => {
    if (network === 'Rinkeby') {
      viewPlayers();
    }
  }, [currentAccount, network]);

  useEffect(() => {
		checkIfWalletIsConnected();
	}, []);
  
  const renderInputForm = () =>{
		if (network !== 'Rinkeby') {
			return (
				<div className="connect-wallet-container">
					<p>Please connect to Rinkeby Testnet </p>
				</div>
			);
		}  
  }
    return (
                <div className="main">
          <div className="left">
        <h3 className="welcome"> The BlockLotto Pyramid</h3>
        <p className="txt"> are you ready to be the next millionaire?</p>
            <em className="txt">entry ticket cost <strong color="red">0.05eth only!</strong></em>
           
        </div>
        
        <div className="right">
          
          <div className="bt">
              <button className="btn" onClick={enterComp}> Enter Lottery </button>
              {currentAccount && renderInputForm()}
          </div>  

           <div className="bt">
             <div className="connect-wallet-container">
             {!currentAccount && <button className="btn" onClick={connectWallet}> Connect Wallet </button>}
             </div>
             
          </div>
          <div className="bt">
              <button className="btn" onClick={viewPlayers}> View Players </button>
          </div>
            <div className="bt">
                <button className="btn" onClick={cashout}>Winner</button>
            </div>
        </div>


        </div>
    )

}
export default Main;