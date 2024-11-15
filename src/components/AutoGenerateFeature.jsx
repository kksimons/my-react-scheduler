import React from 'react';
import AutoGenerateFormImage from '@assets/auto-generate-schedule.png';
import AutoGenerateSchedule from '@assets/schedule-only.png'; 
const AutoGenerateFeature = () => {
    return (
        <div className="auto-generate-container">
            <div className="auto-generate-text-container">
                <h1 className="auto-generate-primary-heading"> Auto-Generate Schedules</h1>
                <p className="auto-generate-text">Do all the thinking for quick and easy way to generate schedule</p>
            </div>
            <div className="auto-generate-img-container">
                <div className='auto-generate-form-img'>
                    <img src={AutoGenerateFormImage} alt=""/>
                </div>
                <div className='schedule-only-img'>
                    <img  src={AutoGenerateSchedule} alt="" />
                </div>

            </div>

        </div>
    );

};

export default AutoGenerateFeature;