const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

async function main() {
  const argv = process.argv.slice(2);
  if (argv.length < 1) {
    console.error('Usage: node scripts/set-premium.js <uid> [days]');
    process.exit(1);
  }

  const uid = argv[0];
  const days = parseInt(argv[1], 10) || 365; // default 1 year

  const serviceAccountPath = path.resolve(process.cwd(), 'firebase-service-account.json');
  if (!fs.existsSync(serviceAccountPath)) {
    console.error('firebase-service-account.json not found in repo root.');
    process.exit(1);
  }

  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  const db = admin.firestore();

  const expiryTime = Date.now() + days * 24 * 60 * 60 * 1000;

  const userDoc = db.collection('users').doc(uid);

  const data = {
    isPremium: true,
    premiumType: 'premium',
    lastSubscriptionCheck: Date.now(),
    subscription: {
      subscriptionId: 'manually-granted-premium',
      isActive: true,
      autoRenewing: false,
      purchaseToken: `manual_${Date.now()}`,
      expiryTime,
      lastVerified: Date.now(),
    },
    purchases: [],
    hasRemovedAds: true,
  };

  try {
    await userDoc.set(data, { merge: true });
    console.log(`User ${uid} updated as premium (expiry ${new Date(expiryTime).toISOString()})`);
    process.exit(0);
  } catch (err) {
    console.error('Failed to update user document:', err);
    process.exit(1);
  }
}

main();
