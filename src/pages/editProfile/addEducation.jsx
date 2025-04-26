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

const AddEducation = ({
  setModelOpen,
  Modal,
  modelOpen,
  EditedDetail,
  setIsEducation,
  getEducation,
}) => {
  const { t } = useTranslation("add-education");
  
  // state for Button-spinner
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
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
  // State for media and skills
  const [media, setMedia] = useState();
  const [skills, setSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdwn, setdropdwn] = useState(false);

  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const maxSkills = 10;
  // Fetch skills from API
  useEffect(() => {
    const getSkills = async () => {
      setIsLoadingSkills(true);
      try {
        const response = await fetchData("user/skills/");
        if (response.status === 200) {
          const skillsData = await response.json();
          // Direct array of skills objects with id and name
          setAvailableSkills(skillsData || []);
        } else {
          console.error("Failed to fetch skills");
          showToast("Failed to load skills", "error");
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
        showToast("Error loading skills", "error");
      } finally {
        setIsLoadingSkills(false);
      }
    };

    getSkills();
  }, []);

  // Reset form when EditedDetail changes
  useEffect(() => {
    // Reset form fields
    reset({
      school: EditedDetail?.school || "",
      degree: EditedDetail?.degree || "",
      field_of_study: EditedDetail?.field_of_study || "",
      grade: EditedDetail?.grade || "",
      activities_and_societies: EditedDetail?.activities_and_societies || "",
      description: EditedDetail?.description || "",
    });

    // Reset dates
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

    // Reset skills
    if (EditedDetail?.skills && Array.isArray(EditedDetail.skills)) {
      const preloadedSkills = EditedDetail.skills.map((skill, index) => ({
        id: typeof skill === "object" ? skill.id : skill,
        name: typeof skill === "object" ? skill.name : String(skill),
      }));
      setSkills(preloadedSkills);
    } else {
      setSkills([]);
    }

    if (EditedDetail?.media) {
      const mediaArray = Array.isArray(EditedDetail.media)
        ? EditedDetail.media
        : [EditedDetail.media];

      setMedia(mediaArray.map((Iurl) => ({ url: Iurl, type: "image" })));
    } else {
      setMedia([]);
    }
  }, [EditedDetail, reset, modelOpen]);

  // Update skills display names if needed when available skills are loaded
  useEffect(() => {
    if (availableSkills.length > 0 && skills.length > 0) {
      const updatedSkills = skills.map((skill) => {
        if (!skill.name || skill.name === String(skill.id)) {
          const matchingSkill = availableSkills.find((s) => s.id === skill.id);
          if (matchingSkill) {
            return { ...skill, name: matchingSkill.name };
          }
        }
        return skill;
      });
      setSkills(updatedSkills);
    }
  }, [availableSkills]);
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
    const skillsArray = skills.map((skill) => skill.id);
    formData.append("skills", JSON.stringify(skillsArray));
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

  // Filter available skills based on search term
  const filteredSkills = availableSkills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !skills.some((selectedSkill) => selectedSkill.id === skill.id)
  );
  // Add Skill
  const handleAddSkill = (skill) => {
    setdropdwn(true);
    setSkills([...skills, skill]);
    setSearchTerm("");
    setShowSkillDropdown(false);
  };
  // Remove a skill
  const handleRemoveSkill = (skillToRemove) => {
    let filtered = skills.filter((skill) => skill.id !== skillToRemove.id);
    setSkills(filtered);
  };

  // Handle clicks outside of the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowSkillDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSkillDropdown]);

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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="col-md-12">
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
            <div className="col-md-12">
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
            <div className="col-md-12">
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

            <div className="col-md-12">
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

            <div className="col-md-12">
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
            <div className="col-md-12">
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
            <div className="col-md-12">
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
            <div className="col-md-12">
              <h5>{t("add-education.skills")}</h5>
              <p>{t("add-education.skills-text")}</p>

              <div className="form-group" style={{ position: "relative" }}>
                <InputField
                  id="skills-search"
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSkillDropdown(true);
                  }}
                  placeholder="Search skills..."
                  onFocus={() => setShowSkillDropdown(true)}
                />
                {showSkillDropdown && (
                  <div
                    id="skills-dropdown"
                    ref={dropdownRef}
                    className="skills-dropdown"
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      width: "100%",
                      maxHeight: "200px",
                      overflowY: "auto",
                      backgroundColor: "white",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      zIndex: 10,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    {isLoadingSkills ? (
                      <div className="p-2 text-center">Loading skills...</div>
                    ) : filteredSkills.length > 0 ? (
                      filteredSkills.map((skill) => (
                        <div
                          key={skill.id}
                          className="skill-option p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleAddSkill(skill)}
                          style={{
                            padding: "8px 12px",
                            cursor: "pointer",
                          }}
                          onMouseOver={(e) =>
                            (e.target.style.backgroundColor = "#f0f0f0")
                          }
                          onMouseOut={(e) =>
                            (e.target.style.backgroundColor = "transparent")
                          }
                        >
                          {skill.name}
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-center">
                        No matching skills found
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="skills-list" style={{ marginTop: "10px" }}>
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="skill-box"
                    style={{
                      display: "inline-block",
                      margin: "5px",
                      padding: "5px 10px",
                      backgroundColor: "#e0e7ff",
                      borderRadius: "3px",
                      position: "relative",
                    }}
                  >
                    <span className="skill-name">{skill.name}</span>
                    <button
                      type="button"
                      className="remove-skill-btn"
                      onClick={() => handleRemoveSkill(skill)}
                      style={{
                        marginLeft: "5px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#4a5568",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {skills.length === 0 && (
                  <p className="text-muted">No skills selected</p>
                )}
              </div>
            </div>
            <div className="col-md-12">
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
