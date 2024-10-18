export interface EmployeeData {
    icon: any;
    employeeFname: string;
    employeeLname: string;
    employeeDob: string;
    employeePhone: string;
    employeeEmail: string;
    employeeType: string;
    employeePosition: string;
    employeeSystem: string;
    employeeAvailability: {
      [key: string]: string[];
    };
  }

  export interface SignInEmployeeData {
    employeeFname: string;
    employeeLname: string;
    employeePosition: string;
    employeeEmail: string;
  }