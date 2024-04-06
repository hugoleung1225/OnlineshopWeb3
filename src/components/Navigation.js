import { ethers } from 'ethers';

const Navigation = ({ provider, account, setAccount }) => {
    const connectHandler = async () => {
        {/**Call chrome extension of the wallet */}
        if(window.ethereum){
            provider.send("eth_requestAccounts",[])
            .then(async ()=>{
                const signer = await provider.getSigner();
                const account = await signer.getAddress();
                setAccount(account);
            })
        }
    }

    return (
        <nav>
            <div className='nav__brand'>
                <h1>Dappazon</h1>
            </div>

            <input
                type="text"
                className='nav__search'
            >
            </input>

            {account?(
                <button
                type='button'
                className='nav__connect'
                >{account.slice(0,6) + '...' + account.slice(38,42) }</button>
            ):(
                <button
                type='button'
                className='nav__connect'
                onClick={connectHandler}
                >Connect</button>

            )}


            <ul className='nav__links'>
                <li><a href="#Clothing & Jewelry">Clothing & Jewelry</a></li>
                <li><a href="#Electronics & Gadgets">Electronics & Gadgets</a></li>
                <li><a href="#Toys & Gaming">Toys & Gaming</a></li>
            </ul>
        </nav>
    );
}

export default Navigation;