// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Dappazon {
    //contract code goes here
    //string public name ;
    address public owner;

    //product ltems
    struct Item{
        uint256 id;
        string name;
        string category;
        string image;
        uint256 cost;
        uint256 rating;
        uint256 stock;
    }

    struct Order {
        uint256 time;
        Item item;
    }
    
    //mapping( intput => output )
    mapping(uint256 => Item) public items;
    mapping(address => uint256) public orderCount;
    mapping(address => mapping(uint256 => Order)) public orders;

    //list product event
    event List(string name, uint256 cost, uint256 quantity);
    event Buy(address buyer, uint256 orderId, uint256 itemId);

    modifier onlyOwner(){
        //run before function body
        require(msg.sender == owner );

        //general term of function body
        _;
    }

    constructor(){
        //name = "Dappazon";
        owner = msg.sender;
    }

    //list products
    function list(
        uint256 _id,
        string memory _name,
        string memory _category,
        string memory _image,
        uint256 _cost,
        uint256 _rating,
        uint256 _stock
    ) public onlyOwner{
        //set only owner can list products
        

        //create item struct
        Item memory item = Item( _id, _name, _category, _image, _cost, _rating, _stock );

        //save item to blockchain
        items[_id] = item;

        //emit event
        emit List(_name, _cost, _stock);
    }

    //buy products  
    //payable modifier to receive Crypto
    function buy(uint256 _id)public payable{
        //Receive Crypto ( done by payable )

        //retrieve item
        //Data location must be "storage", "memory" or "calldata" for variable, but none was given.
        Item memory item = items[_id];

        //requirement
        require(msg.value >= item.cost);
        require(item.stock > 0);

        //Create an order
        Order memory order = Order(block.timestamp, item);

        //Add order for user
        orderCount[msg.sender]++;
        orders[msg.sender][orderCount[msg.sender]] = order;

        //Substrack stock
        items[_id].stock = item.stock - 1;
        
        //Emit event , buy address, orderId, itemid
        emit Buy( msg.sender, orderCount[msg.sender] , _id );
    }

    //withdraw funds
    function withdraw() public onlyOwner{
        (bool success,) = owner.call{ value: address(this).balance}("");
        require(success);
    }
}
