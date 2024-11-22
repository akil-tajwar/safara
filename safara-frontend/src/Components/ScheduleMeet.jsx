import { useState } from 'react';
import axios from 'axios';

const ScheduleMeet = () => {
    const [summary, setSummary] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [meetLink, setMeetLink] = useState('');

    const createMeet = async () => {
      try {
        const response = await axios.post("http://localhost:4000/api/meet/createMeet", {
            summary,
            startTime: new Date(startTime).toISOString(),
            endTime: new Date(endTime).toISOString()
        }); console.log(response.data);
        setMeetLink(response.data.meetLink);
        
    } catch (error) { 
     
        console.error("Error creating Google Meet event:", error);
    }
    };

   

    return (
        <div>
            <h1>Schedule a Google Meet</h1>
            <div>
                <input
                    type="text"
                    placeholder="Event Summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                       className='border border-green-500'
                />
            </div>
            <div>
                <input
                    type="datetime-local"
                    placeholder="Start Time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                   className='border border-green-500'
                />
            </div>
            <div>
                <input
                    type="datetime-local"
                    placeholder="End Time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className='border border-green-500'
                />
            </div>
            <button className='btn bg-[#125ca6] text-white my-10' onClick={createMeet}>Create Google Meet Event</button>

            {meetLink && (
                <div>
                    <h2>Google Meet Link:</h2>
                    <a href={meetLink} target="_blank" rel="noopener noreferrer">{meetLink}</a>
                </div>
            )}
        </div>
    );
};

export default ScheduleMeet;
