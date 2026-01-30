-- 1. Tabla de Usuarios (Aquí van tus 2 logins y más)
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('super_admin', 'admin', 'recruiter', 'candidate')),
    name TEXT,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Empresas (Clientes que buscan personal)
CREATE TABLE companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    industry TEXT,
    website TEXT
);

-- 3. Tabla de Vacantes (Los avisos de trabajo)
CREATE TABLE jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    salary_range TEXT,
    status TEXT DEFAULT 'active', -- active, closed, draft
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- INSERCIÓN DE TUS USUARIOS INICIALES
INSERT INTO users (username, password, role, name) VALUES 
('Gemini', 'Gemini2025!', 'super_admin', 'Super Admin'),
('editor', 'password123', 'admin', 'Job Editor');