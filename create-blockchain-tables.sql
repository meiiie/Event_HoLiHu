-- Tạo bảng blockchain_events để lưu trữ các sự kiện
CREATE TABLE IF NOT EXISTS blockchain_events (
  id SERIAL PRIMARY KEY,
  event_id TEXT UNIQUE NOT NULL,
  contract_name TEXT NOT NULL,
  contract_address TEXT NOT NULL,
  event_name TEXT NOT NULL,
  transaction_hash TEXT NOT NULL,
  block_number BIGINT NOT NULL,
  timestamp BIGINT NOT NULL,
  data JSONB NOT NULL,
  event_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo bảng contract_configs để lưu trữ cấu hình theo dõi hợp đồng
CREATE TABLE IF NOT EXISTS contract_configs (
  id SERIAL PRIMARY KEY,
  contract_name TEXT NOT NULL,
  contract_address TEXT NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  from_block BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(contract_name, contract_address)
);

-- Tạo bảng event_statistics để lưu trữ thống kê sự kiện
CREATE TABLE IF NOT EXISTS event_statistics (
  id SERIAL PRIMARY KEY,
  total_events INTEGER DEFAULT 0,
  events_by_contract JSONB DEFAULT '{}'::jsonb,
  events_by_type JSONB DEFAULT '{}'::jsonb,
  events_per_hour FLOAT DEFAULT 0,
  last_event_time BIGINT DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo bảng blockchain_sessions để lưu trữ thông tin phiên theo dõi
CREATE TABLE IF NOT EXISTS blockchain_sessions (
  id SERIAL PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  election_address TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_block_processed BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo bảng election_data để lưu trữ thông tin cuộc bầu cử
CREATE TABLE IF NOT EXISTS election_data (
  id SERIAL PRIMARY KEY,
  election_id TEXT UNIQUE NOT NULL,
  server_id BIGINT NOT NULL,
  election_address TEXT NOT NULL,
  owner_address TEXT NOT NULL,
  start_time BIGINT NOT NULL,
  end_time BIGINT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo bảng election_sessions để lưu trữ thông tin phiên bầu cử
CREATE TABLE IF NOT EXISTS election_sessions (
  id SERIAL PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  election_id TEXT NOT NULL,
  start_time BIGINT NOT NULL,
  end_time BIGINT NOT NULL,
  status TEXT NOT NULL,
  elected_candidates JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (election_id) REFERENCES election_data(election_id) ON DELETE CASCADE
);

-- Tạo bảng candidates để lưu trữ thông tin ứng viên
CREATE TABLE IF NOT EXISTS candidates (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  candidate_address TEXT NOT NULL,
  candidate_name TEXT,
  vote_count BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, candidate_address),
  FOREIGN KEY (session_id) REFERENCES election_sessions(session_id) ON DELETE CASCADE
);

-- Tạo bảng voters để lưu trữ thông tin cử tri
CREATE TABLE IF NOT EXISTS voters (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  voter_address TEXT NOT NULL,
  ballot_token_id BIGINT,
  has_voted BOOLEAN DEFAULT FALSE,
  voted_for TEXT,
  voted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, voter_address),
  FOREIGN KEY (session_id) REFERENCES election_sessions(session_id) ON DELETE CASCADE
);

-- Khởi tạo bản ghi thống kê
INSERT INTO event_statistics (id, total_events, events_by_contract, events_by_type, events_per_hour, last_event_time, updated_at)
VALUES (1, 0, '{}'::jsonb, '{}'::jsonb, 0, 0, NOW())
ON CONFLICT (id) DO NOTHING;
