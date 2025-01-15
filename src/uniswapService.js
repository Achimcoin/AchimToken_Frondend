// Updated uniswapService.js to use WETH instead of ETH directly
import { ethers, Contract, parseEther } from 'ethers';
import { config } from './config';

export const investInToken = async (walletAddress, amount) => {
    console.log('Starte Investition in Token...');
    console.log(`Wallet-Adresse: ${walletAddress}`);
    console.log(`Investitionsbetrag: ${amount} ETH`);

    // Verwende die neue Sepolia V3 Router-Adresse
    const routerAddress = config.uniswapRouterAddress;
    console.log(`Uniswap Router Adresse: ${routerAddress}`);

    const abi = [
        'function exactInputSingle((address tokenIn,address tokenOut,uint24 fee,address recipient,uint256 amountIn,uint256 amountOutMinimum,uint160 sqrtPriceLimitX96)) external payable returns (uint256)',
        'function deposit() public payable', // Für WETH-Wrapping
        'function approve(address spender, uint256 amount) public returns (bool)' // Genehmigung für Router
    ];

    // Initialisiere den Provider und den Signer
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    console.log('Signer erfolgreich initialisiert:', signer);

    // Adresse des WETH-Tokens (Sepolia-Version)
    const wethAddress = '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14'; // WETH-Adresse für das Sepolia Netzwerk

    // Verwende den WETH-Vertrag
    const wethContract = new Contract(wethAddress, abi, signer);

    try {
<<<<<<< HEAD
        // Wrappe ETH zu WETH
=======
>>>>>>> f7e0c00373d51ecefd7ca5d4507761c15b5bfb4a
        console.log('Wrappe ETH zu WETH...');
        const wrapTx = await wethContract.deposit({ value: parseEther(amount.toString()) });
        await wrapTx.wait();
        console.log('ETH erfolgreich zu WETH gewrappt.');

<<<<<<< HEAD
        // Genehmigung für den Uniswap Router erteilen
=======
>>>>>>> f7e0c00373d51ecefd7ca5d4507761c15b5bfb4a
        console.log('Genehmigung für Uniswap Router erteilen...');
        const approveTx = await wethContract.approve(routerAddress, parseEther(amount.toString()));
        await approveTx.wait();
        console.log('Genehmigung erfolgreich erteilt.');

        // Erstelle den Vertragsaufruf mit dem Router
        const contract = new Contract(routerAddress, abi, signer);

        // Definiere die Parameter für den Swap
        const params = {
            tokenIn: wethAddress, // Verwende WETH als input
            tokenOut: config.defaultTokenAddress, // ACC als Ausgabe-Token
            fee: config.uniswapFee, // Gebührenstufe des Pools
            recipient: walletAddress, // Adresse, die die ACC erhalten soll
            deadline: Math.floor(Date.now() / 1000) + 60 * config.deadlineMinutes, // Zeitlimit in Sekunden
            amountIn: parseEther(amount.toString()), // Betrag in WETH
            amountOutMinimum: parseEther('0.00001'), // Mindestbetrag, den du erhalten möchtest
            sqrtPriceLimitX96: 0, // Kein spezifisches Preislimit
        };

        console.log('Parameter für die Transaktion:', params);

        // Führe die Transaktion aus
        const tx = await contract.exactInputSingle(params, {
<<<<<<< HEAD
            gasLimit: 600000, // Höheres Gas Limit
=======
            gasLimit: 500000, // Angepasstes Gas Limit
>>>>>>> f7e0c00373d51ecefd7ca5d4507761c15b5bfb4a
        });
        console.log('Transaktion gesendet, warte auf Bestätigung...', tx);
        await tx.wait();
        console.log('Investition erfolgreich abgeschlossen');
    } catch (error) {
        console.error('Fehler bei der Investition:', error.message || error);
        console.error('Fehler Stack Trace:', error);
<<<<<<< HEAD
        if (error.transaction) {
            console.error('Transaktionsdetails:', error.transaction);
        }
=======
>>>>>>> f7e0c00373d51ecefd7ca5d4507761c15b5bfb4a
        throw error;
    }
};
