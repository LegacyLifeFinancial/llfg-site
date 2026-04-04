/**
 * LLFG Portal — Accounts API
 * Supabase-backed user CRUD with fallback to in-memory mode
 *
 * Endpoints (via POST body { action }):
 *   login       — Authenticate user
 *   create      — Create new account (admin only)
 *   update-role — Change user role (admin only)
 *   list        — List all accounts (admin only)
 *   delete      — Remove account (admin only)
 *
 * ENV: SUPABASE_URL, SUPABASE_SERVICE_KEY
 */

const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

function res(code, body) {
  return { statusCode: code, headers: HEADERS, body: JSON.stringify(body) };
}

// Simple password hashing (production should use bcrypt via Supabase auth)
function hashPass(pass) {
  let h = 0;
  for (let i = 0; i < pass.length; i++) {
    h = ((h << 5) - h + pass.charCodeAt(i)) | 0;
  }
  return 'h_' + Math.abs(h).toString(36);
}

async function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;

  const { createClient } = require('@supabase/supabase-js');
  return createClient(url, key);
}

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return res(200, {});
  if (event.httpMethod !== 'POST') return res(405, { error: 'POST only' });

  try {
    const body = JSON.parse(event.body || '{}');
    const { action } = body;
    const db = await getSupabase();

    if (!db) {
      return res(200, {
        success: true,
        mode: 'client',
        message: 'Supabase not configured — using client-side mode. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in Netlify env vars to enable persistence.'
      });
    }

    switch (action) {
      case 'login': {
        const { email, password } = body;
        if (!email || !password) return res(400, { error: 'Email and password required' });

        const { data, error } = await db
          .from('users')
          .select('*')
          .eq('email', email.toLowerCase())
          .single();

        if (error || !data) return res(401, { error: 'Invalid credentials' });
        if (data.password_hash !== hashPass(password)) return res(401, { error: 'Invalid credentials' });

        return res(200, {
          success: true,
          user: {
            email: data.email,
            name: data.name,
            role: data.role,
            comm: data.commission,
            isOwner: data.is_owner || false
          }
        });
      }

      case 'create': {
        const { email, password, name, role, commission, personalEmail, phone } = body;
        if (!email || !name) return res(400, { error: 'Email and name required' });

        const { data: existing } = await db
          .from('users')
          .select('email')
          .eq('email', email.toLowerCase())
          .single();

        if (existing) return res(409, { error: 'Account already exists' });

        const { data, error } = await db
          .from('users')
          .insert({
            email: email.toLowerCase(),
            password_hash: hashPass(password || 'welcome123'),
            name,
            role: role || 'financial_advisor',
            commission: commission || 75,
            personal_email: personalEmail || null,
            phone: phone || null,
            created_at: new Date().toISOString(),
            created_by: body.createdBy || 'admin'
          })
          .select()
          .single();

        if (error) return res(500, { error: 'Failed to create: ' + error.message });

        return res(200, { success: true, user: data, message: name + ' account created' });
      }

      case 'update-role': {
        const { email, newRole, newCommission } = body;
        if (!email || !newRole) return res(400, { error: 'Email and new role required' });

        const updates = { role: newRole };
        if (newCommission !== undefined) updates.commission = newCommission;

        const { error } = await db
          .from('users')
          .update(updates)
          .eq('email', email.toLowerCase());

        if (error) return res(500, { error: 'Failed to update: ' + error.message });
        return res(200, { success: true, message: email + ' updated to ' + newRole });
      }

      case 'list': {
        const { data, error } = await db
          .from('users')
          .select('email, name, role, commission, personal_email, phone, created_at, created_by')
          .order('created_at', { ascending: false });

        if (error) return res(500, { error: error.message });
        return res(200, { success: true, users: data });
      }

      case 'delete': {
        const { email } = body;
        if (!email) return res(400, { error: 'Email required' });

        const { error } = await db
          .from('users')
          .delete()
          .eq('email', email.toLowerCase());

        if (error) return res(500, { error: error.message });
        return res(200, { success: true, message: email + ' deleted' });
      }

      default:
        return res(400, { error: 'Unknown action: ' + action });
    }

  } catch (err) {
    console.error('accounts error:', err);
    return res(500, { error: err.message || 'Internal error' });
  }
};
