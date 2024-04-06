import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Section from './components/Section'
import Product from './components/Product'

// ABIs
import Dappazon_abis from './abis/Dappazon.json'

// Config
import config from './config.json'

import itemList from './items.json'


function App() {
  //metamask account
  const [account, setAccount] = useState(null)

  //smart contract
  const [dappazon, setDappazon] = useState(null)

  //blockchain
  const [provider, setProvider] = useState(null)

  const [browserProvider, setBrosProvider] = useState(null)

  //products
  const [electronics, setElectronics]= useState(null)
  const [clothing, setClothing]= useState(null)
  const [toys, setToys]= useState(null)
  const [item, setItem] = useState({})
  const [toggle, setToggle] = useState(false)

  const togglePop = (item) => {
    setItem(item)
    toggle ? setToggle(false) : setToggle(true)
  }
  const loadBlockchainData = async() =>{
    //connect to blockchain 
    const browserProvider = new ethers.providers.Web3Provider(window.ethereum)
    //const browserProvider = new ethers.BrowserProvider(window.ethereum)
    const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
    setProvider(provider)
    setBrosProvider(browserProvider)
    const network = await provider.getNetwork()

    //Connect to smart contracts
    console.log( `Try to read Chain ${ JSON.stringify(network)}` )
    
    const dappazon = new ethers.Contract(
      config[network.chainId].dappazon.address,
      Dappazon_abis,
      provider
    )

    setDappazon(dappazon)

    //Load products
    const items = []

    const ttlItems= itemList['items'].length
    console.log( `Total items: ${ttlItems}`)
    for ( var i=1 ; i<= ttlItems ; i++){
      const item = await dappazon.items(i)
      items.push(item)
    }

    const electronics = items.filter( item => { return item.category === 'electronics' });
    const clothing = items.filter( item => { return item.category === 'clothing' });
    const toys = items.filter( item => { return item.category === 'toys' });
    setClothing(clothing)
    setToys(toys)
    setElectronics(electronics)
  }

  useEffect(()=>{
    loadBlockchainData();
  },[])

  return (
    <div>
      {/**Add natvigator */}
      <Navigation provider={browserProvider} account={account} setAccount={setAccount}/>

      <h2>Welcome to Dappazon</h2>

      {/**load Sections untils all producs list ready */}
      {electronics && clothing && toys &&(
        <div>
          <Section title={"Clothing & Jewelry"} items={clothing} togglePop={togglePop}></Section>
          <Section title={"Electronics & Gadgets"} items={electronics} togglePop={togglePop}></Section>
          <Section title={"Toys & Gaming"} items={toys} togglePop={togglePop}></Section>
        </div>
      )}

      {toggle && (
        <Product item={item} provider={browserProvider} account={account} dappazon={dappazon} togglePop={togglePop} />
      )}
    </div>
  );
}

export default App;
