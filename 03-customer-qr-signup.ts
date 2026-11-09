// TIMBRYF - Customer Signup via QR
// File: /app/c/[merchantId]/page.tsx
// Flow: Scan QR -> Form Name + Phone + GDPR consent -> Create customer + card

// Steps:
// 1. Read merchantId from URL: timbryf.vercel.app/c/xxxx
// 2. Fetch merchant: business_name, logo, card_color, reward_text
// 3. Show form: Nome, Telefono, Checkbox GDPR "Accetto di ricevere offerte"
// 4. On submit:
//    - Insert into customers (merchant_id, name, phone, consent_gdpr=true)
//    - Insert into cards (merchant_id, customer_id, current_stamps=0)
//    - Show success: "Carta creata!" + Button "Aggiungi a Google Wallet" (free)
//    - For iPhone: Show "Salva nei Preferiti" until Apple Developer is activated
// 5. Languages: it / ar / en / fr - all texts from /lib/i18n.ts