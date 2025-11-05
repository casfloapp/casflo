CREATE TABLE _cf_KV (
        key TEXT PRIMARY KEY,
        value BLOB
      ) WITHOUT ROWID
CREATE TABLE accounts (
    id TEXT PRIMARY KEY,
    wallet_id TEXT NOT NULL,
    name TEXT NOT NULL, -- misal: 'BCA', 'Dompet Tunai', 'Kartu Kredit Mandiri'
    type TEXT NOT NULL CHECK(type IN ('ASSET', 'LIABILITY')),
    balance INTEGER NOT NULL DEFAULT 0, -- Saldo awal dalam satuan terkecil (sen)
    is_archived INTEGER DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE
)
CREATE TABLE budget_categories (
    budget_id TEXT NOT NULL,
    category_id TEXT NOT NULL,
    PRIMARY KEY (budget_id, category_id),
    FOREIGN KEY (budget_id) REFERENCES budgets(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
)
CREATE TABLE budgets (
    id TEXT PRIMARY KEY,
    wallet_id TEXT NOT NULL,
    name TEXT NOT NULL, -- misal: 'Anggaran Bulanan'
    amount INTEGER NOT NULL, -- Total budget dalam satuan terkecil
    period TEXT NOT NULL CHECK(period IN ('MONTHLY', 'WEEKLY')),
    start_date DATE NOT NULL,
    created_at DATETIME NOT NULL DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE
)
CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    wallet_id TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'INCOME' or 'EXPENSE'
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE
)
CREATE TABLE contacts (
    id TEXT PRIMARY KEY,
    wallet_id TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    description TEXT,
    created_at DATETIME NOT NULL DEFAULT (datetime('now','localtime')),
    created_by TEXT NOT NULL,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id)
)
CREATE TABLE goals (
    id TEXT PRIMARY KEY,
    wallet_id TEXT NOT NULL,
    name TEXT NOT NULL,
    target_amount INTEGER NOT NULL,
    current_amount INTEGER NOT NULL DEFAULT 0,
    target_date DATE,
    icon TEXT,
    is_achieved INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE
)
CREATE TABLE notes (
    id TEXT PRIMARY KEY,
    wallet_id TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    note_date DATE NOT NULL,
    created_at DATETIME NOT NULL DEFAULT (datetime('now','localtime')),
    created_by TEXT NOT NULL,
    updated_at DATETIME,
    updated_by TEXT,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id)
)
CREATE TABLE recurring_transactions (
    id TEXT PRIMARY KEY,
    wallet_id TEXT NOT NULL,
    description TEXT NOT NULL,
    amount INTEGER NOT NULL, -- Jumlah dalam satuan terkecil
    type TEXT NOT NULL, -- 'INCOME' or 'EXPENSE'
    frequency TEXT NOT NULL CHECK(frequency IN ('DAILY', 'WEEKLY', 'MONTHLY')),
    start_date DATE NOT NULL,
    next_due_date DATE NOT NULL,
    -- Info untuk membuat transaksi otomatis
    category_id TEXT,
    source_account_id TEXT, -- Akun sumber (misal: Bank untuk bayar tagihan)
    destination_account_id TEXT, -- Akun tujuan (misal: Kas untuk terima gaji)
    contact_id TEXT,
    is_active INTEGER DEFAULT 1,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (source_account_id) REFERENCES accounts(id),
    FOREIGN KEY (destination_account_id) REFERENCES accounts(id)
)
CREATE TABLE reminders (
    id TEXT PRIMARY KEY,
    wallet_id TEXT NOT NULL,
    description TEXT NOT NULL,
    amount INTEGER, -- Jumlah tagihan (opsional), simpan dalam sen
    reminder_date TEXT NOT NULL, -- Format 'YYYY-MM-DD'
    is_active INTEGER NOT NULL DEFAULT 1, -- 1 = aktif, 0 = tidak aktif/selesai
    created_at DATETIME NOT NULL DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE
)
CREATE TABLE transaction_splits (
    id TEXT PRIMARY KEY,
    transaction_id TEXT NOT NULL,
    account_id TEXT NOT NULL,
    category_id TEXT, -- Bisa NULL untuk transfer antar akun
    amount INTEGER NOT NULL, -- Jumlah dalam satuan terkecil
    type TEXT NOT NULL, -- 'DEBIT' atau 'CREDIT'
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE RESTRICT,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
)
CREATE TABLE transactions (
    id TEXT PRIMARY KEY,
    wallet_id TEXT NOT NULL,
    contact_id TEXT,
    description TEXT,
    transaction_date DATE NOT NULL,
    created_at DATETIME NOT NULL DEFAULT (datetime('now','localtime')),
    created_by TEXT NOT NULL,
    updated_at DATETIME,
    updated_by TEXT,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
    FOREIGN KEY (contact_id) REFERENCES contacts(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id)
)
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone_number TEXT,
    google_id TEXT UNIQUE,
    avatar_url TEXT,
    hashed_password TEXT,
    is_email_verified INTEGER DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT (datetime('now','localtime'))
)
CREATE TABLE verification_codes (
    email TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    expires_at DATETIME NOT NULL
)
CREATE TABLE wallet_members (
    wallet_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL, -- 'OWNER', 'ADMIN', 'VIEWER'
    PRIMARY KEY (wallet_id, user_id),
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)
CREATE TABLE wallet_settings (
    wallet_id TEXT PRIMARY KEY,
    start_of_month INTEGER DEFAULT 1, -- Tanggal mulai bulan (misal: 1 atau 25)
    theme TEXT DEFAULT 'SYSTEM', language TEXT DEFAULT 'id-ID', haptic_feedback_enabled INTEGER DEFAULT 1, calculator_layout TEXT DEFAULT 'default', sound_effects_enabled INTEGER DEFAULT 1,
    -- Tambahkan kolom lain sesuai kebutuhan
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE
)
CREATE TABLE wallets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    module_type TEXT NOT NULL, -- 'FAMILY', 'RT', 'MASJID', 'GENERAL'
    created_at DATETIME NOT NULL DEFAULT (datetime('now','localtime')),
    created_by TEXT NOT NULL,
    updated_at DATETIME,
    updated_by TEXT,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id)
)