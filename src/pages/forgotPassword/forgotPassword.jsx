import React, { useState } from "react";
import Header from "../../components/ui/header/header";
import { Footer } from "../../components/ui/footer/footer";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { showToast } from "../../utils/toast";
import { InputField } from "../../components/form/InputField";
import { useNavigate } from "react-router-dom";
import Image from "../../components/form/Image"
import { postRequest } from "../../hooks/services/services";
import VerifyCode from "./verifyCode"

 
function ForgotPassword() {
  const navigate = useNavigate();
  const [stateCount,setStateCount]=useState(1)
  const [email, setEmail]=useState()


  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Field is required"),
  });

  const handleBack = (event) => {
    event.preventDefault(); 
    navigate("/login");
  };

  const onSubmit = async (data) => {
    // setLoading(true);
    try {
      const payload = {
        email: data.email,
      };
      setEmail(data.email)
      const response = await postRequest('auth/resend-otp/', payload);
      if(response?.status === 200){
        let responseData = await response.json()
        showToast(responseData?.message, "success");
        setStateCount(2)
        // navigate(`/forgot-password/verify-code?email=${data.email}`);
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });


  return (
    <div>
      <Header />
      <section class="form_part space-cmn">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              {stateCount === 1 && (
                <div class="signupTab">
                  <div class="formArea border-radius-20 border-gray">
                    <a href="login.html" class="back" onClick={handleBack}>
                      <Image src="../images/backarrow.png" /> Back
                    </a>
                    <h5 class="form-head mt-4 mb-5">Forgot password?</h5>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div class="row g-4">
                        <div class="col-md-12">
                          <div class="form-group">
                            <label>Your Email</label>
                            <InputField
                              type="email"
                              placeholder=""
                              name="email"
                              register={register}
                              error={errors?.email?.message}
                            />
                          </div>
                        </div>
                        <div class="col-md-12">
                          <button type="submit" class="black_btn">
                            Submit
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              {stateCount === 2 && (
                <VerifyCode
                  setStateCount={setStateCount}
                  stateCount={stateCount}
                  email={email}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ForgotPassword;
