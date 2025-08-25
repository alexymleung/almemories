import { useNavigate } from "react-router-dom";

function usePrevNextHandler(name, alias, topics, photoNo) {
  const navigate = useNavigate();

  // Extract topic from current URL path instead of relying on topics parameter
  const getCurrentTopicFromUrl = () => {
    const currentPath = window.location.pathname;
    const parts = currentPath.split("/").filter((part) => part !== "");

    console.log("Path parts:", parts);

    // Handle different deployment scenarios:
    // 1. Local development: ["chris", "chrisphotos", "plate35"]
    // 2. Vite preview: ["almemories", "chris", "chrisphotos", "plate35"]
    // 3. GitHub Pages: ["almemories", "jonathan", "jonfamily", "plate03"]

    let normalizedParts;

    // Check if this is GitHub Pages deployment (path starts with repository name)
    if (parts.length >= 4 && parts[0] === "almemories") {
      // GitHub Pages: ["almemories", "jonathan", "jonfamily", "plate03"]
      normalizedParts = parts.slice(1); // Remove "almemories" -> ["jonathan", "jonfamily", "plate03"]
    } else if (parts.length >= 3 && parts[0] === "almemories") {
      // Vite preview: ["almemories", "chris", "chrisphotos", "plate35"]
      normalizedParts = parts.slice(1); // Remove "almemories" -> ["chris", "chrisphotos", "plate35"]
    } else {
      // Local development: ["chris", "chrisphotos", "plate35"]
      normalizedParts = parts;
    }

    console.log("Normalized parts:", normalizedParts);

    // Determine the correct index for the topic segment
    // After normalization: ["jonathan", "jonfamily", "plate03"] - topic at index 1
    let topicSegment;

    if (normalizedParts.length >= 2) {
      topicSegment = normalizedParts[1];
      console.log("Topic segment:", topicSegment);

      // Extract the actual topic name from the combined string (e.g., "jonfamily" -> "family")
      // The topic segment is the combined name + topic (e.g., "jonfamily")
      // We need to remove the person's name prefix to get just the topic
      const personName = normalizedParts[0]; // e.g., "jonathan"
      if (topicSegment.startsWith(personName.substring(0, 3))) {
        // Use first 3 chars for matching
        const topic = topicSegment.substring(personName.substring(0, 3).length);
        console.log("Extracted topic:", topic);
        return topic;
      }

      // Fallback to includes check if the prefix method doesn't work
      if (topicSegment.includes("family")) return "family";
      if (topicSegment.includes("school")) return "school";
      if (topicSegment.includes("music")) return "music";
      if (topicSegment.includes("sports")) return "sports";
      if (topicSegment.includes("hobby")) return "hobby";
      if (topicSegment.includes("photos")) return "photos";
      if (topicSegment.includes("links")) return "links";
      if (topicSegment.includes("info")) return "info";
    }

    return "info"; // Fallback
  };

  const handlePrev = () => {
    // Extract current plate number from URL
    const currentPath = window.location.pathname;
    const plateNum = parseInt(currentPath.match(/plate(\d+)/)?.[1] || "1");
    const currentTopic = getCurrentTopicFromUrl();

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
    const currentTopic = getCurrentTopicFromUrl();

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
    const currentTopic = getCurrentTopicFromUrl();
    navigate(`/${name}/${alias}${currentTopic}`);
  };

  return { handlePrev, handleNext, handleUp };
}

export default usePrevNextHandler;
