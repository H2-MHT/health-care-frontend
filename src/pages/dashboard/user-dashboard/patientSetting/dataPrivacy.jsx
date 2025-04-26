import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../../utils/toast";
import { deleteData, fetchDataAuth, postData } from "../../../../hooks/services/services";
import Select from "../../../../components/form/Select";
import { useTranslation } from "react-i18next";

const DataPrivacy = () => {
  const { t } = useTranslation();
  const [AuthenticationOptions, setAuthenticationOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState();
  const [SelectOption, setSelectOption] = useState([]);
  const [allOptions, setAllOptions] = useState([]);
  const navigate = useNavigate();

  const getPrivacyData = async () => {
    try {
      const response = await fetchDataAuth(`user/select-methods/`, navigate);
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const getData = await response.json();
      setAuthenticationOptions(getData?.methods);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getAllPrivacyOptions = async () => {
    try {
      const response = await fetchDataAuth(`user/all-methods/`, navigate);
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const getData = await response.json();
      setAllOptions(getData?.methods)
      let filteredOptions = getData?.methods.filter(opt => !AuthenticationOptions.includes(opt.name));
      let data  = filteredOptions?.map(item=> {
        return {
          label: item?.name,
          value: item?.id
        }
      })
      setSelectOption(data);

    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    let filteredOptions = SelectOption.filter(opt => !AuthenticationOptions.includes(opt.label));
    setSelectOption(filteredOptions);
  }, [AuthenticationOptions]);

  useEffect(() => {
    getPrivacyData();
  }, []);

  useEffect(()=>{
    getAllPrivacyOptions()
  },[AuthenticationOptions])

  const handleSubmit = async (e) => {
    if(!selectedValue?.value){
      return
    }
    e.preventDefault();
    try {
      const payload = {
        method_id: selectedValue?.value,
      };
      const response = await postData(`user/select-methods/`, payload);
      if (response.status === 200) {
        const responseJson = await response.json();
        showToast(responseJson?.message, "success");
        getPrivacyData()
        setSelectedValue("")
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleChange = (e) => {
    const selectedValue = Number(e?.target?.value); // Convert to number (if needed)
    if (!selectedValue) return; // Avoid errors if value is undefined/null
    const selectedOption = SelectOption?.find(
      (item) => item.value === selectedValue
    );
    setSelectedValue(selectedOption);
  };

  const deleteMethods = async (e, method) => {
    e.preventDefault();
    let obj  = allOptions.find(item =>  item?.name === method)
    try {
      const payload = {
        method_id: obj?.id,
      };
      const response = await deleteData(`user/select-methods/`, payload);
      if (response.status === 200) {
        const responseJson = await response.json();
        showToast(responseJson?.message, "success");
        getPrivacyData()
        setSelectedValue("")
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <div className="col-md-6">
      <p className="mb-4">{t("data-privacy.two-factor")}:</p>
      <p>{t("data-privacy.preferred")}</p>
      <div className="form-group">
        <div className="genderCheck d-flex gap-2">
          <div className="form-group min-width-170">
            <Select
              options={SelectOption}
              placeholder="Select"
              value={selectedValue}
              onChange={handleChange}
            />
          </div>
          <button
            type="button"
            className="addingBtn h-56"
            onClick={handleSubmit}
          >
            {t("common.add")}
          </button>
        </div>
      </div>

      <div>
        {AuthenticationOptions?.map((method, index) => (
          <div className="fixedTiming" key={index}>
            <p key={index}>{method} verification</p>
            <a href="#" onClick={(e) => deleteMethods(e, method)}>
              X
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataPrivacy;
