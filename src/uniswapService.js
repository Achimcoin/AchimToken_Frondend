import { ethers, Contract, parseEther } from 'ethers';
import { config } from './config';

/**
 * Investiert ETH in ACH-Token.
 * @param {string} walletAddress - Die Wallet-Adresse des Investors.
 * @param {number} amount - Der Betrag an ETH, der investiert werden soll.
 */
export const invest = async (walletAddress, amount) => {
    console.log('Investition gestartet...');

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
        // Wrappe ETH zu WETH
        console.log('Wrappe ETH zu WETH...');
        const wrapTx = await wethContract.deposit({ value: parseEther(amount.toString()) });
        await wrapTx.wait();
        console.log('ETH erfolgreich zu WETH gewrappt.');

        // Genehmigung für den Uniswap Router erteilen
        console.log('Genehmigung für Uniswap Router erteilen...');
        const approveTx = await wethContract.approve(routerAddress, parseEther(amount.toString()));
        await approveTx.wait();
        console.log('Genehmigung erfolgreich erteilt.');

        // Erstelle den Vertragsaufruf mit dem Router
        const contract = new Contract(routerAddress, abi, signer);

        // Definiere die Parameter für den Swap
        const params = {
            tokenIn: wethAddress, // Verwende WETH als input
            tokenOut: config.defaultTokenAddress, // ACH-Token als Ausgabe
            fee: config.uniswapFee, // Gebührenstufe des Pools
            recipient: walletAddress, // Adresse, die die ACH erhalten soll
            deadline: Math.floor(Date.now() / 1000) + 60 * config.deadlineMinutes, // Zeitlimit in Sekunden
            amountIn: parseEther(amount.toString()), // Betrag in WETH
            amountOutMinimum: parseEther('0.00001'), // Mindestbetrag, den du erhalten möchtest
            sqrtPriceLimitX96: 0, // Kein spezifisches Preislimit
        };

        console.log('Parameter für die Transaktion:', params);

        // Führe die Transaktion aus
        const tx = await contract.exactInputSingle(params, {
            gasLimit: 600000, // Höheres Gas Limit
        });
        console.log('Transaktion gesendet, warte auf Bestätigung...', tx);
        await tx.wait();
        console.log('Investition erfolgreich abgeschlossen');
    } catch (error) {
        console.error('Fehler bei der Investition:', error.message || error);
        if (error.transaction) {
            console.error('Transaktionsdetails:', error.transaction);
        }
        throw error;
    }
};

/**
 * Investiert in einen spezifischen Token anstelle des Standard-ACH-Tokens.
 * @param {string} walletAddress - Die Wallet-Adresse des Investors.
 * @param {number} amount - Der Betrag an ETH, der investiert werden soll.
 * @param {string} tokenAddress - Die Adresse des Tokens, in den investiert werden soll.
 */
export const investInToken = async (walletAddress, amount, tokenAddress) => {
    console.log('Token-Investition gestartet...');

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

    // Adresse des WETH-Tokens (Sepolia-Version)
    const wethAddress = '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14';

    const wethContract = new Contract(wethAddress, abi, signer);

    try {
        // Wrappe ETH zu WETH
        const wrapTx = await wethContract.deposit({ value: parseEther(amount.toString()) });
        await wrapTx.wait();

        // Genehmigung für den Uniswap Router erteilen
        const approveTx = await wethContract.approve(routerAddress, parseEther(amount.toString()));
        await approveTx.wait();

        // Erstelle den Vertragsaufruf mit dem Router
        const contract = new Contract(routerAddress, abi, signer);

        // Definiere die Parameter für den Swap
        const params = {
            tokenIn: wethAddress,
            tokenOut: tokenAddress, // Ziel-Token-Adresse
            fee: config.uniswapFee,
            recipient: walletAddress,
            deadline: Math.floor(Date.now() / 1000) + 60 * config.deadlineMinutes,
            amountIn: parseEther(amount.toString()),
            amountOutMinimum: parseEther('0.00001'),
            sqrtPriceLimitX96: 0,
        };

        const tx = await contract.exactInputSingle(params, {
            gasLimit: 600000,
        });
        await tx.wait();
        console.log('Token-Investition erfolgreich abgeschlossen');
    } catch (error) {
        console.error('Fehler bei der Token-Investition:', error.message || error);
        if (error.transaction) {
            console.error('Transaktionsdetails:', error.transaction);
        }
        throw error;
    }
};
