import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputField } from "../../components/form/InputField";
import { showToast } from "../../utils/toast";
import TextArea from "../../components/form/TextArea";
import {
  AddFormData,
  fetchData,
  updateFormData,
} from "../../hooks/services/services";
import * as Yup from "yup";
import DatePickerComp from "../../components/ui/loader/datepicker";
import LoadingButton from "../../components/ui/loader/LoadingButton";
import { useTranslation } from "react-i18next";
import SkillsInput from "./addSkills";

const AddEducation = ({
  setModelOpen,
  Modal,
  modelOpen,
  EditedDetail,
  setIsEducation,
  getEducation,
}) => {
  const { t } = useTranslation("add-education");
  const [loading, setLoading] = useState(false);
  const [media, setMedia] = useState();
  const [skills, setSkills] = useState([]);
  const schema = Yup.object().shape({
    school: Yup.string().required("School is required"),
    degree: Yup.string().required("Degree is Required"),
  });
  // State for date fields
  const [startDate, setStartDate] = useState(
    EditedDetail?.start_month_year
      ? new Date(EditedDetail.start_month_year)
      : null
  );
  const [endDate, setEndDate] = useState(
    EditedDetail?.end_month_year ? new Date(EditedDetail.end_month_year) : null
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      school: EditedDetail?.school || "",
      degree: EditedDetail?.degree || "",
      field_of_study: EditedDetail?.field_of_study || "",
      grade: EditedDetail?.grade || "",
      activities_and_societies: EditedDetail?.activities_and_societies || "",
      description: EditedDetail?.description || "",
    },
    resolver: yupResolver(schema),
  });

  // Reset form when EditedDetail changes
  useEffect(() => {
    reset({
      school: EditedDetail?.school || "",
      degree: EditedDetail?.degree || "",
      field_of_study: EditedDetail?.field_of_study || "",
      grade: EditedDetail?.grade || "",
      activities_and_societies: EditedDetail?.activities_and_societies || "",
      description: EditedDetail?.description || "",
    });

    setStartDate(
      EditedDetail?.start_month_year
        ? new Date(EditedDetail.start_month_year)
        : null
    );
    setEndDate(
      EditedDetail?.end_month_year
        ? new Date(EditedDetail.end_month_year)
        : null
    );
    setSkills(EditedDetail?.skills)
    if (EditedDetail?.media) {
      const mediaArray = Array.isArray(EditedDetail.media)
        ? EditedDetail.media
        : [EditedDetail.media];

      setMedia(mediaArray.map((Iurl) => ({ url: Iurl, type: "image" })));
    } else {
      setMedia([]);
    }
  }, [EditedDetail, reset, modelOpen]);

  // Format date for API submission
  const formatDate = (date) => {
    return date ? new Date(date).toISOString().slice(0, 7) : "";
  };
  const createEducationFormData = (data) => {
    const formData = new FormData();
    formData.append("school", data.school || "");
    formData.append("degree", data.degree || "");
    formData.append("field_of_study", data.field_of_study || "");
    formData.append("start_month_year", formatDate(startDate) || "");
    formData.append("end_month_year", formatDate(endDate) || "");
    formData.append("grade", data.grade || "");
    formData.append(
      "activities_and_societies",
      data.activities_and_societies || ""
    );
    formData.append("description", data.description || "");
    formData.append("skills", JSON.stringify(skills));
    if (media.length > 0) {
      media.forEach((item, index) => {
        if (item.file) {
          formData.append(`media`, item.file); // Appending each file separately
        }
      });
    }
    return formData;
  };
  // Submit form handler
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (startDate && endDate && startDate > endDate) {
        showToast("Start date cannot be greater than end date.", "error");
        setLoading(false);
        return;
      }
      const payload = createEducationFormData(data);
      let response;
      if (EditedDetail?.id) {
        response = await updateFormData(
          `user/education/${EditedDetail.id}/`,
          payload
        );
      } else {
        response = await AddFormData(`user/education/`, payload);
        reset({ school: "" });
      }

      if (response.status === 200 || response.status === 201) {
        getEducation();
        const responseJson = await response.json();
        showToast(
          responseJson?.message || "Education saved successfully!",
          "success"
        );
        setModelOpen(false);
        setIsEducation(true);
        setSkills([])
      } else {
        const errorData = await response.json();
        showToast(
          errorData?.message || "Error saving education details",
          "error"
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showToast(error.message || "An unexpected error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  // Media management functions
  const handleAddMediaClick = () => {
    document.getElementById("media-upload").click();
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);

    files.forEach((file) => {
      if (
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/svg+xml"
      ) {
        setMedia((prevFiles) => [...prevFiles, { file, type: "image" }]);
      } else {
        console.log("Invalid file type: ", file.name);
      }
    });
  };

  const handleRemoveFile = (index) => {
    setMedia((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <Modal
      show={modelOpen}
      backdrop="static"
      keyboard={false}
      onHide={() => setModelOpen(false)}
      size="lg"
    >
      <Modal.Header closeButton>
        <div className="modal-heading-alignment">
          {EditedDetail ? (
            <h5 className="modal-title text-left">
              {t("add-education.edit-education")}
            </h5>
          ) : (
            <h5 className="modal-title text-left">
              {t("add-education.add-education")}
            </h5>
          )}
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="educationDetail">
          {console.log(">>>>>>>>>>>vvv", skills)}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="col-md-12 mt-2">
              <div className="form-group">
                <label>{t("add-education.school")}</label>
                <InputField
                  type="text"
                  placeholder="Ex: Boston University"
                  name="school"
                  register={register}
                  error={errors?.school?.message}
                />
              </div>
            </div>
            <div className="col-md-12 mt-2">
              <div className="form-group">
                <label>{t("add-education.degree")}</label>
                <InputField
                  type="text"
                  placeholder="Ex: Bachelor's"
                  name="degree"
                  register={register}
                  error={errors?.degree?.message}
                />
              </div>
            </div>
            <div className="col-md-12 mt-2">
              <div className="form-group">
                <label>{t("add-education.field-of-study")}</label>
                <InputField
                  type="text"
                  placeholder="Ex: Business"
                  name="field_of_study"
                  register={register}
                />
              </div>
            </div>

            <div className="col-md-12 mt-2">
              <div className="row g-3">
                <DatePickerComp
                  label={t("add-education.start-date")}
                  selectedDate={startDate}
                  onChange={setStartDate}
                />
                <DatePickerComp
                  label={t("add-education.end-date")}
                  selectedDate={endDate}
                  onChange={setEndDate}
                />
              </div>
            </div>

            <div className="col-md-12 mt-2">
              <div className="form-group">
                <label>{t("add-education.grade")}</label>
                <InputField
                  type="text"
                  placeholder=""
                  name="grade"
                  register={register}
                />
              </div>
            </div>
            <div className="col-md-12 mt-2">
              <div className="form-group">
                <label>{t("add-education.activites-societies")}</label>
                <TextArea
                  rows="4"
                  placeholder="Ex: Alpha Phi Omega, Marching Band, Volleyball"
                  name="activities_and_societies"
                  register={register}
                />
              </div>
            </div>
            <div className="col-md-12 mt-2">
              <div className="form-group">
                <label>{t("add-education.description")}</label>
                <TextArea
                  rows="4"
                  placeholder="Ex: Describe your education experience"
                  name="description"
                  register={register}
                />
              </div>
            </div>
            <div className="col-md-12 mt-2">
              <h5>{t("add-education.skills")}</h5>
              <p>{t("add-education.skills-text")}</p>
              <SkillsInput setSkills={setSkills} skills={skills}/>
            </div>
            <div className="col-md-12 mt-2">
              <h5>{t("add-education.media")}</h5>
              <p>{t("add-education.media-text")}</p>
              <button
                type="button"
                className="transparent_btn"
                onClick={handleAddMediaClick}
              >
                {t("common.add-media")}
              </button>

              <input
                type="file"
                id="media-upload"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileUpload}
                multiple
              />

              <div className="media-preview">
                {media?.map((item, index) => (
                  <div key={index} className="media-item">
                    {item.type === "image" ? (
                      <div
                        style={{
                          position: "relative",
                          display: "inline-block",
                          margin: "10px",
                        }}
                      >
                        <img
                          src={
                            item.file
                              ? URL.createObjectURL(item.file)
                              : item.url.file
                          }
                          alt="Preview"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "5px",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            backgroundColor: "gray",
                            color: "white",
                            borderRadius: "50%",
                            border: "none",
                            width: "20px",
                            height: "20px",
                          }}
                        >
                          X
                        </button>
                      </div>
                    ) : (
                      <div
                        style={{
                          width: "100px",
                          height: "100px",
                          margin: "10px",
                          borderRadius: "5px",
                          backgroundColor: "#e0e0e0",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <span>Invalid File</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <hr />
            <div className="col-md-12">
              <LoadingButton
                loading={loading}
                type="submit"
                className="blue_btn mx-auto"
                buttonText={t("common.save")}
              />
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AddEducation;
