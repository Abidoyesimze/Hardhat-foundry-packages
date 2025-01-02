// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Token {
    string public name = "SimpleToken";  // Token name
    string public symbol = "STK";        // Token symbol
    uint8 public decimals = 18;          // Token decimals (standard is 18)
    uint256 public totalSupply;          // Total supply of tokens
    mapping(address => uint256) public balanceOf;  // Mapping of token balances
    mapping(address => mapping(address => uint256)) public allowance;  // Mapping of allowances

    // Event to log transfers
    event Transfer(address indexed from, address indexed to, uint256 value);
    
    // Event to log approval
    event Approval(address indexed owner, address indexed spender, uint256 value);

    // Constructor is omitted, minting will be handled by a custom function

    // Transfer tokens from one address to another
    function transfer(address recipient, uint256 amount) public returns (bool) {
        require(recipient != address(0), "ERC20: transfer to the zero address");
        require(balanceOf[msg.sender] >= amount, "ERC20: insufficient balance");

        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    // Allow another address to spend tokens on behalf of the caller
    function approve(address spender, uint256 amount) public returns (bool) {
        require(spender != address(0), "ERC20: approve to the zero address");
        
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    // Transfer tokens on behalf of someone else, using an allowance
    function transferFrom(address sender, address recipient, uint256 amount) public returns (bool) {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");
        require(balanceOf[sender] >= amount, "ERC20: insufficient balance");
        require(allowance[sender][msg.sender] >= amount, "ERC20: allowance exceeded");

        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        allowance[sender][msg.sender] -= amount;
        
        emit Transfer(sender, recipient, amount);
        return true;
    }

    // Mint function to create new tokens
    function mint(address account, uint256 amount) public {
        require(account != address(0), "ERC20: mint to the zero address");
        
        totalSupply += amount;
        balanceOf[account] += amount;

        emit Transfer(address(0), account, amount);  // Log mint event
    }
}