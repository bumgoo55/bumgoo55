import { useAuth, useContractCall } from '@micro-stacks/react';
import { uintCV } from 'micro-stacks/clarity';
import React, {useState} from 'react';
import {FungibleConditionCode, PostConditionMode, makeContractSTXPostCondition, makeStandardSTXPostCondition} from 'micro-stacks/transactions';
import { StacksNetwork, StacksTestnet, StacksMainnet } from 'micro-stacks/network';
import {ChainID} from 'micro-stacks/common';
import { stringUtf8CV } from 'micro-stacks/clarity';


// Contract Example 220222
// Test NFT Call for testnet
const contractAddress = 'ST265XFQT58ZDYDGG017HZCTT3HRZY6E7R0HYDPA5';
const contractName = 'MAR-PREP-NFT';
const functionName = 'claim';
const network = new StacksTestnet();  // Testnet config  
const ContractCallButton = () => {  
  // ConditionCode: Equal = 1, Greater = 2, GreaterEqual = 3, Less = 4, LessEqual = 5  
  const pc_code = FungibleConditionCode.Equal ; // equal
  const pc_amount = BigInt(1000000n);
  let pc_wallet : string | undefined;
  let cur_wallet : string | undefined;
  const { isSignedIn, handleSignIn, handleSignOut, session } = useAuth();        
    
  (network.isMainnet() == true
  ? cur_wallet = isSignedIn ? session?.addresses?.mainnet : undefined
  : cur_wallet = isSignedIn ? session?.addresses?.testnet : undefined);

  if (cur_wallet && typeof cur_wallet === "string"){
    pc_wallet =  cur_wallet;
  }else{
    pc_wallet = 'ST3YBSE9SCH3CHXZ5HS3MYWKWMMXSNC5FHQMFXNW2';
  }
  
  // Make STX Post Condition 
  const standardSTXPostCondition = makeStandardSTXPostCondition(pc_wallet, pc_code, pc_amount); 
    console.log(session);
    // // `functionArgs` is a list of `ClarityValue` objects
    // const functionArgs = [
    //   uintCV(123n), 
    // ];
    // functionArgs : [stringUtf8CV()],     
    const { handleContractCall, isLoading } = useContractCall({
      functionName:functionName,    
      functionArgs: [],      
      // senderKey: [],
      // postConditionMode : PostConditionMode.Allow,
      postConditions: [standardSTXPostCondition], //  why it does not work ???  
      contractAddress:contractAddress,
      contractName:contractName,    
      network:network,     
    });

    return (<div>
      <br/>
      {isSignedIn === true ? 
        <button className="btn btn-primary" onClick={()=>handleContractCall()}>      
          {isLoading ? 'Loading...' : ' Mint! '}
        </button>
      : null}
    </div>);
  
};
 
export default ContractCallButton;

 