import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setResetStoredData } from "redux/slices/storedData";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import HomePageComponents from "../home/HomePageComponents";

const ModuleWiseLayout = ({ configData, landingPageData, routeSection, routeCategory }) => {
	const [rerender, setRerender] = useState(false);
	const { selectedModule } = useSelector((state) => state.utilsData);
	const dispatch = useDispatch();

	useEffect(() => {
		if (!selectedModule) return;
		dispatch(setResetStoredData());
		setRerender((previous) => !previous);
	}, [dispatch, selectedModule]);

	return (
		<CustomStackFullWidth>
			{/* ModuleSelect sidebar hidden */}
			<HomePageComponents
				key={rerender}
				configData={configData}
				landingPageData={landingPageData}
				routeSection={routeSection}
				routeCategory={routeCategory}
			/>
		</CustomStackFullWidth>
	);
};

export default React.memo(ModuleWiseLayout);
