pragma solidity 0.6.4;

import "./IERC20.sol";
import "./Ownable.sol";
import "./SafeMath.sol";

struct Bar {
    uint256 amount;
    bytes32 location;
    bytes32 serial;
}

contract Base is IERC20, Ownable {
    using SafeMath for uint;

    uint constant private Sender = 0;
    uint constant private Receiver = 1;

    bool public paused;

    //Private variables of the token
    uint256 private _decimals;    
    uint256 internal _lastUpdated;
    uint256 private _totalSupply;
    uint256 private _stockCount;

    uint16 constant private FEE_INCREASE = 10; //As 0.10%
    uint public fee = 20; //As 0.20%

    mapping (bytes32 => mapping(bytes32 => uint256)) public stock;
    
    address public minter;
    address public burner;
    address public feeHolder;

    mapping (address => uint256) private _balances;
    mapping (address => mapping (address => uint256)) private _allowed;
    mapping (uint => mapping(address => bool)) private _whiteList;

    function lastUpdated() public view returns (uint256) {
        return _lastUpdated;
    }

    function stockCount() public view returns (uint256) {
        return _stockCount;
    }

    //erc20 props
    function decimals() public pure returns (uint8) {
        return 4;
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address who) override public view returns (uint256 balance) {
        balance = _balances[who];
    }

    function _transfer(address from, address to, uint256 value) internal {
        require(paused != true, "Contract paused");
        require(to != address(0), "Invalid to address");
        require(from != address(0), "Invalid from address");
        require(_balances[from] >= value, "Insufficient funds");

        if (isFeeExempt(Sender, from) || isFeeExempt(Receiver, to)) {
            _balances[from] = _balances[from].sub(value);
            _balances[to] = _balances[to].add(value);

            emit Transfer(from, to, value);
        } else {
            uint totalFee = fee.mul(value);
            totalFee = totalFee.div(10 ** uint256(decimals()));

            if (totalFee == 0) {
                totalFee = 1;
            }

            _balances[from] = _balances[from].sub(value);
            _balances[feeHolder] = _balances[feeHolder].add(totalFee);
            _balances[to] = _balances[to].add(value.sub(totalFee));

            emit Transfer(from, to, value.sub(totalFee));
            emit Transfer(from, feeHolder, totalFee);
        }
    }
    
    function transfer(address to, uint256 value) override public returns (bool) {
        _transfer(msg.sender, to, value);
        return true;
    }

    function allowance(address tokenOwner, address spender) override public view returns (uint remaining) {
        return _allowed[tokenOwner][spender];
    }

    function transferFrom(address from, address to, uint256 value) override public returns (bool success) {
        require(to != address(0), "Invalid address");

        _allowed[from][msg.sender] = _allowed[from][msg.sender].sub(value);
        _transfer(from, to, value);

        emit Approval(from, msg.sender, _allowed[from][msg.sender]);
        return true;
    }

    function approve(address spender, uint256 value) override public returns (bool) {
        require(spender != address(0), "Invalid address");

        _allowed[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function burn(bytes32 location, bytes32 serial) public onlyBurner() {
        require(uint(location) != 0 && uint(serial) != 0, "Invalid location or serial");
        uint256 value = stock[location][serial];

        //check owner has the required amount first
        require(_balances[owner] >= value, "Cannot burn more than you own");

        stock[location][serial] = 0;
        _balances[owner] = _balances[owner].sub(value);

        _stockCount = _stockCount.sub(1);
        _totalSupply = _totalSupply.sub(value);

        emit Transfer(owner, address(0), value);
        emit Burned(serial, value);
    }

    function mint(address to, bytes32 location, bytes32 serial, uint256 value) public onlyMinter() returns(bool) {
        require(uint(location) != 0 && uint(serial) != 0, "Invalid location or serial");
        require(to != address(0), "Invalid to address");
        require(value > 0, "Amount must be greater than zero");

        stock[location][serial] = value;
        _stockCount = _stockCount.add(1);

        _totalSupply = _totalSupply.add(value);
        _balances[to] = _balances[to].add(value);

        emit Transfer(owner, to, value);
        emit Minted(serial, value);

        return true;
    }

    function decreaseFee(uint256 value) public onlyOwner() {
        require(value < fee, "New fee must be less than current fee");
        require(value >= 0, "Fee must be greater than or equal to zero");

        _lastUpdated = now;
        fee = value;
        
        emit FeeUpdated(fee);
    }

    function increaseFee() public onlyOwner() {
        require(now > _lastUpdated + 30 days, "Cannot update fee within 30 days of last change");
        
        _lastUpdated = now;
        fee = fee.add(FEE_INCREASE);
        
        emit FeeUpdated(fee);
    }

    function addToWhiteList(uint index, address who) public onlyOwner() {
        require(who != address(0), "Invalid address");
        _whiteList[index][who] = true;
    }

    function removeFromWhiteList(uint index, address who) public onlyOwner() {
        require(who != address(0), "Invalid address");
        delete _whiteList[index][who];
    }

    function inWhiteList(uint index, address who) public view returns (bool) {
        return _whiteList[index][who] == true || who == feeHolder || who == owner;
    }

    function inAnyWhiteList(address who) public view returns (bool) {
        return _whiteList[0][who] == true || _whiteList[1][who] == true || who == feeHolder || who == owner;
    }

    function updateBurner(address who) public onlyOwner() returns (bool) {
        require(who != address(0), "Invalid address");
        burner = who;
    }

    function updateMinter(address who) public onlyOwner() returns (bool) {
        require(who != address(0), "Invalid address");
        minter = who;
    }

    function updateFeeHolder(address who) public onlyOwner() returns (bool)  {
        require(who != address(0), "Invalid address");
        feeHolder = who;
    }

    function isFeeExempt(uint index, address who) public view returns (bool) {
        return _whiteList[index][who] == true || who == feeHolder || who == owner || who == burner || who == minter;
    }

    function pauseContract() public onlyOwner() {
        paused = true;
    }

    event FeeUpdated(uint256 value);
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
}