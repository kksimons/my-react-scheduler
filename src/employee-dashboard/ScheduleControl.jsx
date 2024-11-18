import { useEffect, useState } from "react";
import { db } from "../userAuth/firebase";
import { collection, query } from "firebase/firestore";
import ScheduleBatchCard from "./ScheduleBatchCard";

const ScheduleControl = () => {
  const [scheduleBatches, setScheduleBatches] = useState([]);

  useEffect(() => {
    const fetchScheduleBatches = async () => {
      try {
        const batchesRef = collection(db, "scheduleBatches");
        const q = query(
          batchesRef,
          where(
            "scheduleType",
            "==",
            isKitchen ? "Kitchen Side" : "Dining Side"
          )
        );
        const querySnapshot = await getDocs(q);
        const batches = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setScheduleBatches(batches);
      } catch (error) {
        console.error("Error fetching schedule batches:", error);
      }
    };

    fetchScheduleBatches();
  }, [isKitchen]);

  // In your render method
  return (
    <div>
      <Button onClick={handleGenerateClick}>Generate Auto Schedule</Button>
      {/* Display schedule batches */}
      <div>
        {scheduleBatches.map((batch) => (
          <ScheduleBatchCard
            key={batch.id}
            batch={batch}
            onPublish={handlePublishBatch}
            onDelete={handleDeleteBatch}
            onView={handleViewBatch}
          />
        ))}
      </div>
    </div>
  );
};

export default ScheduleControl;
