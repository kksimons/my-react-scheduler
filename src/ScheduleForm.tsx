// New Schedule form
import React, { useState } from 'react';
import './App.css';
function ScheduleForm() {

    const ScheduleForm = () => {

        const [values, setValues] = useState({
            employeeCount: '',
            shiftsPerDay: '',
            totalDays: '',
            employeeType: '',

        })

        const handleChanges = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
            setValues({
                ...values,
                [e.target.name]: e.target.value
            })
        }

        const handleSubmit = (e: { preventDefault: () => void; }) => {
            e.preventDefault();
            console.log(values);
        }

        const ResetFun = () => {
            setValues({ employeeCount: '', shiftsPerDay: '', totalDays: '', employeeType: ''})
        }

            return (
                <div className ="container">
                    <h1>Schedule Details</h1>
                    <form onSubmit={handleSubmit} >
                        <label htmlFor="employeeCount">Number of Employees*</label>
                        <input type="text" placeholder="Enter Number" 
                        onChange={(e) => handleChanges(e)} required value={values.employeeCount}/>

                        <label htmlFor="shiftsPerDay">Shifts Per Day*</label>
                        <input type="text" placeholder="Enter Number" 
                        onChange={(e) => handleChanges(e)} required value={values.shiftsPerDay}/>

                        <label htmlFor="totalDays">total Days*</label>
                        <input type="text" placeholder="Enter Total Days" 
                        onChange={(e) => handleChanges(e)} required value={values.totalDays}/>

                        <label htmlFor="employeeType">Employee Type*</label>
                        <select name="employeeType" id="type" onChange={(e) => handleChanges(e)}>
                            <option value="Full Time">Full Time</option>
                            <option value="Part Time">Part Time</option>
                            <option value="Contract">Contract</option>
                        </select>
                        
                        <button type="reset" onClick={ResetFun}>Reset</button>
                        <button type="submit" >Submit</button>

                    </form>
                </div>
            );        
    }
}
export default ScheduleForm;
