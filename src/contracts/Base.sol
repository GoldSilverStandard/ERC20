pragma solidity ^0.6.0;

import "./IERC20.sol";
import "./Ownable.sol";
import "./SafeMath.sol";

contract Base is IERC20, Ownable {
    using SafeMath for uint;

    uint constant private Sender = 0;
    uint constant private Receiver = 1;

    bool public paused;

    struct Bar {
        uint256 amount;
        bytes32 location;
        bytes32 serial;
    }

    // Public variables of the token
    uint8 public decimals = 4;
    uint256 override public totalSupply;

    uint16 constant private FEE_INCREASE = 10; //As 0.10%
    uint16 public fee = 20; //As 0.20%
    uint256 public lastUpdated;

    uint256 public stockCount;
    mapping (bytes32 => mapping(bytes32 => uint256)) public stock;
    
    address public minter;
    address public burner;
    address public feeHolder;

    mapping (address => uint256) private balances;
    mapping (address => mapping (address => uint256)) private allowed;
    mapping (uint => mapping(address => bool)) private whiteList;

    function balanceOf(address who) override public view returns (uint256 balance) {
        balance = balances[who];
    }

    function _transfer(address from, address to, uint256 value) internal {
        require(paused != true, "Contract paused");
        require(to != address(0), "Invalid address");
        require(from != address(0), "Invalid address");
        require(balances[from] >= value, "Insufficient funds");

        if (isFeeExempt(Sender, from) || isFeeExempt(Receiver, to)) {
            balances[from] = balances[from].sub(value);
            balances[to] = balances[to].add(value);

            emit Transfer(from, to, value);
        } else {
            uint totalFee = fee * value / (uint16(10) ** decimals);

            if (totalFee == 0) {
                totalFee = 1;
            }

            balances[from] = balances[from].sub(value);
            balances[feeHolder] = balances[feeHolder].add(totalFee);
            balances[to] = balances[to].add(value.sub(totalFee));

            emit Transfer(from, to, value.sub(totalFee));
            emit Transfer(from, feeHolder, totalFee);
        }
    }
    
    function transfer(address to, uint256 value) override public returns (bool) {
        _transfer(msg.sender, to, value);
        return true;
    }

    function allowance(address tokenOwner, address spender) override public view returns (uint remaining) {
        return allowed[tokenOwner][spender];
    }

    function transferFrom(address from, address to, uint256 value) override public returns (bool success) {
        require(to != address(0), "Invalid address");

        allowed[from][msg.sender] = allowed[from][msg.sender].sub(value);
        _transfer(from, to, value);

        emit Approval(from, msg.sender, allowed[from][msg.sender]);
        return true;
    }

    function approve(address spender, uint256 value) override public returns (bool) {
        require(spender != address(0), "Invalid address");

        allowed[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function burn(bytes32 location, bytes32 serial) public onlyBurner() returns (bool) {
        uint256 value = stock[location][serial];

        stock[location][serial] = 0;
        balances[owner] = balances[owner].sub(value);

        stockCount = stockCount.sub(1);
        totalSupply = totalSupply.sub(value);

        emit Transfer(owner, address(0), value);
        emit Burned(serial, value);
    }

    function mint(address to, bytes32 location, bytes32 serial, uint256 value) public onlyMinter() returns(bool) {
        require(to != address(0), "Invalid address");
        require(value > 0, "Amount must be greater than zero");

        stock[location][serial] = value;
        stockCount = stockCount.add(1);

        totalSupply = totalSupply.add(value);
        balances[to] = balances[to].add(value);

        emit Transfer(owner, to, value);
        emit Minted(serial, value);

        return true;
    }

    function decreaseFee(uint16 value) public onlyOwner() {
        require(value < fee, "New fee must be less than current fee");
        require(value >= 0, "Fee must be greater than or equal to zero");

        lastUpdated = now;
        fee = value;
        
        emit FeeUpdated(fee);
    }

    function increaseFee() public onlyOwner() {
        require(now > lastUpdated + 30 days, "Cannot update fee within 30 days of last change");
        
        lastUpdated = now;
        fee += FEE_INCREASE;
        
        emit FeeUpdated(fee);
    }

    function addToWhiteList(uint index, address who) public onlyOwner() {
        require(who != address(0), "Invalid address");
        whiteList[index][who] = true;
    }

    function removeFromWhiteList(uint index, address who) public onlyOwner() {
        require(who != address(0), "Invalid address");
        delete whiteList[index][who];
    }

    function inWhiteList(uint index, address who) public view returns (bool) {
        return whiteList[index][who] == true || who == feeHolder || who == owner;
    }

    function inAnyWhiteList(address who) public view returns (bool) {
        return whiteList[0][who] == true || whiteList[1][who] == true || who == feeHolder || who == owner;
    }

    function updateBurner(address who) public onlyOwner() returns (bool) {
        require(who != address(0), "Invalid address");
        burner = who;

        return true;
    }

    function updateMinter(address who) public onlyOwner() returns (bool) {
        require(who != address(0), "Invalid address");
        minter = who;

        return true;
    }

    function updateFeeHolder(address who) public onlyOwner() returns (bool)  {
        require(who != address(0), "Invalid address");
        feeHolder = who;

        return true;
    }

    function isFeeExempt(uint index, address who) public view returns (bool) {
        return whiteList[index][who] == true || who == feeHolder || who == owner || who == burner || who == minter;
    }

    function pauseContract() public onlyOwner() {
        paused = true;
    }

    event FeeUpdated(uint16 value);
    event Burned(bytes32 serial, uint value);
    event Minted(bytes32 serial, uint value);

    modifier onlyBurner() {
        require(burner == msg.sender, "Sender is not a burner");
        _;
    }

    modifier onlyMinter() {
        require(minter == msg.sender, "Sender is not a minter");
        _;
    }

    fallback () external payable {
        revert("Not payable");
    }
}