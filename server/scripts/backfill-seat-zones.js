const path = require("path");
const dotenv = require("dotenv");
const connectDb = require("../utils/db");
const Event = require("../models/event-model");
const { serializeEvent } = require("../controllers/event-controller");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const backfillSeatZones = async () => {
  await connectDb();

  const events = await Event.find({}).lean();
  let updatedCount = 0;

  for (const event of events) {
    if (Array.isArray(event.seatZones) && event.seatZones.length > 0) {
      continue;
    }

    const serialized = serializeEvent(event);
    const nextPrice = serialized.price;
    const nextSeatZones = serialized.seatZones || [];

    await Event.updateOne(
      { _id: event._id },
      {
        $set: {
          price: nextPrice,
          seatZones: nextSeatZones,
        },
      }
    );

    updatedCount += 1;
  }

  console.log(`seat-zones-updated:${updatedCount}`);
  process.exit(0);
};

backfillSeatZones().catch((error) => {
  console.error("seat-zones-backfill-failed", error);
  process.exit(1);
});
