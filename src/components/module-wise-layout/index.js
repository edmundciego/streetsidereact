import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStoredDataModule } from "redux/slices/storedData";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import HomePageComponents from "../home/HomePageComponents";

const ModuleWiseLayout = ({
  configData,
  landingPageData,
  routeSection,
  routeCategory,
}) => {
  const { selectedModule } = useSelector((state) => state.utilsData);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!selectedModule?.id) return;
    dispatch(setStoredDataModule(selectedModule.id));
  }, [dispatch, selectedModule?.id]);

  return (
    <CustomStackFullWidth>
      {/* ModuleSelect sidebar hidden */}
      <HomePageComponents
        key={selectedModule?.id ?? "loading"}
        configData={configData}
        landingPageData={landingPageData}
        routeSection={routeSection}
        routeCategory={routeCategory}
      />
    </CustomStackFullWidth>
  );
};

export default React.memo(ModuleWiseLayout);
