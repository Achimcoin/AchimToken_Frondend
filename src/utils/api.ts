export const saveWalletAddress = async (
  walletAddress: string,
  referrerId: string | null = null
) => {
  try {
    const response = await fetch('https://api.achim.group/api/investor/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        walletAddress,
        referrerId, // Optional: null, wenn keine Referrer-ID vorhanden
      }),
    });

    if (!response.ok) {
      throw new Error(`Fehler beim Speichern: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API-Antwort:', data);

    if (data.status === 'success') {
      console.log('Wallet-Adresse erfolgreich registriert.');
    } else {
      console.warn('Registrierung nicht erfolgreich:', data.message);
    }
  } catch (error) {
    console.error('Fehler beim API-Aufruf:', error);
  }
};
