import React from 'react'
import "./dashboard.css";


const FindDoctor = () => {
    return (
        <>
            <div class="rightContent">
                <div className='bg-white border-radius-20 padding-20 h-100'>
                    <div className='top d-flex align-items-center justify-content-between'>
                        <h3 className='mb-0'>Find Doctor</h3>
                        <div className="sortSearchArea mb-0">
                            <div className="search">
                            <input
                                type="search"
                                placeholder="Search"
                            />
                            <a href="#">
                                <img src="../images/search-dark.svg" alt="search" />
                            </a>
                            </div>
                            <div className="sorting">
                                <select>
                                    <option>Sort By</option>
                                    <option>1</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className='findDoc'>
                        <div className='findDocBox'>
                            <div className='imgandName'>
                                <img src='../images/sample.png' className='img-fluid'/>
                                <div className='fDetail'>
                                    <h5>Amanda Clara</h5>
                                    <p>specialist | 12 years experience</p>
                                    <span>Padiatric</span>
                                </div>
                            </div>
                            <div className='timeandPrice'>
                                <div className='timeP'>
                                    <img src='../images/dark-clock.svg' className='img-fluid'/>
                                    <div className='timeDetails'>
                                        <h5>Tue, Thu</h5>
                                        <p>10:00 AM-01:00 PM</p>
                                    </div>
                                </div>
                                <div className='timeP'>
                                    <img src='../images/coins.webp' className='img-fluid'/>
                                    <div className='timeDetails'>
                                        <h5>$25</h5>
                                        <p>Starting</p>
                                    </div>
                                </div>
                            </div>
                            <button className='blue_btn w-100'>Book an appointment</button>
                        </div>
                        <div className='findDocBox'>
                            <div className='imgandName'>
                                <img src='../images/sample.png' className='img-fluid'/>
                                <div className='fDetail'>
                                    <h5>Amanda Clara</h5>
                                    <p>specialist | 12 years experience</p>
                                    <span>Padiatric</span>
                                </div>
                            </div>
                            <div className='timeandPrice'>
                                <div className='timeP'>
                                    <img src='../images/dark-clock.svg' className='img-fluid'/>
                                    <div className='timeDetails'>
                                        <h5>Tue, Thu</h5>
                                        <p>10:00 AM-01:00 PM</p>
                                    </div>
                                </div>
                                <div className='timeP'>
                                <img src='../images/coins.webp' className='img-fluid'/>
                                    <div className='timeDetails'>
                                        <h5>$25</h5>
                                        <p>Starting</p>
                                    </div>
                                </div>
                            </div>
                            <button className='blue_btn w-100'>Book an appointment</button>
                        </div>
                        <div className='findDocBox'>
                            <div className='imgandName'>
                                <img src='../images/sample.png' className='img-fluid'/>
                                <div className='fDetail'>
                                    <h5>Amanda Clara</h5>
                                    <p>specialist | 12 years experience</p>
                                    <span>Padiatric</span>
                                </div>
                            </div>
                            <div className='timeandPrice'>
                                <div className='timeP'>
                                    <img src='../images/dark-clock.svg' className='img-fluid'/>
                                    <div className='timeDetails'>
                                        <h5>Tue, Thu</h5>
                                        <p>10:00 AM-01:00 PM</p>
                                    </div>
                                </div>
                                <div className='timeP'>
                                <img src='../images/coins.webp' className='img-fluid'/>
                                    <div className='timeDetails'>
                                        <h5>$25</h5>
                                        <p>Starting</p>
                                    </div>
                                </div>
                            </div>
                            <button className='blue_btn w-100'>Book an appointment</button>
                        </div>
                        <div className='findDocBox'>
                            <div className='imgandName'>
                                <img src='../images/sample.png' className='img-fluid'/>
                                <div className='fDetail'>
                                    <h5>Amanda Clara</h5>
                                    <p>specialist | 12 years experience</p>
                                    <span>Padiatric</span>
                                </div>
                            </div>
                            <div className='timeandPrice'>
                                <div className='timeP'>
                                    <img src='../images/dark-clock.svg' className='img-fluid'/>
                                    <div className='timeDetails'>
                                        <h5>Tue, Thu</h5>
                                        <p>10:00 AM-01:00 PM</p>
                                    </div>
                                </div>
                                <div className='timeP'>
                                <img src='../images/coins.webp' className='img-fluid'/>
                                    <div className='timeDetails'>
                                        <h5>$25</h5>
                                        <p>Starting</p>
                                    </div>
                                </div>
                            </div>
                            <button className='blue_btn w-100'>Book an appointment</button>
                        </div>
                        <div className='findDocBox'>
                            <div className='imgandName'>
                                <img src='../images/sample.png' className='img-fluid'/>
                                <div className='fDetail'>
                                    <h5>Amanda Clara</h5>
                                    <p>specialist | 12 years experience</p>
                                    <span>Padiatric</span>
                                </div>
                            </div>
                            <div className='timeandPrice'>
                                <div className='timeP'>
                                    <img src='../images/dark-clock.svg' className='img-fluid'/>
                                    <div className='timeDetails'>
                                        <h5>Tue, Thu</h5>
                                        <p>10:00 AM-01:00 PM</p>
                                    </div>
                                </div>
                                <div className='timeP'>
                                <img src='../images/coins.webp' className='img-fluid'/>
                                    <div className='timeDetails'>
                                        <h5>$25</h5>
                                        <p>Starting</p>
                                    </div>
                                </div>
                            </div>
                            <button className='blue_btn w-100'>Book an appointment</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FindDoctor
