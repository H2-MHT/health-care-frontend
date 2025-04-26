import React, { useState } from 'react';
import { postData, postRequest } from '../../../hooks/services/services';
import { showToast } from '../../../utils/toast';
import {Footer} from "../../../pages/dashboard/doctor-dashboard/footer/footer"
import {Link, useNavigate} from "react-router-dom"
import { useSelector } from 'react-redux';

const InvitationCode = () => {
  const [formData, setFormData] = useState({ invitationCode: '' });
  let { user } = useSelector((state) => state.auth);

  const navigate=useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    try {
      const payload = { referral_code: formData.invitationCode };
      const response = await postData(`doctors/invite/`, payload);
      if (response.status === 200) {
        const responseJson = await response.json();
        showToast(responseJson?.message, "success");
        if(user == "Doctor"){
          navigate("/dashboard")
        }else if(user == "Patient"){
          navigate("/patient/dashboard");
        }else{
          navigate("/clinic-dashboard/dashboard");
        }
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <>
    <section class="form_part space-cmn">
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="signupTab">
            <div className="formArea border-radius-20 border-gray">
              <h5 className="form-head mt-4 mb-4 text-center">Were invited?</h5>
              <p className="text-center mb-4 font-20">
                If you were referred by a friend or colleague, please enter
                their referral code below to unlock special benefits for both
                of you!
              </p>
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  <div className="col-md-12">
                    <div className="invitationCode">
                      <p>Your invitation code</p>
                      <div>
                        <input
                          type="text"
                          className="icode"
                          placeholder="0987652"
                          name="invitationCode"
                          value={formData.invitationCode}
                          onChange={(e) =>
                            setFormData({ ...formData, [e.target.name]: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <button type="submit" className="black_btn">
                      Submit
                    </button>
                  </div>

                  <div className="co-md-12">
                    <Link  className="forgot text_decor" to="/dashboard">
                      Skip and go to Dashboard
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    </section>
    <Footer/>
    </>
  );
};

export default InvitationCode;
