import React, {useState, useEffect } from 'react';
import { MicroStacksProvider } from '@micro-stacks/react';
import { useStxTransfer } from '@micro-stacks/react';
import { AuthOptions } from 'micro-stacks/connect';
import { useAuth } from "@micro-stacks/react";
import { ClarityType } from 'micro-stacks/clarity'; 
import ContractCallButton from './STX_ContractCall'; 

// Token Transfer
let recipientWallet_mainnet = 'SP3YBSE9SCH3CHXZ5HS3MYWKWMMXSNC5FHPS31TT4';
let recipientWallet_testnet = 'ST3YBSE9SCH3CHXZ5HS3MYWKWMMXSNC5FHQMFXNW2';

let curWallet:(string|undefined) = undefined;
let curWallet_testnet:(string|undefined) = undefined;
let curNetwork = 'testnet'; // or mainnet

// Connect Wallet
const authOptions:AuthOptions = {
  appDetails: {
    name: 'bg_tester',
    icon: './bg_test.png',
  }
}  
 
const TokenTransferButton = () => {
  let [targetWallet, setTargetWallet] = useState('ST3YBSE9SCH3CHXZ5HS3MYWKWMMXSNC5FHQMFXNW2');  
  let recipient = targetWallet;
  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const {currentTarget: { value },} = event;
    setTargetWallet(value)
  };
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(targetWallet);
  }
  const { handleStxTransfer, isLoading } = useStxTransfer({
    recipient, 
    amount: 1000000n, // BigInt(100000)  
  });   
  return ( 
      <div>                
          <form onSubmit={onSubmit} className="input-group input-group-sm mb-3">
            <span className="input-group-text" id="inputGroup-sizing-sm">Recipient Wallet</span>          
            <input value={targetWallet} onChange={onChange} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"  placeholder="changeWalletAddress" />            
            <button>Save Wallet Address</button>          
          </form>          
        {
            curWallet === undefined
            ? null
            : (<button className="btn btn-secondary" onClick={()=>handleStxTransfer()}>
                {isLoading ? 'Loading...' : 'Send 1 STX'}
              </button>)
        }    
      </div>
    );
};

export const WalletConnectButton = () => {
    const { isSignedIn, handleSignIn, handleSignOut, isLoading, session } = useAuth();        
    
    (curNetwork === 'mainnet' 
    ? curWallet = isSignedIn ? session?.addresses?.mainnet : undefined
    : curWallet = isSignedIn ? session?.addresses?.testnet : undefined);
 
    return (   
        <div>
            <br/>            
            <p className="font-monospace">Current Network: {curNetwork} <br/>
              Connected Wallet: {curWallet === undefined ? undefined : curWallet}</p>            
            <button className="btn btn-outline-primary" 
                onClick={()=>isSignedIn ? handleSignOut() : handleSignIn()}>         
                {isLoading
                    ? "Loading..."
                    : isSignedIn
                    ? "Sign out"
                    : "Connect Stacks Wallet"                    
                }               
            </button> <br/> <br/>
            ======================================================= <br/>
        </div>
    );  
};

const STX_wallet = () => {        
    return ( 
        <div>      
          <MicroStacksProvider authOptions={authOptions}>                
              <WalletConnectButton />  
              <TokenTransferButton />                                             
              <ContractCallButton/>
          </MicroStacksProvider>
        </div>
    )
};

export default STX_wallet;