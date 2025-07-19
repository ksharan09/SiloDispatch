// File: src/api/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fsqhzgshabpekccahhtx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzcWh6Z3NoYWJwZWtjY2FoaHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NjcxMjIsImV4cCI6MjA2ODM0MzEyMn0.vmGG_HR_v5ooRMJO5zzXb7OdmPDv-RFX0U1l7WSHS4U';

export const supabase = createClient(supabaseUrl, supabaseKey);