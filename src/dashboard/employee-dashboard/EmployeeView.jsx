import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const EmployeeView = () => {
  const [employeeSystem, setEmployeeSystem] = useState(null);
  const { currentUser, userRole } = useAuth();

if (!currentUser || userRole !== 'employee') {
  return <Navigate to="/login" />;
}


  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const docRef = doc(db, "employees", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setEmployeeSystem(data.employee_system); // 'Dining Side' or 'Kitchen Side'
        } else {
          console.error("No such employee document!");
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    if (currentUser) {
      fetchEmployeeData();
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const schedulesRef = collection(db, "schedules");
        const q = query(
          schedulesRef,
          where("scheduleType", "==", employeeSystem),
          where("published", "==", true)
        );

        const querySnapshot = await getDocs(q);
        const schedules = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          start: doc.data().start.toDate(),
          end: doc.data().end.toDate(),
        }));

        setEvents(schedules);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };

    if (employeeSystem) {
      fetchSchedules();
    }
  }, [employeeSystem]);

  return (
    <>
      <DnDCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        views={["week", "day", "agenda"]}
        defaultView="week"
        selectable={false}
        toolbar={true}
        popup={true}
      />
    </>
  );
};

export default EmployeeView;
