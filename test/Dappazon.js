const { expect } = require("chai")
const { ethers } = require("hardhat");

//token with units
const tokens = (n) => {
  //n ETH
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

//test value of item
const ID = 1;
const NAME = "Shoes"
const CATEGORY = "Clothing"
const IMAGE = "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/shoes.jpg"
const COST = tokens(1)
const RATING = 4
const STOCK = 5


describe("Dappazon", () => {
  let dappazon;
  let deployer, buyer
  beforeEach( async() => {
    [deployer, buyer ] =await ethers.getSigners()
    //console.log( await ethers.getSigners() );

    const Dappazon = await ethers.getContractFactory("Dappazon")
    dappazon = await Dappazon.deploy()
  })

  describe("Deployment", ()=>{
    it("Sets the owner", async ()=>{
      expect(await dappazon.owner()).to.equal( deployer.address )
    })
    /*For initial test only
    it('has a name', async()=>{
      const name = await dappazon.name()
      expect( name ).to.equal("Dappazon");  
    })*/
  })

  describe("Listing Product", ()=>{
    let transcation

    beforeEach( async()=>{
      transcation = await dappazon.connect(deployer).list(
        ID, NAME , CATEGORY, IMAGE, COST, RATING, STOCK
      )

      await transcation.wait()
    })

    it("Returns item attributes", async ()=>{
      //get from list
      const item = await dappazon.items(ID)
      
      //expectation
      expect(item.id).to.equal(ID)
      expect(item.name).to.equal(NAME)
      expect(item.category).to.equal(CATEGORY)
      expect(item.image).to.equal(IMAGE)
      expect(item.cost).to.equal(COST)
      expect(item.rating).to.equal(RATING)
      expect(item.stock).to.equal(STOCK)
    })

    it("Emits List event", ()=>{
      expect(transcation).to.emit(dappazon, "List")
    })
  })

  describe("Buy Product", ()=>{
    let transcation

    beforeEach( async()=>{
      transcation = await dappazon.connect(deployer).list(
        ID, NAME , CATEGORY, IMAGE, COST, RATING, STOCK
      )
      await transcation.wait()
      //Buy an item
      transcation = await dappazon.connect(buyer).buy(ID, {value: COST})

      await transcation.wait()
    })

    it("Updates the contract balance", async()=>{
      const result = await ethers.provider.getBalance(dappazon.address)
      console.log(result)
      expect(result).to.equal(COST)
    })

    it("Updates buyer's order count", async()=>{
      const result = await dappazon.orderCount(buyer.address)
      expect(result).to.equal(1)
    })

    it("Adds to order", async()=>{
      const order = await dappazon.orders(buyer.address, 1)

      expect(order.time).to.be.greaterThan(0)
      expect(order.item.name).to.equal(NAME)
    })

    it( "Emit buying" , async()=>{
      console.log( `Transaction after buying : ${JSON.stringify(transcation)}` )
      expect(transcation).to.emit(dappazon, "Buy")
    })
  })

  describe("Withdrawing", () => {
    let balanceBefore

    beforeEach(async () => {
      // List a item
      let transaction = await dappazon.connect(deployer).list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK)
      await transaction.wait()

      // Buy a item
      transaction = await dappazon.connect(buyer).buy(ID, { value: COST })
      await transaction.wait()

      // Get Deployer balance before
      balanceBefore = await ethers.provider.getBalance(deployer.address)

      // Withdraw
      transaction = await dappazon.connect(deployer).withdraw()
      await transaction.wait()
    })

    it('Updates the owner balance', async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address)
      console.log( `Balance after: ${balanceAfter}` )
      expect(balanceAfter).to.be.greaterThan(balanceBefore)
    })

    it('Updates the contract balance', async () => {
      const result = await ethers.provider.getBalance(dappazon.address)
      expect(result).to.equal(0)
    })
  })
})
 