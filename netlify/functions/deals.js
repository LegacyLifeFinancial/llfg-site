/**
 * LLFG Portal — Deals & Commissions API
 * Persists agent deals to Supabase, calculates commissions
 *
 * Endpoints (via POST body { action }):
 *   save-deal      — Save a new deal
 *   list-deals     — Get deals for an agent (or all for admin)
 *   delete-deal    — Remove a deal
 *   get-commissions — Calculate commission summary for agent/team
 *   get-team-data  — Get aggregated team metrics (replaces TEAM_DATA)
 *
 * ENV: SUPABASE_URL, SUPABASE_SERVICE_KEY
 */

const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

function res(code, body) {
  return { statusCode: code, headers: HEADERS, body: JSON.stringify(body) };
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
        message: 'Supabase not configured — using client-side storage. Set SUPABASE_URL and SUPABASE_SERVICE_KEY to enable.'
      });
    }

    switch (action) {
      case 'save-deal': {
        const { agentEmail, client, policy, carrier, policyNumber, premium, draftDate, commission } = body;
        if (!agentEmail || !client || !premium) return res(400, { error: 'agentEmail, client, premium required' });

        const ap = premium * 12;
        const advancePay = Math.round(ap * 0.75);
        const myPay = Math.round(advancePay * ((commission || 75) / 100));

        const { data, error } = await db
          .from('deals')
          .insert({
            agent_email: agentEmail.toLowerCase(),
            client_name: client,
            policy_name: policy || '',
            carrier: carrier || '',
            policy_number: policyNumber || '',
            monthly_premium: premium,
            advance_pay: advancePay,
            agent_pay: myPay,
            commission_pct: commission || 75,
            draft_date: draftDate || null,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) return res(500, { error: 'Save failed: ' + error.message });
        return res(200, { success: true, deal: data, message: 'Deal saved — AP: $' + ap.toLocaleString() });
      }

      case 'list-deals': {
        const { agentEmail, all } = body;
        let query = db.from('deals').select('*').order('created_at', { ascending: false });

        if (!all && agentEmail) {
          query = query.eq('agent_email', agentEmail.toLowerCase());
        }

        const { data, error } = await query;
        if (error) return res(500, { error: error.message });

        const totalAP = data.reduce((s, d) => s + d.annual_premium, 0);
        const totalPay = data.reduce((s, d) => s + d.agent_pay, 0);

        return res(200, {
          success: true,
          deals: data,
          summary: { count: data.length, totalAP, totalPay }
        });
      }

      case 'delete-deal': {
        const { dealId } = body;
        if (!dealId) return res(400, { error: 'dealId required' });

        const { error } = await db.from('deals').delete().eq('id', dealId);
        if (error) return res(500, { error: error.message });
        return res(200, { success: true, message: 'Deal deleted' });
      }

      case 'get-commissions': {
        const { agentEmail } = body;
        let query = db.from('deals').select('*');
        if (agentEmail) query = query.eq('agent_email', agentEmail.toLowerCase());

        const { data, error } = await query;
        if (error) return res(500, { error: error.message });

        const totalAP = data.reduce((s, d) => s + d.annual_premium, 0);
        const totalAdvance = data.reduce((s, d) => s + d.advance_pay, 0);
        const totalPay = data.reduce((s, d) => s + d.agent_pay, 0);
        const avgComm = data.length > 0
          ? Math.round(data.reduce((s, d) => s + d.commission_pct, 0) / data.length)
          : 0;

        return res(200, {
          success: true,
          commissions: {
            totalAP, totalAdvance, totalPay, avgComm,
            dealCount: data.length,
            monthlyAvg: Math.round(totalPay / Math.max(1, new Set(data.map(d => d.created_at.slice(0, 7))).size))
          }
        });
      }

      case 'get-team-data': {
        // Aggregate deals by team — requires users table to have team assignments
        const { data: deals, error: dErr } = await db.from('deals').select('*');
        const { data: users, error: uErr } = await db.from('users').select('email, name, role, commission, team');

        if (dErr || uErr) return res(500, { error: (dErr || uErr).message });

        // Group by team
        const teams = {};
        (users || []).forEach(u => {
          const team = u.team || 'Unassigned';
          if (!teams[team]) teams[team] = { name: team, agents: [], totalAP: 0 };
          const agentDeals = (deals || []).filter(d => d.agent_email === u.email);
          const ap = agentDeals.reduce((s, d) => s + d.annual_premium, 0);
          teams[team].agents.push({
            name: u.name, email: u.email, role: u.role, comm: u.commission, ap,
            moP: Math.round(ap / 12)
          });
          teams[team].totalAP += ap;
        });

        return res(200, { success: true, teams: Object.values(teams) });
      }

      default:
        return res(400, { error: 'Unknown action: ' + action });
    }

  } catch (err) {
    console.error('deals error:', err);
    return res(500, { error: err.message || 'Internal error' });
  }
};
