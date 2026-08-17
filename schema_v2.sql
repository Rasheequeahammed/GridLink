-- WARNING: This will drop your existing clients and attendance records.
-- Run this in the Supabase SQL Editor to upgrade the schema.

DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS clients;

-- 1. Create the new Clients table
CREATE TABLE clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  manager_id UUID REFERENCES profiles(id) NOT NULL,
  client_name TEXT NOT NULL,
  client_address TEXT,
  client_contact TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create the new Tasks table (1 Client has N Tasks)
CREATE TABLE tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  task_description TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Recreate Attendance table linking to Tasks
CREATE TABLE attendance (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  employee_id UUID REFERENCES profiles(id) NOT NULL,
  task_id UUID REFERENCES tasks(id) NOT NULL,
  clock_in TIMESTAMP WITH TIME ZONE NOT NULL,
  clock_out TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
