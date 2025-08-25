import { useNavigate } from "react-router-dom";

function usePrevNextHandler(name, alias, topics, photoNo) {
  const navigate = useNavigate();

  // Use the topics parameter directly instead of parsing from URL
  // This avoids the complex path parsing logic that was causing issues
  const getCurrentTopic = () => {
    // topics parameter should contain the current topic (e.g., "family", "photos", etc.)
    // If topics is not provided or invalid, fall back to "info"
    if (topics && typeof topics === "string") {
      return topics;
    }
    return "info";
  };

  const handlePrev = () => {
    // Extract current plate number from URL
    const currentPath = window.location.pathname;
    const plateNum = parseInt(currentPath.match(/plate(\d+)/)?.[1] || "1");
    const currentTopic = getCurrentTopic();

    if (plateNum === 1) {
      navigate(
        `/${name}/${alias}${currentTopic}/plate${String(photoNo).padStart(
          2,
          "0"
        )}`
      );
    } else if (plateNum > 1 && plateNum <= photoNo) {
      navigate(
        `/${name}/${alias}${currentTopic}/plate${String(plateNum - 1).padStart(
          2,
          "0"
        )}`
      );
    }
  };

  const handleNext = () => {
    const currentPath = window.location.pathname;
    const plateNum = parseInt(currentPath.match(/plate(\d+)/)?.[1] || "1");
    const currentTopic = getCurrentTopic();

    console.log("Current path:", currentPath);
    console.log("Plate number:", plateNum);
    console.log("Current topic:", currentTopic);
    console.log("Name:", name);
    console.log("Alias:", alias);

    if (plateNum === photoNo) {
      const targetPath = `/${name}/${alias}${currentTopic}/plate01`;
      console.log("Navigating to:", targetPath);
      navigate(targetPath);
    } else if (plateNum >= 1 && plateNum < photoNo) {
      const targetPath = `/${name}/${alias}${currentTopic}/plate${String(
        plateNum + 1
      ).padStart(2, "0")}`;
      console.log("Navigating to:", targetPath);
      navigate(targetPath);
    }
  };

  const handleUp = () => {
    const currentTopic = getCurrentTopic();
    navigate(`/${name}/${alias}${currentTopic}`);
  };

  return { handlePrev, handleNext, handleUp };
}

export default usePrevNextHandler;
