
import React from "react";
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
import '../signup/signup.css';
import { useTranslation } from "react-i18next";

const ConfirmEmail = () => {
  const { t } = useTranslation();
    const navigate = useNavigate();
  
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
        const response = await postRequest('auth/resend-otp/', payload);
        if(response?.status === 200){
          let responseData = await response.json()
          showToast(responseData?.message, "success");
          navigate(`/forgot-password/verify-code?email=${data.email}`);
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
                <div class="signupTab">
                  <div class="formArea border-radius-20 border-gray">
                    <div className="w-100 mt-4 mb-4">
                      <a href="login.html" class="back" onClick={handleBack}>
                        <Image src="/images/backarrow.png" />{" "}
                        {t("singup.back_lable")}
                      </a>
                      <h5 class="form-head mt-4 mb-4">
                        {t("reset-password-pop.confirm-email")}
                      </h5>
                      <p class="text-center mb-4">
                        {t("reset-password-pop.sent-code")}
                        <span class="blue_txt">helloworld@gmail.com</span>
                      </p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div class="row g-4">
                        <div class="col-md-12">
                          <div class="form-group">
                            <label>
                              {t("reset-password-pop.verification")}:
                            </label>
                            <InputField
                              type="text"
                              placeholder=""
                              name="email"
                            />
                          </div>
                        </div>
                        <div class="col-md-12 mb-5">
                          <button type="submit" class="black_btn">
                            {t("common.submit")}
                          </button>
                        </div>
                        <div class="co-md-12">
                          <a href="#" class="forgot text_decor">
                            {t("reset-password-pop.send-again")}
                          </a>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

export default ConfirmEmail

