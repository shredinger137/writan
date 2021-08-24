import React, { useEffect } from 'react';
import {useUser} from 'reactfire';

const Dashboard = () => {

    const { data: user } = useUser();

    return (
        <>
             <h3 className="title center">Dashboard</h3>
        </>


    )
};

export default Dashboard;