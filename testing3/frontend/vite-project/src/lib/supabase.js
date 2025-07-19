import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yvtccqdgbtorymyhqjds.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2dGNjcWRnYnRvcnlteWhxamRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4OTkxMzksImV4cCI6MjA2ODQ3NTEzOX0.xL2YYwYhn08D_CwPk9RQ9Jdx4fAkjSz7ZUAS1BTVlpk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
