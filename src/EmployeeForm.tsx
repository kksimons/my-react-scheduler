// // New Employee form
// import React, { useState } from 'react';
// import './App.css';
// function EmployeeForm() {

//     const EmployeeForm = () => {

//     const [values, setValues] = useState({
//         firstName: '',
//         lastName: '',
//         email: '',
//         phone: '',
//         employeeTpe: '',
//         gender: ''

//     })

//     const handleChanges = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
//         setValues({
//             ...values,
//             [e.target.name]: e.target.value
//         })
//     }

//     const handleSubmit = (e: { preventDefault: () => void; }) => {
//         e.preventDefault();
//         console.log(values);
//     }

//     const ResetFun = () => {
//         setValues({ firstName: '', lastName: '', email: '', phone: '', employeeTpe: '', gender: '' })
//     }

//         return (
//             <div className ="container">
//                 <h1>Form in react</h1>
//                 <form onSubmit={handleSubmit} >
//                     <label htmlFor="firstName">First Name*</label>
//                     <input type="text" placeholder="Enter First Name" 
//                     onChange={(e) => handleChanges(e)} required value={values.firstName}/>

//                     <label htmlFor="lastName">Last Name*</label>
//                     <input type="text" placeholder="Enter Last Name" 
//                     onChange={(e) => handleChanges(e)} required value={values.lastName}/>

//                     <label htmlFor="email">Email*</label>
//                     <input type="text" placeholder="Enter Email" 
//                     onChange={(e) => handleChanges(e)} required value={values.email}/>

//                     <label htmlFor="Phone">Phone*</label>
//                     <input type="text" placeholder="Enter Phone" 
//                     onChange={(e) => handleChanges(e)} required value={values.phone}/>

//                     <label htmlFor="employeeType">Employee Type*</label>
//                     <select name="employeeType" id="type" onChange={(e) => handleChanges(e)}>
//                         <option value="Full Time">Full Time</option>
//                         <option value="Part Time">Part Time</option>
//                         <option value="Contract">Contract</option>
//                     </select>

//                     <label htmlFor="gender">Gender*</label>
//                     <select name="gender" id="gender" onChange={(e) => handleChanges(e)}>
//                         <option value="male">Male</option>
//                         <option value="female">Female</option>
//                         <option value="otherGender">Other</option>
//                     </select>

                    
//                     <button type="reset" onClick={ResetFun}>Reset</button>
//                     <button type="submit" >Submit</button>

//                 </form>
//             </div>
//         );        
//     }

// }
// export default EmployeeForm;
