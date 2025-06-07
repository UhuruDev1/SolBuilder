-- Initialize Solana AI Builder Database
-- This script creates the necessary tables for storing programs, wallets, and transactions

-- Programs table - stores compiled wallet control programs
CREATE TABLE IF NOT EXISTS programs (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    version VARCHAR(50) DEFAULT '1.0.0',
    network VARCHAR(20) NOT NULL CHECK (network IN ('devnet', 'testnet', 'mainnet')),
    program_json TEXT NOT NULL,
    bytecode TEXT,
    estimated_gas INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Wallets table - stores generated wallet information
CREATE TABLE IF NOT EXISTS wallets (
    id SERIAL PRIMARY KEY,
    public_key VARCHAR(255) UNIQUE NOT NULL,
    private_key_encrypted TEXT NOT NULL,
    network VARCHAR(20) NOT NULL CHECK (network IN ('devnet', 'testnet', 'mainnet')),
    balance DECIMAL(20, 9) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table - stores transaction history
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    signature VARCHAR(255) UNIQUE NOT NULL,
    wallet_id INTEGER REFERENCES wallets(id),
    program_id VARCHAR(255) REFERENCES programs(id),
    transaction_type VARCHAR(50) NOT NULL,
    amount DECIMAL(20, 9),
    recipient VARCHAR(255),
    network VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
    gas_used INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Simulations table - stores simulation results
CREATE TABLE IF NOT EXISTS simulations (
    id SERIAL PRIMARY KEY,
    program_id VARCHAR(255) REFERENCES programs(id),
    network VARCHAR(20) NOT NULL,
    total_gas_used INTEGER,
    execution_time INTEGER,
    steps_completed INTEGER,
    total_steps INTEGER,
    success BOOLEAN,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Method library table - stores available blockchain methods
CREATE TABLE IF NOT EXISTS methods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    parameters TEXT,
    returns VARCHAR(255),
    example TEXT,
    gas_estimate INTEGER DEFAULT 0,
    sdk_type VARCHAR(50) NOT NULL CHECK (sdk_type IN ('solana', 'raydium', 'spl-token')),
    is_active BOOLEAN DEFAULT true
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_programs_network ON programs(network);
CREATE INDEX IF NOT EXISTS idx_programs_created_at ON programs(created_at);
CREATE INDEX IF NOT EXISTS idx_wallets_network ON wallets(network);
CREATE INDEX IF NOT EXISTS idx_wallets_public_key ON wallets(public_key);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_transactions_network ON transactions(network);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_simulations_program_id ON simulations(program_id);
CREATE INDEX IF NOT EXISTS idx_methods_category ON methods(category);
CREATE INDEX IF NOT EXISTS idx_methods_sdk_type ON methods(sdk_type);

-- Insert sample method data
INSERT INTO methods (name, category, description, parameters, returns, example, gas_estimate, sdk_type) VALUES
('getAccountInfo', 'Account', 'Get account information for a given public key', 'publicKey: PublicKey, commitment?: Commitment', 'Promise<AccountInfo<Buffer> | null>', 'await connection.getAccountInfo(publicKey)', 0, 'solana'),
('getBalance', 'Account', 'Get the balance of an account in lamports', 'publicKey: PublicKey, commitment?: Commitment', 'Promise<number>', 'await connection.getBalance(publicKey)', 0, 'solana'),
('sendTransaction', 'Transaction', 'Send a signed transaction to the network', 'transaction: Transaction, signers: Signer[]', 'Promise<TransactionSignature>', 'await connection.sendTransaction(transaction, [payer])', 5000, 'solana'),
('swap', 'Trading', 'Execute a token swap through Raydium', 'swapParams: SwapParams', 'Promise<TransactionSignature>', 'await raydium.swap({ tokenIn, tokenOut, amountIn, slippage })', 15000, 'raydium'),
('addLiquidity', 'Liquidity', 'Add liquidity to a pool', 'poolId: PublicKey, tokenAAmount: number, tokenBAmount: number', 'Promise<TransactionSignature>', 'await raydium.addLiquidity(poolId, amountA, amountB)', 25000, 'raydium'),
('createMint', 'Token', 'Create a new SPL token mint', 'connection: Connection, payer: Signer, mintAuthority: PublicKey, freezeAuthority: PublicKey, decimals: number', 'Promise<PublicKey>', 'await createMint(connection, payer, mintAuthority, null, 9)', 10000, 'spl-token'),
('transfer', 'Token', 'Transfer tokens between accounts', 'connection: Connection, payer: Signer, source: PublicKey, destination: PublicKey, owner: Signer, amount: number', 'Promise<TransactionSignature>', 'await transfer(connection, payer, source, destination, owner, amount)', 6000, 'spl-token')
ON CONFLICT (name) DO NOTHING;
