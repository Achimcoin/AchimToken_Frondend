import React from 'react';

const SwapWidget = ({ influencerId }) => {
  const widgetUrl = `https://achim.group/swap-widget?ref=${influencerId}`;

  return (
    <iframe
      src={widgetUrl}
      title="Swap Widget"
      style={{ width: '100%', height: '600px', border: 'none' }}
    />
  );
};

export default SwapWidget;
