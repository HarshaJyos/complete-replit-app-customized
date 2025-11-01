import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import cors from "cors";

admin.initializeApp();
const db = admin.firestore();

const corsHandler = cors({ origin: true });

/* ---------- Helper: verify token ---------- */
const verify = async (req: functions.Request) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) throw new Error("Unauthenticated");
  const token = auth.split("Bearer ")[1];
  return await admin.auth().verifyIdToken(token);
};

/* ---------- USER PROFILE ---------- */
export const users = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const uid = await verify(req).then(t => t.uid);
      const userRef = db.collection("users").doc(uid);

      if (req.method === "POST") {
        const data = { ...req.body, userId: uid };
        await userRef.set(data, { merge: true });
        return res.json({ success: true, data });
      }

      if (req.method === "GET") {
        const snap = await userRef.get();
        return res.json({ success: true, data: snap.exists ? snap.data() : null });
      }

      if (req.method === "PUT") {
        await userRef.update(req.body);
        const snap = await userRef.get();
        return res.json({ success: true, data: snap.data() });
      }

      res.status(405).send("Method Not Allowed");
    } catch (e: any) {
      res.status(401).json({ success: false, error: e.message });
    }
  });
});

/* ---------- STATIC CARDS ---------- */
export const cards = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      await verify(req);
      const snap = await db.collection("cards").get();
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      res.json({ success: true, data });
    } catch (e: any) {
      res.status(401).json({ success: false, error: e.message });
    }
  });
});

/* ---------- RECOMMENDATIONS ---------- */
const calculateScore = (profile: any, card: any) => {
  let score = 60;
  if (["excellent", "very good"].includes(profile.creditScore)) score += 20;
  if (profile.creditScore === "poor") score -= 20;
  if (profile.primarySpendingCategory === card.category) score += 15;
  if (profile.annualIncome > 100_000) score += 10;
  if (card.annualFee > 100 && profile.annualIncome < 50_000) score -= 15;
  return Math.min(100, Math.max(0, Math.round(score)));
};

export const recommendations = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const uid = (await verify(req)).uid;
      const userRef = db.collection("users").doc(uid);
      const recRef = db.collection("recommendations").doc(uid).collection("items");

      if (req.method === "GET") {
        const snap = await recRef.orderBy("matchScore", "desc").get();
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        res.json({ success: true, data });
        return;
      }

      if (req.method === "POST") {
        const profileSnap = await userRef.get();
        if (!profileSnap.exists) throw new Error("Profile missing");
        const profile = profileSnap.data()!;

        const cardsSnap = await db.collection("cards").get();
        const cards = cardsSnap.docs.map(d => ({ id: d.id, ...d.data() as { category: string } }));

        const batch = db.batch();
        cards.forEach(card => {
          const recDoc = recRef.doc();
          batch.set(recDoc, {
            creditCardId: card.id,
            creditCard: card,
            matchScore: calculateScore(profile, card),
            reasonCode: JSON.stringify({
              creditScore: profile.creditScore,
              categoryMatch: profile.primarySpendingCategory === card.category,
              income: profile.annualIncome,
            }),
          });
        });
        await batch.commit();
        const fresh = await recRef.orderBy("matchScore", "desc").get();
        const data = fresh.docs.map(d => ({ id: d.id, ...d.data() }));
        res.json({ success: true, data });
        return;
      }

      res.status(405).send("Method Not Allowed");
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  });
});

/* ---------- APPLICATIONS ---------- */
export const applications = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const uid = (await verify(req)).uid;
      const appRef = db.collection("applications").doc(uid).collection("items");

      if (req.method === "POST") {
        const { creditCardId } = req.body;
        const cardSnap = await db.collection("cards").doc(creditCardId).get();
        if (!cardSnap.exists) throw new Error("Card not found");

        const appDoc = appRef.doc();
        await appDoc.set({
          creditCardId,
          creditCard: { id: cardSnap.id, ...cardSnap.data() },
          status: "pending",
          appliedAt: new Date().toISOString(),
        });

        // ----- Notification -----
        const notifRef = db.collection("notifications").doc(uid).collection("items");
        const notifDoc = notifRef.doc();
        await notifDoc.set({
          message: `Your application for ${cardSnap.data()!.name} is pending.`,
          read: false,
          createdAt: new Date().toISOString(),
        });

        // Push (if token exists)
        const profile = (await db.collection("users").doc(uid).get()).data();
        if (profile?.pushToken) {
          await admin.messaging().send({
            token: profile.pushToken,
            notification: {
              title: "Application Submitted",
              body: `Your application for ${cardSnap.data()!.name} is pending.`,
            },
          });
        }

        const fresh = await appDoc.get();
        res.json({ success: true, data: { id: fresh.id, ...fresh.data() } });
        return;
      }

      if (req.method === "GET") {
        const snap = await appRef.get();
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        res.json({ success: true, data });
        return;
      }

      res.status(405).send();
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  });
});

/* ---------- NOTIFICATIONS ---------- */
export const notifications = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const uid = (await verify(req)).uid;
      const notifRef = db.collection("notifications").doc(uid).collection("items");

      if (req.method === "GET") {
        const snap = await notifRef.orderBy("createdAt", "desc").get();
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        res.json({ success: true, data });
        return;
      }

      if (req.method === "PUT") {
        const { read } = req.body;
        await db.doc(`notifications/${uid}/items/${req.params[0]}`).update({ read });
        res.json({ success: true });
        return;
      }

      res.status(405).send();
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  });
});