// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Base is IERC20, Ownable {
    
    using SafeMath for uint;

    uint256 private _totalSupply;
    uint256 private _stockCount;

    mapping (bytes32 => uint256) public stock;
    
    address public minter;
    address public burner;

    mapping (address => uint256) private _balances;
    mapping (address => mapping (address => uint256)) private _allowed;

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

    function balanceOf(address who) public override view returns (uint256 balance) {
        balance = _balances[who];
    }

    function _transfer(address from, address to, uint256 value) internal {
        require(to != address(0), "Invalid to address");
        require(from != address(0), "Invalid from address");
        require(_balances[from] >= value, "Insufficient funds");

        _balances[from] = _balances[from].sub(value);
        _balances[to] = _balances[to].add(value);

        emit Transfer(from, to, value);
    }
    
    function transfer(address to, uint256 value) public override returns (bool) {
        _transfer(msg.sender, to, value);
        return true;
    }

    function allowance(address tokenOwner, address spender) public override view returns (uint remaining) {
        return _allowed[tokenOwner][spender];
    }

    function transferFrom(address from, address to, uint256 value) public override returns (bool success) {
        require(to != address(0), "Invalid address");

        _allowed[from][msg.sender] = _allowed[from][msg.sender].sub(value);
        _transfer(from, to, value);

        emit Approval(from, msg.sender, _allowed[from][msg.sender]);
        return true;
    }

    function approve(address spender, uint256 value) public override returns (bool) {
        require(spender != address(0), "Invalid address");

        _allowed[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function burn(bytes32 serial) public onlyBurner() {
        require(serial != 0x00, "Invalid location or serial");
        uint256 value = stock[serial];

        require(value > 0, "Invalid stock");
        require(_balances[owner()] >= value, "Cannot burn more than you own");

        stock[serial] = 0;
        _balances[owner()] = _balances[owner()].sub(value);

        _stockCount = _stockCount.sub(1);
        _totalSupply = _totalSupply.sub(value);

        emit Transfer(owner(), address(0), value);
        emit Burned(serial, value);
    }

    function mint(address to, bytes32 serial, uint256 value) public onlyMinter() returns(bool) {
        require(serial != 0x00, "Invalid location or serial");
        require(to != address(0), "Invalid to address");
        require(value > 0, "Amount must be greater than zero");

        stock[serial] = value;
        _stockCount = _stockCount.add(1);

        _totalSupply = _totalSupply.add(value);
        _balances[to] = _balances[to].add(value);

        emit Transfer(owner(), to, value);
        emit Minted(serial, value);

        return true;
    }

    function updateBurner(address who) public onlyOwner() returns (bool) {
        require(who != address(0), "Invalid address");
        burner = who;
    }

    function updateMinter(address who) public onlyOwner() returns (bool) {
        require(who != address(0), "Invalid address");
        minter = who;
    }

    event FeeUpdated(uint256 value);
    event Burned(bytes32 indexed serial, uint value);
    event Minted(bytes32 indexed serial, uint value);

    modifier onlyBurner() {
        require(burner == msg.sender, "Sender is not a burner");
        _;
    }

    modifier onlyMinter() {
        require(minter == msg.sender, "Sender is not a minter");
        _;
    }
}