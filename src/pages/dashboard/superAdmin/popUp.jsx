import CommonModal from "../../../components/form/Modal";
import { putData } from "../../../hooks/services/services";
import { showToast } from "../../../utils/toast";
import { useTranslation } from "react-i18next";


export default function PopUp({
  open,
  setOpen,
  functionType,
  userType,
  userObject,
  callFetch,
}) {
const { t } = useTranslation();
  let url = "MasterPanel/user_";
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (functionType === "Block" || functionType === "Unblock")
      url += `block/${userObject.id}/?role=`;
    else if (functionType === "Delete") url += `delete/${userObject.id}/?role=`;  

    if (userType === "Patient") url += "Patient";
    else if (userType === "Doctor") url += "Doctor";
    else if (userType === "Clinic") url += "Clinic";

    console.log(url);
    let payload;
    try {
      if (functionType === "Block")
        payload = { role: userType, is_active: false }; // block user
      else if (functionType === "Unblock")
        payload = { role: userType, is_active: true }; // unblock user
      else if (functionType === "Delete")
        payload = { role: userType, is_deleted: true }; // soft-delete user

      const response = await putData(url, JSON.stringify(payload));
      if (response?.status === 200) {
        setOpen(false);
        const responseData = await response.json();
        console.log("response: ", responseData);
        callFetch();
        showToast(responseData?.message, "success");
      }
    } catch (error) {
      showToast("Cannot perform the task", "error");
    }
  };

  const closeModal = () => {
    setOpen(false);
  };

  const confirmPopUp = () => {
    return (
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg">
        <form>
          <div className="row g-2">
            <div className="col-md-12 mb-2">
              <div className="form-group">
                {t("superadmin.are-you-sure")}
                {functionType.toLowerCase()} {userType}{" "}
                {userObject?.first_name
                  ? `${userObject.first_name} ${userObject.last_name}`
                  : userObject?.name}
                ?
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  };

  return (
    <CommonModal
      size="lg"
      show={open}
      title={`${functionType} ${userType}`}
      body={confirmPopUp()}
      onHide={closeModal}
      footerButtons={[
        { label: "Yes", onClick: handleSubmit, className: "transparent_btn" },
        { label: "No", onClick: closeModal, className: "blue_btn" },
      ]}
    ></CommonModal>
  );
}
