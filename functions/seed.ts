// functions/seed.ts  (run with `firebase functions:shell` or a one-off script)
import * as admin from "firebase-admin";
admin.initializeApp();
const db = admin.firestore();

const cards = [
  { name: "Chase Sapphire Preferred", issuer: "Chase", annualFee: 95, rewardRate: "2x travel/dining", signupBonus: "60k pts", benefits: ["No FX", "Travel insurance"], category: "travel" },
  // … add the rest from your old seedData …
];

async function seed() {
  const batch = db.batch();
  cards.forEach(c => {
    const ref = db.collection("cards").doc();
    batch.set(ref, c);
  });
  await batch.commit();
  console.log("Seeded cards");
}
seed();