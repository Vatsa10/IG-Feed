import React from 'react';

const InstagramWebView = ({ username, style = {} }) => {
  const instagramUrl = `https://www.instagram.com/${username}/`;
  
  return (
    <div style={{ width: '100%', height: '100%', ...style }}>
      <webview
        src={instagramUrl}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
        useragent="Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"
        webpreferences="contextIsolation=yes, nodeIntegration=no"
      />
    </div>
  );
};

export default InstagramWebView;
