import React, { useEffect } from 'react'
import "../superAdmin/superAdmin.css";
import { fetchAdminData } from "../../../hooks/services/services";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();

  const [count,setCount]=useState({
    total_doctors:'',
    total_patients:'',
    total_clinics:''
  });

  const fetchCountData = async()=>{
    try{
      const response = await fetchAdminData('MasterPanel/total-count/',navigate)
      if(!response.ok)
        throw new Error("Fetching Count Data Failed");
        
      const getData = await response.json();
      setCount(getData.total_counts);
    }
    catch(error){
      console.error("Fetch Count Data Error: ",error);
      throw error;
    }
  }

  useEffect(()=>{
    fetchCountData()
  },[]);

  return (
    <div className='rightContent'>
      <div class="sortSearchArea">
        <div class="search">
          <input type="search" placeholder="search"/>
          <a href="#"><img src="../images/search-dark.svg"/></a>
        </div>       
      </div>
      <div className='row g-4'>
          <div className='col-md-4'>
            <div className='bg-white border-radius-20 padding-20 w-100'>
              <div className='sAdminBox'>
                <div className='boxTop'>
                  <div className='text'>
                    <h6>Total Doctors</h6>
                    <h5>{count.total_doctors}</h5>
                  </div>
                  <div className='imgPart'>
                    <img src='../images/general-medicine.svg' />
                  </div>
                </div>
                <div className='data'><span>{count.total_doctors} Doctors</span> added this month</div>          
              </div>
            </div>
          </div>
          <div className='col-md-4'>
            <div className='bg-white border-radius-20 padding-20 w-100'>
              <div className='sAdminBox'>
                <div className='boxTop'>
                  <div className='text'>
                    <h6>Total Patients</h6>
                    <h5>{count.total_patients}</h5>
                  </div>
                  <div className='imgPart'>
                    <img src='../images/member-account.svg' />
                  </div>
                </div>
                <div className='data'><span>{count.total_patients} Patients</span> added this month</div>
              </div>
            </div>
          </div>
          <div className='col-md-4'>
            <div className='bg-white border-radius-20 padding-20 w-100'>
              <div className='sAdminBox'>
                <div className='boxTop'>
                  <div className='text'>
                    <h6>Total Clinics</h6>
                    <h5>{count.total_clinics}</h5>
                  </div>
                  <div className='imgPart'>
                    <img src='../images/member-account.svg' />
                  </div>
                </div>
                <div className='data'><span>{count.total_clinics} Clinics</span> added this month</div>
              </div>
            </div>
          </div>
          <div className='col-md-6'>
            <div className='bg-white border-radius-20 padding-20 w-100'>
              <div className='sAdminBox'>
                <img src='../images/superadmin-1.png' className='img-fluid' />
              </div>
            </div>
          </div>
          <div className='col-md-6'>
            <div className='bg-white border-radius-20 padding-20 w-100 h-100'>
              <div className='sAdminBox text-center  h-100 d-flex align-items-center'>
                <img src='../images/superadmin-2.png' className='img-fluid mx-auto' />
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default SuperAdminDashboard
