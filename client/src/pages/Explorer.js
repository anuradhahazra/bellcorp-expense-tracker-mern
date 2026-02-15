import React from 'react';
import TransactionExplorer from '../components/explorer/TransactionExplorer';

export default function Explorer() {
  return (
    <div>
      <h1 style={{ marginBottom: '1rem' }}>Transaction Explorer</h1>
      <TransactionExplorer />
    </div>
  );
}
