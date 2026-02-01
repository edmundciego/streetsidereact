// ⚡ Bolt Optimization: Caching parsed module data to avoid frequent JSON.parse calls
// This reduces main thread blocking when these functions are called repeatedly in render cycles.

let lastModuleStr = null;
let lastModuleData = null;

const getModuleData = () => {
  if (typeof window === "undefined") {
    return null;
  }
  const currentModuleStr = window.localStorage.getItem("module");

  if (currentModuleStr !== lastModuleStr) {
    lastModuleStr = currentModuleStr;
    try {
      lastModuleData = currentModuleStr ? JSON.parse(currentModuleStr) : null;
    } catch (error) {
      lastModuleData = null;
    }
  }
  return lastModuleData;
};

export const getCurrentModuleType = () => {
  return getModuleData()?.module_type;
};

export const getCurrentModuleId = () => {
  return getModuleData()?.id;
};
