import React, { useState, useEffect } from "react";
import { Scheduler } from "@aldabil/react-scheduler";

export default function ServersSchedule() {
    const [events, setEvents] = useState([]);
    const [step, setStep] = useState(240); // Default step for 3 shifts
    const [formData, setFormData] = useState({
      num_employees: "",
      shifts_per_day: "", // Default to 3 shifts
      total_days: "",
      employee_types: [],
    }); 

const fetchUserRoleAndData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const uid = user.uid;
          // Try fetching from 'employers' collection
          let userDocRef = doc(db, "employers", uid);
          let userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setRole("employer");
            setEmployerData(userDocSnap.data()); // Store employer data
          } else {
            // If not found, try 'employees' collection
            userDocRef = doc(db, "employees", uid);
            userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
              setRole("employee");
            } else {
              console.error("User role not found in Firestore.");
            }
          }
        } else {
          console.error("No user is signed in.");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

  };

    // Fetch server data from Firestore
    useEffect(() => {
        const fetchServers = async () => {
            try {
            const serversQuery = query(
                collection(db, "employees"),
                where("employeePosition", "==", "server") // Ensure it matches the Firestore field
            );
            const querySnapshot = await getDocs(serversQuery);

            const fetchedServers = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setServers(fetchedServers);

            setFormData((prev) => ({
                ...prev,
                num_employees: fetchedServers.length.toString(),
                employee_types: fetchedServers.map(() => "full_time"),
            }));

            // Fetch the last saved schedule when the page loads
            await fetchLastScheduleFromFirestore();
            } catch (error) {
            console.error("Error fetching servers from Firestore:", error);
            }
        };

        fetchServers(); // Call the function to fetch servers from Firestore
        }, []);
