// netlify/functions/send-code.js
const https = require('https');

const CODE_STORE = {};

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function sendEmail(to, code) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) return reject(new Error('SENDGRID_API_KEY not set'));

    const body = JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: 'noreply@llfg.us', name: 'Legacy Life Financial Group' },
      subject: 'Your LLFG Portal Login Code',
      content: [
        {
          type: 'text/html',
          value: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:480px;margin:40px auto;background:#111;border:1px solid rgba(201,168,76,0.25);">
    <div style="background:#c9a84c;height:4px;"></div>
    <div style="padding:36px 32px;">
      <div style="font-size:11px;letter-spacing:3p
